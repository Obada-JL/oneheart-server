const Slider = require("../models/slider-model");
const fs = require('fs').promises;
const path = require('path');

// Get all slider items
const getSliderItems = async (req, res) => {
  try {
    const sliderItems = await Slider.find().sort({ _id: -1 });
    console.log("Found slider items:", sliderItems.length);
    res.status(200).json(sliderItems);
  } catch (error) {
    console.error("Error fetching slider items:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add new slider item
const addSliderItem = async (req, res) => {
  try {
    console.log("Add slider - Request body:", req.body);
    console.log("Add slider - Request files:", req.files);

    // Get slider images from files array
    const sliderImages = req.files
      ? req.files.filter(file => file.fieldname === 'sliderImage')
      : [];
    
    // Check if we have slider images
    if (!sliderImages || sliderImages.length === 0) {
      return res.status(400).json({ message: "At least one slider image is required" });
    }

    // Check for maximum number of slider images
    if (sliderImages.length > 3) {
      return res.status(400).json({ message: "Maximum 3 slider images are allowed" });
    }

    // Parse donation links
    let donationLinks = [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donation links:", donationLinks);
        
        // Get donation icon files
        const donationIconFiles = req.files
          ? req.files.filter(file => file.fieldname.startsWith('donationLinkIcon_'))
          : [];
        
        // Add icon filenames to donation links
        donationIconFiles.forEach(file => {
          const index = parseInt(file.fieldname.split('_')[1], 10);
          if (!isNaN(index) && index < donationLinks.length) {
            donationLinks[index].icon = file.filename;
            console.log(`Added icon ${file.filename} to donation link at index ${index}`);
          }
        });
      } catch (error) {
        console.error("Error parsing donation links:", error);
        return res.status(400).json({ 
          message: "Invalid donation links format", 
          error: error.message 
        });
      }
    }

    // Create new slider item
    const newSlider = new Slider({
      sliderTitle: req.body.sliderTitleEn,
      sliderTitleEn: req.body.sliderTitleEn,
      sliderTitleAr: req.body.sliderTitleAr,
      sliderDescription: req.body.sliderDescriptionEn,
      sliderDescriptionEn: req.body.sliderDescriptionEn,
      sliderDescriptionAr: req.body.sliderDescriptionAr,
      sliderImage: sliderImages.map(file => file.filename),
      detailsLink: req.body.detailsLink,
      donationLinks: donationLinks
    });

    const savedSlider = await newSlider.save();
    console.log("Slider saved successfully:", savedSlider);
    res.status(201).json(savedSlider);
  } catch (error) {
    console.error("Error creating slider:", error);
    let errorMessage = error.message;
    let statusCode = 400;
    
    // Provide more specific error messages
    if (error.name === 'MulterError') {
      errorMessage = `File upload error: ${error.message}`;
    } else if (error.name === 'ValidationError') {
      errorMessage = `Validation error: ${error.message}`;
    } else {
      statusCode = 500;
    }
    
    res.status(statusCode).json({ 
      message: errorMessage,
      error: error.name,
      details: error.message
    });
  }
};

// Update slider item
const updateSliderItem = async (req, res) => {
  try {
    console.log("Update slider - Request body:", req.body);
    console.log("Update slider - Request files:", req.files);
    console.log("Update slider - Slider ID:", req.params.id);
    
    const existingSlider = await Slider.findById(req.params.id);
    if (!existingSlider) {
      return res.status(404).json({ message: "Slider item not found" });
    }
    
    console.log("Found existing slider:", existingSlider._id);

    // Prepare update data
    const updateData = {
      sliderTitle: req.body.sliderTitleEn || existingSlider.sliderTitleEn,
      sliderTitleEn: req.body.sliderTitleEn || existingSlider.sliderTitleEn,
      sliderTitleAr: req.body.sliderTitleAr || existingSlider.sliderTitleAr,
      sliderDescription: req.body.sliderDescriptionEn || existingSlider.sliderDescriptionEn,
      sliderDescriptionEn: req.body.sliderDescriptionEn || existingSlider.sliderDescriptionEn,
      sliderDescriptionAr: req.body.sliderDescriptionAr || existingSlider.sliderDescriptionAr,
      detailsLink: req.body.detailsLink || existingSlider.detailsLink,
    };
    
    // Process donation links
    if (req.body.donationLinks) {
      try {
        let donationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donation links for update:", donationLinks);
        
        // Get donation icon files
        const donationIconFiles = req.files
          ? req.files.filter(file => file.fieldname.startsWith('donationLinkIcon_'))
          : [];
        
        // Add icon filenames to donation links
        donationIconFiles.forEach(file => {
          const index = parseInt(file.fieldname.split('_')[1], 10);
          if (!isNaN(index) && index < donationLinks.length) {
            donationLinks[index].icon = file.filename;
            console.log(`Added icon ${file.filename} to donation link at index ${index}`);
          }
        });
        
        updateData.donationLinks = donationLinks;
      } catch (error) {
        console.error("Error parsing donation links for update:", error);
        return res.status(400).json({ 
          message: "Invalid donation links format", 
          error: error.message 
        });
      }
    }

    // Get slider images from files array
    const sliderImages = req.files
      ? req.files.filter(file => file.fieldname === 'sliderImage')
      : [];

    // Handle image updates - only if we have sliderImage files
    if (sliderImages.length > 0) {
      if (sliderImages.length > 3) {
        return res.status(400).json({ message: "Maximum 3 slider images are allowed" });
      }
      
      // Delete old images if uploading new ones
      if (Array.isArray(existingSlider.sliderImage)) {
        console.log("Deleting old slider images:", existingSlider.sliderImage);
        for (const oldImage of existingSlider.sliderImage) {
          try {
            const imagePath = path.join(__dirname, '../uploads/sliderImages', oldImage);
            await fs.unlink(imagePath);
            console.log(`Deleted old slider image: ${oldImage}`);
          } catch (error) {
            console.error(`Error deleting old image ${oldImage}:`, error);
            // Continue with the update even if we couldn't delete old images
          }
        }
      }
      
      // Set the new images
      updateData.sliderImage = sliderImages.map(file => file.filename);
      console.log("New slider images:", updateData.sliderImage);
    } else {
      // If no new images are provided, keep the existing ones
      console.log("No new images provided, keeping existing images:", existingSlider.sliderImage);
      // Set sliderImage explicitly in updateData to prevent losing it
      updateData.sliderImage = existingSlider.sliderImage;
    }

    console.log("Final update data:", updateData);

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Slider updated successfully:", updatedSlider);
    res.status(200).json(updatedSlider);
  } catch (error) {
    console.error("Error updating slider:", error);
    let errorMessage = error.message;
    let statusCode = 400;
    
    // Provide more specific error messages
    if (error.name === 'MulterError') {
      errorMessage = `File upload error: ${error.message}`;
    } else if (error.name === 'ValidationError') {
      errorMessage = `Validation error: ${error.message}`;
    } else if (error.name === 'CastError') {
      errorMessage = `Invalid ID format: ${error.message}`;
      statusCode = 404;
    } else {
      statusCode = 500;
    }
    
    res.status(statusCode).json({ 
      message: errorMessage,
      error: error.name,
      details: error.message
    });
  }
};

// Delete slider item
const deleteSliderItem = async (req, res) => {
  try {
    console.log("Deleting slider with ID:", req.params.id);
    
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: "Slider item not found" });
    }
    
    // Delete associated images
    if (Array.isArray(slider.sliderImage)) {
      for (const image of slider.sliderImage) {
        try {
          const imagePath = path.join(__dirname, '../uploads/sliderImages', image);
          await fs.unlink(imagePath);
          console.log(`Deleted image: ${image}`);
        } catch (error) {
          console.error(`Error deleting image ${image}:`, error);
        }
      }
    }
    
    const deletedSlider = await Slider.findByIdAndDelete(req.params.id);
    console.log("Slider deleted successfully");
    res.status(200).json({ message: "Slider item deleted successfully" });
  } catch (error) {
    console.error("Error deleting slider:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSliderItems,
  addSliderItem,
  updateSliderItem,
  deleteSliderItem,
};
