const CurrentCampaign = require("../models/current-campagins-model");

// Get all current campaigns
const getAllCurrentCampaigns = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // Get limit from query params
    let query = CurrentCampaign.find();
    
    // Apply limit if provided
    if (limit > 0) {
      query = query.limit(limit);
    }

    const campaigns = await query.exec();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new current campaign
const createCurrentCampaign = async (req, res) => {
  try {
    // Validate main required fields
    const requiredFields = {
      title: "Title in English",
      titleAr: "Title in Arabic", 
      description: "Description in English",
      descriptionAr: "Description in Arabic",
      category: "Category in English",
      categoryAr: "Category in Arabic"
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    });

    if (!req.files?.image) {
      missingFields.push("Campaign Image");
    }

    if (!req.files?.detailsImage) {
      missingFields.push("Details Image");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }

    // Parse and validate details
    const details = req.body.details ? JSON.parse(req.body.details) : null;
    if (!details?.title || !details?.titleAr || !details?.description1 || 
        !details?.description1Ar || !details?.description2 || !details?.description2Ar) {
      return res.status(400).json({
        message: "Missing required details fields"
      });
    }

    const campaignData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      details: {
        ...details,
        image: req.files.detailsImage[0].filename
      }
    };

    const campaign = new CurrentCampaign(campaignData);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(400).json({ message: error.message });
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
      titleAr: req.body.titleAr || existingCampaign.titleAr,
      description: req.body.description || existingCampaign.description,
      descriptionAr: req.body.descriptionAr || existingCampaign.descriptionAr,
      category: req.body.category || existingCampaign.category,
      categoryAr: req.body.categoryAr || existingCampaign.categoryAr
    };

    // Update image if provided
    if (req.files?.image) {
      updateData.image = req.files.image[0].filename;
    }

    // Update details if provided
    if (req.body.details) {
      const details = JSON.parse(req.body.details);
      updateData.details = {
        ...existingCampaign.details,
        ...details
      };
      
      // Update details image if provided
      if (req.files?.detailsImage) {
        updateData.details.image = req.files.detailsImage[0].filename;
      }
    }

    const updatedCampaign = await CurrentCampaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: error.message });
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
