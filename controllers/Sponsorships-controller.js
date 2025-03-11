const Sponsorship = require("../models/Sponsorships-model");

// Get all sponsorship items
const getSponsorshipItems = async (req, res) => {
  try {
    const sponsorshipItems = await Sponsorship.find().sort({ createdAt: -1 });
    res.status(200).json(sponsorshipItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new sponsorship item
const addSponsorshipItem = async (req, res) => {
  try {
    console.log("Create request received");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    // Validate required fields
    const requiredFields = [
      'title', 'titleAr', 
      'description', 'descriptionAr', 
      'category', 'categoryAr',
      'total', 'remaining'
    ];

    const missingFields = requiredFields.filter(field => {
      return !req.body[field];
    });
    
    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }
    
    // Parse details
    let details;
    try {
      details = typeof req.body.details === 'string' 
        ? JSON.parse(req.body.details) 
        : req.body.details;
      
      console.log("Parsed details:", details);
    } catch (error) {
      console.error("Error parsing details:", error);
      return res.status(400).json({ 
        message: "Invalid details format",
        error: error.message
      });
    }

    const sponsorshipData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      total: req.body.total,
      remaining: req.body.remaining,
      details: details
    };

    // Handle main image
    if (req.files && req.files.sponsorshipImage) {
      sponsorshipData.sponsorshipImage = req.files.sponsorshipImage[0].filename;
      console.log("Main image will be saved:", req.files.sponsorshipImage[0].filename);
    } else {
      console.log("No main image provided");
    }

    // Handle details image
    if (req.files && req.files.detailsImage) {
      sponsorshipData.detailsImage = req.files.detailsImage[0].filename;
      console.log("Details image will be saved:", req.files.detailsImage[0].filename);
    } else {
      console.log("No details image provided");
    }

    console.log("Creating sponsorship with data:", sponsorshipData);
    const newSponsorship = new Sponsorship(sponsorshipData);
    const savedSponsorship = await newSponsorship.save();

    console.log("Sponsorship created successfully:", savedSponsorship._id);
    res.status(201).json(savedSponsorship);
  } catch (error) {
    console.error("Error saving sponsorship:", error);
    res.status(400).json({
      message: "Failed to save sponsorship",
      error: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Update sponsorship item
const updateSponsorshipItem = async (req, res) => {
  try {
    console.log("Update request received for ID:", req.params.id);
    console.log("Update body:", req.body);
    console.log("Update files:", req.files);
    
    // Check if sponsorship exists
    const existingSponsorship = await Sponsorship.findById(req.params.id);
    if (!existingSponsorship) {
      console.log("Sponsorship not found with ID:", req.params.id);
      return res.status(404).json({ message: "Sponsorship item not found" });
    }
    
    // Parse details
    let details;
    try {
      details = typeof req.body.details === 'string' 
        ? JSON.parse(req.body.details) 
        : req.body.details;
      
      console.log("Parsed details:", details);
    } catch (error) {
      console.error("Error parsing details:", error);
      return res.status(400).json({ 
        message: "Invalid details format",
        error: error.message
      });
    }
    
    // Prepare update data
    const updateData = {
      title: req.body.title || existingSponsorship.title,
      titleAr: req.body.titleAr || existingSponsorship.titleAr,
      description: req.body.description || existingSponsorship.description,
      descriptionAr: req.body.descriptionAr || existingSponsorship.descriptionAr,
      category: req.body.category || existingSponsorship.category,
      categoryAr: req.body.categoryAr || existingSponsorship.categoryAr,
      total: req.body.total || existingSponsorship.total,
      remaining: req.body.remaining || existingSponsorship.remaining,
      details: details || existingSponsorship.details
    };
    
    console.log("Update data prepared:", updateData);

    // Handle main image
    if (req.files && req.files.sponsorshipImage) {
      updateData.sponsorshipImage = req.files.sponsorshipImage[0].filename;
      console.log("New main image will be saved:", req.files.sponsorshipImage[0].filename);
    }

    // Handle details image
    if (req.files && req.files.detailsImage) {
      updateData.detailsImage = req.files.detailsImage[0].filename;
      console.log("New details image will be saved:", req.files.detailsImage[0].filename);
    }

    const updatedSponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Sponsorship updated successfully:", updatedSponsorship._id);
    res.status(200).json(updatedSponsorship);
  } catch (error) {
    console.error("Error updating sponsorship:", error);
    res.status(400).json({ 
      message: "Failed to update sponsorship",
      error: error.message,
      receivedData: { body: req.body, files: req.files }
    });
  }
};

// Delete sponsorship item
const deleteSponsorshipItem = async (req, res) => {
  try {
    const deletedSponsorship = await Sponsorship.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSponsorship) {
      return res.status(404).json({ message: "Sponsorship item not found" });
    }
    res.status(200).json({ message: "Sponsorship item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSponsorshipItems,
  addSponsorshipItem,
  updateSponsorshipItem,
  deleteSponsorshipItem,
};
