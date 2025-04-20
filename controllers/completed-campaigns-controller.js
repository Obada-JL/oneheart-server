const CompletedCampaign = require("../models/completed-campaigns-model");
const path = require("path");
const fs = require("fs");

// Get all completed campaigns
const getAllCompletedCampaigns = async (req, res) => {
  try {
    const campaigns = await CompletedCampaign.find();
    // Ensure we always return an array
    res.status(200).json(campaigns || []);
  } catch (error) {
    console.error("Error in getAllCompletedCampaigns:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get campaign by ID
const getCompletedCampaignById = async (req, res) => {
  try {
    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error in getCompletedCampaignById:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new campaign
const createCompletedCampaign = async (req, res) => {
  try {
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      categoryAr,
      total,
      paid,
      donationLinks
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const campaign = new CompletedCampaign({
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      categoryAr,
      image,
      total,
      paid,
      donationLinks: donationLinks || "[]"
    });

    const newCampaign = await campaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update campaign
const updateCompletedCampaign = async (req, res) => {
  try {
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      categoryAr,
      total,
      paid,
      donationLinks
    } = req.body;

    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Delete old image if a new one is uploaded
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads/completed-campaigns",
        campaign.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      campaign.image = req.file.filename;
    }

    campaign.title = title;
    campaign.titleAr = titleAr;
    campaign.description = description;
    campaign.descriptionAr = descriptionAr;
    campaign.category = category;
    campaign.categoryAr = categoryAr;
    campaign.total = total;
    campaign.paid = paid;
    campaign.donationLinks = donationLinks || "[]";

    const updatedCampaign = await campaign.save();
    res.json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete campaign
const deleteCompletedCampaign = async (req, res) => {
  try {
    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Delete the image file
    const imagePath = path.join(
      __dirname,
      "../uploads/completed-campaigns",
      campaign.image
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await campaign.deleteOne();
    res.json({ message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCompletedCampaigns,
  getCompletedCampaignById,
  createCompletedCampaign,
  updateCompletedCampaign,
  deleteCompletedCampaign,
};
