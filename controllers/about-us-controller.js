const AboutUs = require("../models/about-us-model");

// Get all about us entries
const getAllAboutUs = async (req, res) => {
  try {
    const aboutUsEntries = await AboutUs.find();
    res.status(200).json(aboutUsEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new about us entry
const createAboutUs = async (req, res) => {
  try {
    const aboutUsData = {
      aboutUs: {
        description: req.body.aboutUsDescription,
        photos: req.files?.aboutUsPhotos?.map((file) => file.filename) || [],
      },
      goal: {
        description: req.body.goalDescription,
        photo: req.files?.goalPhoto?.[0]?.filename,
      },
      vision: {
        description: req.body.visionDescription,
        photo: req.files?.visionPhoto?.[0]?.filename,
      },
      message: {
        description: req.body.messageDescription,
        photo: req.files?.messagePhoto?.[0]?.filename,
      },
      values: {
        description: req.body.valuesDescription,
        photo: req.files?.valuesPhoto?.[0]?.filename,
      },
    };

    const newAboutUs = new AboutUs(aboutUsData);
    const savedAboutUs = await newAboutUs.save();
    res.status(201).json(savedAboutUs);
  } catch (error) {
    console.error("Error creating about us:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Update about us entry
const updateAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAboutUs = await AboutUs.findById(id);

    if (!existingAboutUs) {
      return res.status(404).json({ message: "About Us entry not found" });
    }

    const updateData = {
      aboutUs: {
        description:
          req.body.aboutUsDescription || existingAboutUs.aboutUs.description,
        photos: req.files?.aboutUsPhotos
          ? req.files.aboutUsPhotos.map((file) => file.filename)
          : existingAboutUs.aboutUs.photos,
      },
      goal: {
        description:
          req.body.goalDescription || existingAboutUs.goal.description,
        photo:
          req.files?.goalPhoto?.[0]?.filename || existingAboutUs.goal.photo,
      },
      vision: {
        description:
          req.body.visionDescription || existingAboutUs.vision.description,
        photo:
          req.files?.visionPhoto?.[0]?.filename || existingAboutUs.vision.photo,
      },
      message: {
        description:
          req.body.messageDescription || existingAboutUs.message.description,
        photo:
          req.files?.messagePhoto?.[0]?.filename ||
          existingAboutUs.message.photo,
      },
      values: {
        description:
          req.body.valuesDescription || existingAboutUs.values.description,
        photo:
          req.files?.valuesPhoto?.[0]?.filename || existingAboutUs.values.photo,
      },
    };

    const updatedAboutUs = await AboutUs.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedAboutUs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Delete about us entry
const deleteAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAboutUs = await AboutUs.findByIdAndDelete(id);
    if (!deletedAboutUs) {
      return res.status(404).json({ message: "About Us entry not found" });
    }
    res.status(200).json({ message: "About Us entry deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get about us section
const getAboutUsSection = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({}, "aboutUs");
    if (!aboutUs) {
      return res.status(404).json({ message: "About Us section not found" });
    }
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get goal section
const getGoalSection = async (req, res) => {
  try {
    const goal = await AboutUs.findOne({}, "goal");
    if (!goal) {
      return res.status(404).json({ message: "Goal section not found" });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vision section
const getVisionSection = async (req, res) => {
  try {
    const vision = await AboutUs.findOne({}, "vision");
    if (!vision) {
      return res.status(404).json({ message: "Vision section not found" });
    }
    res.status(200).json(vision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get values section
const getValuesSection = async (req, res) => {
  try {
    const values = await AboutUs.findOne({}, "values");
    if (!values) {
      return res.status(404).json({ message: "Values section not found" });
    }
    res.status(200).json(values);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get message section
const getMessageSection = async (req, res) => {
  try {
    const message = await AboutUs.findOne({}, "message");
    if (!message) {
      return res.status(404).json({ message: "Message section not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
  getAboutUsSection,
  getGoalSection,
  getVisionSection,
  getValuesSection,
  getMessageSection,
};
