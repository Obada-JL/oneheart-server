require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model"); // Import the User model

// Connect to MongoDB
const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User data to seed
const users = [
  { username: "admin", email: "admin@oneheart.team", password: "112233" },
];

// Function to seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    // await User.deleteMany();

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert users into DB
    await User.insertMany(hashedUsers);
    console.log("Users seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedUsers();
