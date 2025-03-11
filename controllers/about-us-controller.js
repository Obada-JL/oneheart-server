const AboutUs = require("../models/about-us-model");
const fs = require('fs');
const path = require('path');

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
    // Parse the data from the form
    let data = {};
    try {
      data = JSON.parse(req.body.data || '{}');
      console.log("Parsed data:", data);
      console.log("About Us description from form:", data.aboutUs?.description);
    } catch (e) {
      console.warn("Error parsing data:", e);
    }
    
    // Create new AboutUs document with default empty values for all fields
    const aboutUs = new AboutUs({
      aboutUs: {
        description: {
          en: data.aboutUs?.description?.en || "",
          ar: data.aboutUs?.description?.ar || ""
        },
        photos: [] // Will be updated with file paths
      },
      goal: {
        description: {
          en: data.goal?.description?.en || "",
          ar: data.goal?.description?.ar || ""
        },
        photo: "" // Will be updated with file path
      },
      vision: {
        description: {
          en: data.vision?.description?.en || "",
          ar: data.vision?.description?.ar || ""
        },
        photo: "" // Will be updated with file path
      },
      message: {
        description: {
          en: data.message?.description?.en || "",
          ar: data.message?.description?.ar || ""
        },
        photo: "" // Will be updated with file path
      },
      values: {
        description: {
          en: data.values?.description?.en || "",
          ar: data.values?.description?.ar || ""
        },
        photo: "" // Will be updated with file path
      }
    });

    // Handle photos
    if (req.files) {
      // Handle aboutUs photos
      if (req.files['aboutUsPhotos']) {
        aboutUs.aboutUs.photos = req.files['aboutUsPhotos'].map(file => file.filename);
      }
      
      // Handle section photos
      if (req.files['goalPhoto'] && req.files['goalPhoto'][0]) {
        aboutUs.goal.photo = req.files['goalPhoto'][0].filename;
      }
      if (req.files['visionPhoto'] && req.files['visionPhoto'][0]) {
        aboutUs.vision.photo = req.files['visionPhoto'][0].filename;
      }
      if (req.files['messagePhoto'] && req.files['messagePhoto'][0]) {
        aboutUs.message.photo = req.files['messagePhoto'][0].filename;
      }
      if (req.files['valuesPhoto'] && req.files['valuesPhoto'][0]) {
        aboutUs.values.photo = req.files['valuesPhoto'][0].filename;
      }
    }

    console.log("About to save:", aboutUs);
    const savedAboutUs = await aboutUs.save();
    res.status(201).json(savedAboutUs);
  } catch (error) {
    console.warn("Error creating about us:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update about us entry
const updateAboutUs = async (req, res) => {
  try {
    // Parse the data from the form
    let data = {};
    try {
      data = JSON.parse(req.body.data || '{}');
    } catch (e) {
      console.warn("Error parsing data:", e);
    }
    
    // Find existing about us entry
    const existingAboutUs = await AboutUs.findOne();
    if (!existingAboutUs) {
      return res.status(404).json({ message: "About Us entry not found" });
    }

    // Prepare update data with default empty values for aboutUs description
    const updateData = {
      aboutUs: {
        description: {
          en: data.aboutUs?.description?.en || existingAboutUs.aboutUs?.description?.en || "",
          ar: data.aboutUs?.description?.ar || existingAboutUs.aboutUs?.description?.ar || ""
        },
        photos: existingAboutUs.aboutUs?.photos || [] // Keep existing photos by default
      },
      goal: {
        description: {
          en: data.goal?.description?.en || existingAboutUs.goal?.description?.en || "",
          ar: data.goal?.description?.ar || existingAboutUs.goal?.description?.ar || ""
        },
        photo: existingAboutUs.goal?.photo || "" // Keep existing photo by default
      },
      vision: {
        description: {
          en: data.vision?.description?.en || existingAboutUs.vision?.description?.en || "",
          ar: data.vision?.description?.ar || existingAboutUs.vision?.description?.ar || ""
        },
        photo: existingAboutUs.vision?.photo || ""
      },
      message: {
        description: {
          en: data.message?.description?.en || existingAboutUs.message?.description?.en || "",
          ar: data.message?.description?.ar || existingAboutUs.message?.description?.ar || ""
        },
        photo: existingAboutUs.message?.photo || ""
      },
      values: {
        description: {
          en: data.values?.description?.en || existingAboutUs.values?.description?.en || "",
          ar: data.values?.description?.ar || existingAboutUs.values?.description?.ar || ""
        },
        photo: existingAboutUs.values?.photo || ""
      }
    };

    // Update photos if new ones are uploaded
    if (req.files) {
      if (req.files['aboutUsPhotos']) {
        updateData.aboutUs.photos = req.files['aboutUsPhotos'].map(file => file.filename);
      }
      if (req.files['goalPhoto'] && req.files['goalPhoto'][0]) {
        updateData.goal.photo = req.files['goalPhoto'][0].filename;
      }
      if (req.files['visionPhoto'] && req.files['visionPhoto'][0]) {
        updateData.vision.photo = req.files['visionPhoto'][0].filename;
      }
      if (req.files['messagePhoto'] && req.files['messagePhoto'][0]) {
        updateData.message.photo = req.files['messagePhoto'][0].filename;
      }
      if (req.files['valuesPhoto'] && req.files['valuesPhoto'][0]) {
        updateData.values.photo = req.files['valuesPhoto'][0].filename;
      }
    }

    console.log("Update data:", updateData);

    // Update the document
    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      existingAboutUs._id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedAboutUs);
  } catch (error) {
    console.error("Error updating about us:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete about us entry
const deleteAboutUs = async (req, res) => {
  try {
    // For about section, we'll delete the first (and only) document
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ message: "About Us entry not found" });
    }

    console.log("Deleting About Us with ID:", aboutUs._id);

    // Delete associated files
    if (aboutUs.aboutUs?.photos?.length > 0) {
      for (const photo of aboutUs.aboutUs.photos) {
        try {
          const photoPath = path.join('uploads/aboutUs', photo);
          console.log("Deleting photo:", photoPath);
          await fs.unlink(photoPath);
        } catch (err) {
          console.error('Error deleting photo:', err);
          // Continue with deletion even if file removal fails
        }
      }
    }

    // Delete section photos
    const sections = ['goal', 'vision', 'message', 'values'];
    for (const section of sections) {
      if (aboutUs[section]?.photo) {
        try {
          const photoPath = path.join('uploads/aboutUs', aboutUs[section].photo);
          console.log("Deleting section photo:", photoPath);
          await fs.unlink(photoPath);
        } catch (err) {
          console.error(`Error deleting ${section} photo:`, err);
          // Continue with deletion even if file removal fails
        }
      }
    }

    // Delete the document
    const result = await AboutUs.deleteOne({ _id: aboutUs._id });
    console.log("Delete result:", result);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "About Us entry not found or already deleted" });
    }
    
    res.status(200).json({ message: "About Us entry deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAboutUs:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get about us section
const getAboutUsSection = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
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
