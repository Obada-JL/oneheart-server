const SupportCampaign = require("../models/support-campagins-model");

// Get all support campaigns
const getAllSupportCampaigns = async (req, res) => {
  try {
    const campaigns = await SupportCampaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new support campaign
const createSupportCampaign = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Campaign image is required" });
    }

    const campaignData = {
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      total: Number(req.body.total) || 0,
      paid: Number(req.body.paid) || 0,
      donateLink: req.body.donateLink,
      category: req.body.category,
    };

    const campaign = new SupportCampaign(campaignData);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Update support campaign
const updateSupportCampaign = async (req, res) => {
  try {
    const existingCampaign = await SupportCampaign.findById(req.params.id);
    if (!existingCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const updateData = {
      title: req.body.title || existingCampaign.title,
      description: req.body.description || existingCampaign.description,
      total: Number(req.body.total) || existingCampaign.total,
      paid: Number(req.body.paid) || existingCampaign.paid,
      donateLink: req.body.donateLink || existingCampaign.donateLink,
      category: req.body.category || existingCampaign.category,
    };

    // Update image if new one is provided
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCampaign = await SupportCampaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Delete support campaign
const deleteSupportCampaign = async (req, res) => {
  try {
    const deletedCampaign = await SupportCampaign.findByIdAndDelete(
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
  getAllSupportCampaigns,
  createSupportCampaign,
  updateSupportCampaign,
  deleteSupportCampaign,
};
