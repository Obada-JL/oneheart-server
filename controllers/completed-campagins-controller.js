const CompletedCampaign = require("../models/completed-campagins-models");

// Get all completed campaigns
const getAllCompletedCampaigns = async (req, res) => {
  try {
    const campaigns = await CompletedCampaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single completed campaign by ID
const getCompletedCampaignById = async (req, res) => {
  try {
    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Completed campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create completed campaign
const createCompletedCampaign = async (req, res) => {
  try {
    // Handle image upload
    if (!req.file) {
      return res.status(400).json({ message: "Campaign image is required" });
    }

    // Parse details if it comes as string
    let details = req.body.details;
    if (typeof details === "string") {
      details = JSON.parse(details);
    }

    const campaignData = {
      image: req.file.filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      details: [
        {
          fund: req.body.fund,
          fundAr: req.body.fundAr,
          location: req.body.location,
          locationAr: req.body.locationAr,
          duration: req.body.duration,
          durationAr: req.body.durationAr,
          Beneficiary: req.body.Beneficiary,
          BeneficiaryAr: req.body.BeneficiaryAr,
        },
      ],
    };

    const campaign = new CompletedCampaign(campaignData);
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

// Update completed campaign
const updateCompletedCampaign = async (req, res) => {
  try {
    const existingCampaign = await CompletedCampaign.findById(req.params.id);
    if (!existingCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const updateData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.category,
    };

    // Update image if new one is provided
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Handle details update
    if (req.body.details) {
      updateData.details = [
        {
          fund: req.body.fund,
          fundAr: req.body.fundAr,
          location: req.body.location,
          locationAr: req.body.locationAr,
          duration: req.body.duration,
          durationAr: req.body.durationAr,
          Beneficiary: req.body.Beneficiary,
          BeneficiaryAr: req.body.BeneficiaryAr,
        },
      ];
    }

    const updatedCampaign = await CompletedCampaign.findByIdAndUpdate(
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

// Delete completed campaign
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
