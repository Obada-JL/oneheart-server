const CurrentCampaign = require("../models/current-campagins-model");

// Get all current campaigns
const getAllCurrentCampaigns = async (req, res) => {
  try {
    const campaigns = await CurrentCampaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new current campaign
const createCurrentCampaign = async (req, res) => {
  try {
    console.log("Received data:", { body: req.body, file: req.file });

    // Validate main required fields
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.category ||
      !req.file
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "description", "category", "image"],
        received: req.body,
      });
    }

    // Validate details
    const details = req.body.details ? JSON.parse(req.body.details) : null;
    if (!details?.title || !details?.description1 || !details?.description2) {
      return res.status(400).json({
        message: "Missing required details fields",
        required: [
          "details.title",
          "details.description1",
          "details.description2",
        ],
        received: details,
      });
    }

    const campaignData = {
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      details: {
        title: details.title,
        description1: details.description1,
        description2: details.description2,
      },
    };

    const campaign = new CurrentCampaign(campaignData);
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

// Update current campaign
const updateCurrentCampaign = async (req, res) => {
  try {
    const existingCampaign = await CurrentCampaign.findById(req.params.id);
    if (!existingCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const updateData = {
      title: req.body.title || existingCampaign.title,
      description: req.body.description || existingCampaign.description,
      category: req.body.category || existingCampaign.category,
      details: {
        title: req.body.detailsTitle || existingCampaign.details.title,
        description1:
          req.body.detailsDescription1 || existingCampaign.details.description1,
        description2:
          req.body.detailsDescription2 || existingCampaign.details.description2,
      },
    };

    // Update image if new one is provided
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCampaign = await CurrentCampaign.findByIdAndUpdate(
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

// Delete current campaign
const deleteCurrentCampaign = async (req, res) => {
  try {
    const deletedCampaign = await CurrentCampaign.findByIdAndDelete(
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
  getAllCurrentCampaigns,
  createCurrentCampaign,
  updateCurrentCampaign,
  deleteCurrentCampaign,
};
