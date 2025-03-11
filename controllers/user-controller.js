const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Getting user with ID:", userId);

    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Convert _id to string format for consistency
    const userResponse = {
      ...user.toObject(),
      _id: user._id.toString(),
      id: user._id.toString() // Add id field for frontend consistency
    };

    console.log("User found:", {
      id: userResponse.id,
      username: userResponse.username
    });

    res.json(userResponse);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Validate role
    const validRole = role === "admin" || role === "user" ? role : "user";

    // Create new user
    const newUser = new User({
      username,
      password,
      role: validRole,
    });

    await newUser.save();
    
    // Return user without password
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const userId = req.params.id;

    console.log("Updating user with ID:", userId);
    console.log("Update data:", { username, role, hasPassword: !!password });

    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if username already exists (for another user)
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Prepare update data
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    
    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", {
      id: updatedUser._id.toString(),
      username: updatedUser.username
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 