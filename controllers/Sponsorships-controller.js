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
    
    // Parse donationLinks if provided
    let donationLinks = [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donationLinks:", donationLinks);
        
        // Process icon files from separate fields in req.files
        if (req.files) {
          // First, check if any donation links have iconField references
          donationLinks.forEach((link, index) => {
            if (link.iconField && req.files[link.iconField]) {
              // Update the icon field with the filename
              donationLinks[index].icon = req.files[link.iconField][0].filename;
              // Remove the temporary iconField property as it's no longer needed
              delete donationLinks[index].iconField;
              console.log(`Updated donation link ${index} icon to: ${donationLinks[index].icon}`);
            }
          });
          
          // Also handle the older way of matching by field name pattern
          Object.keys(req.files).forEach(key => {
            // Check if the key follows the pattern 'donationLinkIcon_X'
            const iconMatch = key.match(/^donationLinkIcon_(\d+)$/);
            if (iconMatch && iconMatch[1]) {
              const linkIndex = parseInt(iconMatch[1]);
              if (donationLinks[linkIndex] && req.files[key][0]) {
                // Update the icon field with the filename
                donationLinks[linkIndex].icon = req.files[key][0].filename;
                console.log(`Updated donation link ${linkIndex} icon to: ${donationLinks[linkIndex].icon}`);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error parsing donationLinks:", error);
        return res.status(400).json({ 
          message: "Invalid donationLinks format",
          error: error.message
        });
      }
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
      donationLinks: donationLinks
    };

    // Handle main image
    if (req.files && req.files.sponsorshipImage) {
      sponsorshipData.sponsorshipImage = req.files.sponsorshipImage[0].filename;
      console.log("Main image will be saved:", req.files.sponsorshipImage[0].filename);
    } else {
      console.log("No main image provided");
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
    
    // Parse donationLinks if provided
    let donationLinks = existingSponsorship.donationLinks || [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donationLinks for update:", donationLinks);
        
        // Process icon files from separate fields in req.files
        if (req.files) {
          // First, check if any donation links have iconField references
          donationLinks.forEach((link, index) => {
            if (link.iconField && req.files[link.iconField]) {
              // Update the icon field with the filename
              donationLinks[index].icon = req.files[link.iconField][0].filename;
              // Remove the temporary iconField property as it's no longer needed
              delete donationLinks[index].iconField;
              console.log(`Updated donation link ${index} icon to: ${donationLinks[index].icon}`);
            }
          });
          
          // Also handle the older way of matching by field name pattern
          Object.keys(req.files).forEach(key => {
            // Check if the key follows the pattern 'donationLinkIcon_X'
            const iconMatch = key.match(/^donationLinkIcon_(\d+)$/);
            if (iconMatch && iconMatch[1]) {
              const linkIndex = parseInt(iconMatch[1]);
              if (donationLinks[linkIndex] && req.files[key][0]) {
                // Update the icon field with the filename
                donationLinks[linkIndex].icon = req.files[key][0].filename;
                console.log(`Updated donation link ${linkIndex} icon to: ${donationLinks[linkIndex].icon}`);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error parsing donationLinks:", error);
        return res.status(400).json({ 
          message: "Invalid donationLinks format",
          error: error.message
        });
      }
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
      donationLinks: donationLinks
    };
    
    console.log("Update data prepared:", updateData);

    // Handle main image
    if (req.files && req.files.sponsorshipImage) {
      updateData.sponsorshipImage = req.files.sponsorshipImage[0].filename;
      console.log("New main image will be saved:", req.files.sponsorshipImage[0].filename);
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
