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
    res.status(400).json({ message: error.message });
  }
};

// Update completed campaign
const updateCompletedCampaign = async (req, res) => {
  try {
    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Completed campaign not found" });
    }

    // Update campaign fields
    campaign.title = req.body.title || campaign.title;
    campaign.titleAr = req.body.titleAr || campaign.titleAr;
    campaign.category = req.body.category || campaign.category;
    campaign.categoryAr = req.body.categoryAr || campaign.categoryAr;

    // Update image if provided
    if (req.file) {
      campaign.image = req.file.filename;
    }

    // Update details if provided
    if (req.body.details) {
      let details = req.body.details;
      if (typeof details === "string") {
        details = JSON.parse(details);
      }
      campaign.details = details;
    } else if (
      req.body.fund &&
      req.body.fundAr &&
      req.body.location &&
      req.body.locationAr &&
      req.body.duration &&
      req.body.durationAr &&
      req.body.Beneficiary &&
      req.body.BeneficiaryAr
    ) {
      campaign.details = [
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

    const updatedCampaign = await campaign.save();
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete completed campaign
const deleteCompletedCampaign = async (req, res) => {
  try {
    const campaign = await CompletedCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Completed campaign not found" });
    }

    await CompletedCampaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Completed campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
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
