const CompletedCampaign = require("../models/completed-campaigns-model");
const path = require("path");
const fs = require("fs");

// Get all completed campaigns
const getAllCompletedCampaigns = async (req, res) => {
  try {
    const campaigns = await CompletedCampaign.find();
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
    console.log("Received data:", {
      body: req.body,
      files: req.files,
    });
    
    // Check if files object exists
    if (!req.files) {
      console.error("No files object in request");
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Validate required fields
    if (!req.body.title || !req.body.titleAr || !req.body.category || !req.body.categoryAr || !req.files.image) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "titleAr", "category", "categoryAr", "image"],
        received: req.body,
      });
    }

    console.log("Image file:", req.files.image[0]);

    // Parse details from the request body
    let details;
    try {
      details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
      console.log("Parsed details:", details);
    } catch (error) {
      console.error("Error parsing details:", error);
      return res.status(400).json({ message: "Invalid details format" });
    }

    // Validate details structure
    if (!Array.isArray(details)) {
      details = [details]; // Convert to array if single object
    }

    // Validate details fields
    if (
      !details[0]?.fund ||
      !details[0]?.fundAr ||
      !details[0]?.location ||
      !details[0]?.locationAr ||
      !details[0]?.duration ||
      !details[0]?.durationAr ||
      !details[0]?.Beneficiary ||
      !details[0]?.BeneficiaryAr
    ) {
      return res.status(400).json({
        message: "Invalid details format",
        required: ["fund", "fundAr", "location", "locationAr", "duration", "durationAr", "Beneficiary", "BeneficiaryAr"],
        received: details,
      });
    }

    // Create campaign data
    const campaignData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      details: details.map(detail => ({
        fund: detail.fund,
        fundAr: detail.fundAr,
        location: detail.location,
        locationAr: detail.locationAr,
        duration: detail.duration,
        durationAr: detail.durationAr,
        Beneficiary: detail.Beneficiary,
        BeneficiaryAr: detail.BeneficiaryAr
      }))
    };

    const campaign = new CompletedCampaign(campaignData);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update campaign
const updateCompletedCampaign = async (req, res) => {
  try {
    console.log("Update Body received:", req.body);
    console.log("Update Files received:", req.files);

    const { id } = req.params;
    console.log("Updating campaign with ID:", id);

    // Check if campaign exists
    const existingCampaign = await CompletedCampaign.findById(id);
    if (!existingCampaign) {
      console.error("Campaign not found with ID:", id);
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log("Existing campaign:", existingCampaign);

    // Prepare update data
    const updateData = {
      title: req.body.title || existingCampaign.title,
      titleAr: req.body.titleAr || existingCampaign.titleAr,
      category: req.body.category || existingCampaign.category,
      categoryAr: req.body.categoryAr || existingCampaign.categoryAr,
    };

    // Update image if provided
    if (req.files && req.files.image) {
      updateData.image = req.files.image[0].filename;
      console.log("Updating image:", updateData.image);
      
      // Delete old image if it exists
      if (existingCampaign.image) {
        const oldImagePath = path.join(__dirname, '../uploads/completed-campaigns', existingCampaign.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Deleted old image:", oldImagePath);
        }
      }
    }

    // Update details if provided
    if (req.body.details) {
      let details;
      try {
        details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
        console.log("Parsed details for update:", details);
        
        if (!Array.isArray(details)) {
          details = [details];
        }
        
        updateData.details = details;
      } catch (error) {
        console.error("Error parsing details for update:", error);
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    console.log("Final update data:", updateData);

    const updatedCampaign = await CompletedCampaign.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log("Campaign updated successfully:", updatedCampaign._id);
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(400).json({ message: error.message });
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
    
    // Delete campaign image if it exists
    if (deletedCampaign.image) {
      const imagePath = path.join(__dirname, '../uploads/completed-campaigns', deletedCampaign.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Deleted image on campaign deletion:", imagePath);
      }
    }
    
    res.status(200).json({ message: "Campaign deleted successfully" });
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
