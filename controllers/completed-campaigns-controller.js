const CompletedCampaign = require("../models/completed-campaigns-model");

// Get all completed campaigns
const getAllCompletedCampaigns = async (req, res) => {
  try {
    const campaigns = await CompletedCampaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
};

// Create new campaign
const createCompletedCampaign = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, category, details } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        message: "Title and category are required",
        receivedData: req.body,
      });
    }

    // Parse and validate details
    let parsedDetails;
    try {
      parsedDetails = JSON.parse(details);
      if (!Array.isArray(parsedDetails) || !parsedDetails.length) {
        throw new Error("Details must be a non-empty array");
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid details format",
        error: error.message,
      });
    }

    const campaignData = {
      image: req.file.filename,
      title,
      category,
      details: parsedDetails,
    };

    const campaign = new CompletedCampaign(campaignData);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Update campaign
const updateCompletedCampaign = async (req, res) => {
  try {
    const { title, category, details } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (req.file) updateData.image = req.file.filename;

    if (details) {
      try {
        updateData.details = JSON.parse(details);
      } catch (error) {
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    const updatedCampaign = await CompletedCampaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Delete campaign
const deleteCompletedCampaign = async (req, res) => {
  try {
    const deletedCampaign = await CompletedCampaign.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
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
