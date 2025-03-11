const SupportCampaign = require("../models/support-campagins-model");
const path = require("path");
const fs = require("fs");

// Get all support campaigns
const getAllSupportCampaigns = async (req, res) => {
  try {
    const campaigns = await SupportCampaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns", error: error.message });
  }
};

// Get support campaign by ID
const getSupportCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await SupportCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ message: "Failed to fetch campaign", error: error.message });
  }
};

// Create new support campaign
const createSupportCampaign = async (req, res) => {
  try {
    console.log("Body received:", req.body);
    console.log("Files received:", req.files);
    
    // Check if files object exists
    if (!req.files) {
      console.error("No files object in request");
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Check if image is provided
    if (!req.files.image) {
      console.error("No image file in request");
      return res.status(400).json({ message: "Main image is required" });
    }

    console.log("Image file:", req.files.image[0]);
    console.log("Details image file:", req.files.detailsImage?.[0]);

    // Parse details if it's a string
    let details = {};
    if (req.body.details) {
      try {
        details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
        console.log("Parsed details:", details);
      } catch (error) {
        console.error("Error parsing details:", error);
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    const campaignData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      total: Number(req.body.total) || 0,
      paid: Number(req.body.paid) || 0,
      details: {
        image: req.files.detailsImage?.[0]?.filename,
        title: details.title || req.body.detailsTitle,
        titleAr: details.titleAr || req.body.detailsTitleAr,
        description1: details.description1 || req.body.detailsDescription1,
        description1Ar: details.description1Ar || req.body.detailsDescription1Ar,
        description2: details.description2 || req.body.detailsDescription2,
        description2Ar: details.description2Ar || req.body.detailsDescription2Ar,
      },
    };

    console.log("Campaign data to save:", campaignData);

    // Validate required fields
    const requiredFields = [
      { field: 'title', label: 'Title in English' },
      { field: 'titleAr', label: 'Title in Arabic' },
      { field: 'description', label: 'Description in English' },
      { field: 'descriptionAr', label: 'Description in Arabic' },
      { field: 'total', label: 'Required Amount' },
      { field: 'paid', label: 'Paid Amount' },
    ];

    const missingFields = [];
    requiredFields.forEach(({ field, label }) => {
      if (campaignData[field] === undefined || campaignData[field] === null || 
          (typeof campaignData[field] === 'string' && campaignData[field].trim() === '')) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newCampaign = new SupportCampaign(campaignData);
    const savedCampaign = await newCampaign.save();
    console.log("Campaign saved successfully:", savedCampaign._id);
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Update support campaign
const updateSupportCampaign = async (req, res) => {
  try {
    console.log("Update Body received:", req.body);
    console.log("Update Files received:", req.files);

    const { id } = req.params;
    console.log("Updating campaign with ID:", id);

    // Check if campaign exists
    const existingCampaign = await SupportCampaign.findById(id);
    if (!existingCampaign) {
      console.error("Campaign not found with ID:", id);
      return res.status(404).json({ message: "Support campaign not found" });
    }

    console.log("Existing campaign:", existingCampaign);

    // Parse details if it's a string
    let details = {};
    if (req.body.details) {
      try {
        details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
        console.log("Parsed details for update:", details);
      } catch (error) {
        console.error("Error parsing details for update:", error);
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    // Prepare update data
    const updateData = {
      title: req.body.title || existingCampaign.title,
      titleAr: req.body.titleAr || existingCampaign.titleAr,
      category: req.body.category || existingCampaign.category,
      categoryAr: req.body.categoryAr || existingCampaign.categoryAr,
      description: req.body.description || existingCampaign.description,
      descriptionAr: req.body.descriptionAr || existingCampaign.descriptionAr,
      total: Number(req.body.total) || existingCampaign.total,
      paid: Number(req.body.paid) || existingCampaign.paid,
      details: {
        ...existingCampaign.details,
        title: details.title || req.body.detailsTitle || existingCampaign.details?.title,
        titleAr: details.titleAr || req.body.detailsTitleAr || existingCampaign.details?.titleAr,
        description1: details.description1 || req.body.detailsDescription1 || existingCampaign.details?.description1,
        description1Ar: details.description1Ar || req.body.detailsDescription1Ar || existingCampaign.details?.description1Ar,
        description2: details.description2 || req.body.detailsDescription2 || existingCampaign.details?.description2,
        description2Ar: details.description2Ar || req.body.detailsDescription2Ar || existingCampaign.details?.description2Ar,
      },
    };

    // Update image if provided
    if (req.files && req.files.image) {
      updateData.image = req.files.image[0].filename;
      console.log("Updating main image:", updateData.image);
      
      // Delete old image if it exists
      if (existingCampaign.image) {
        const oldImagePath = path.join(__dirname, '../uploads/support-campaigns', existingCampaign.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Deleted old main image:", oldImagePath);
        }
      }
    }

    // Update details image if provided
    if (req.files && req.files.detailsImage) {
      updateData.details.image = req.files.detailsImage[0].filename;
      console.log("Updating details image:", updateData.details.image);
      
      // Delete old details image if it exists
      if (existingCampaign.details && existingCampaign.details.image) {
        const oldDetailsImagePath = path.join(__dirname, '../uploads/support-campaigns', existingCampaign.details.image);
        if (fs.existsSync(oldDetailsImagePath)) {
          fs.unlinkSync(oldDetailsImagePath);
          console.log("Deleted old details image:", oldDetailsImagePath);
        }
      }
    }

    console.log("Final update data:", updateData);

    const updatedCampaign = await SupportCampaign.findByIdAndUpdate(
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

// Delete support campaign
const deleteSupportCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await SupportCampaign.findByIdAndDelete(id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: "Failed to delete campaign", error: error.message });
  }
};

module.exports = {
  getAllSupportCampaigns,
  getSupportCampaignById,
  createSupportCampaign,
  updateSupportCampaign,
  deleteSupportCampaign,
};
