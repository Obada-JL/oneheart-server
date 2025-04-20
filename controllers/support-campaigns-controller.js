const SupportCampaign = require("../models/support-campaigns-model");
const path = require("path");
const fs = require("fs");

// Get all support campaigns
const getAllSupportCampaigns = async (req, res) => {
  try {
    const supportCampaigns = await SupportCampaign.find();
    res.status(200).json(supportCampaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single support campaign
const getSupportCampaign = async (req, res) => {
  try {
    const supportCampaign = await SupportCampaign.findById(req.params.id);
    if (!supportCampaign) {
      return res.status(404).json({ message: "Support campaign not found" });
    }
    res.status(200).json(supportCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new support campaign
const createSupportCampaign = async (req, res) => {
  try {
    const supportCampaign = new SupportCampaign({
      ...req.body,
      donationLinks: req.body.donationLinks || "[]"
    });
    const newSupportCampaign = await supportCampaign.save();
    res.status(201).json(newSupportCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a support campaign
const updateSupportCampaign = async (req, res) => {
  try {
    const supportCampaign = await SupportCampaign.findById(req.params.id);
    if (!supportCampaign) {
      return res.status(404).json({ message: "Support campaign not found" });
    }

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (supportCampaign.image) {
        const oldImagePath = path.join(__dirname, "../uploads", supportCampaign.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      supportCampaign.image = req.file.filename;
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      if (key !== "image") {
        supportCampaign[key] = req.body[key];
      }
    });

    // Ensure donationLinks is properly set
    if (req.body.donationLinks) {
      supportCampaign.donationLinks = req.body.donationLinks;
    }

    const updatedSupportCampaign = await supportCampaign.save();
    res.status(200).json(updatedSupportCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a support campaign
const deleteSupportCampaign = async (req, res) => {
  try {
    const supportCampaign = await SupportCampaign.findById(req.params.id);
    if (!supportCampaign) {
      return res.status(404).json({ message: "Support campaign not found" });
    }

    // Delete image file
    if (supportCampaign.image) {
      const imagePath = path.join(__dirname, "../uploads", supportCampaign.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await supportCampaign.remove();
    res.status(200).json({ message: "Support campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSupportCampaigns,
  getSupportCampaign,
  createSupportCampaign,
  updateSupportCampaign,
  deleteSupportCampaign,
};
