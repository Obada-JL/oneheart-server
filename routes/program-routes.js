const express = require("express");
const router = express.Router();
const Program = require("../models/program-model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = "./uploads/programs";
    
    // Use different directory for payment icons
    if (file.fieldname.startsWith('donationLinkIcon_')) {
      uploadDir = "./uploads/payment-icons";
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `program-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Create new program
router.post("/", (req, res, next) => {
  console.log("POST Programs Request headers:", req.headers);
  
  // Use any() instead of fields() to accept any field
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error in POST:", err);
      return res.status(400).json({ 
        message: 'File upload error',
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Create program - Request body:", req.body);
    console.log("Create program - Request files:", req.files);
    
    // Validate required fields
    const requiredFields = {
      title: "Title in English",
      titleAr: "Title in Arabic",
      description: "Description in English",
      descriptionAr: "Description in Arabic"
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    });

    // Get program image from files array
    const programImage = req.files
      ? req.files.find(file => file.fieldname === 'image')
      : null;

    if (!programImage) {
      missingFields.push("Program Image");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }

    // Process donation links
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
        console.error('Error parsing donation links:', error);
        return res.status(400).json({ 
          message: "Invalid donation links format", 
          error: error.message 
        });
      }
    }

    const program = new Program({
      image: programImage.filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      donationLinks: donationLinks
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error("Error creating program:", error);
    res.status(400).json({ 
      message: error.message,
      error: error.name 
    });
  }
});

// Get all programs
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    let query = Program.find();
    
    if (limit > 0) {
      query = query.limit(limit);
    }

    const programs = await query.exec();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get program by ID
router.get("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update program
router.put("/:id", (req, res, next) => {
  console.log("PUT Programs Request headers:", req.headers);
  
  // Use any() instead of fields() to accept any field
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error in PUT:", err);
      return res.status(400).json({ 
        message: 'File upload error',
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Update program - Request body:", req.body);
    console.log("Update program - Request files:", req.files);
    
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Process donation links
    let donationLinks = [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
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
      } catch (error) {
        console.error('Error parsing donation links:', error);
        return res.status(400).json({ 
          message: "Invalid donation links format", 
          error: error.message 
        });
      }
    }

    // Update fields
    program.title = req.body.title || program.title;
    program.titleAr = req.body.titleAr || program.titleAr;
    program.description = req.body.description || program.description;
    program.descriptionAr = req.body.descriptionAr || program.descriptionAr;
    program.donationLinks = donationLinks;

    // Get program image from files array
    const programImage = req.files
      ? req.files.find(file => file.fieldname === 'image')
      : null;

    // Update image if provided
    if (programImage) {
      // Delete old image
      try {
        const oldImagePath = path.join(__dirname, '../uploads/programs', program.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
      program.image = programImage.filename;
    }

    const updatedProgram = await program.save();
    res.json(updatedProgram);
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(400).json({ 
      message: error.message,
      error: error.name 
    });
  }
});

// Delete program
router.delete("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Delete program image
    try {
      const imagePath = path.join(__dirname, '../uploads/programs', program.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error("Error deleting program image:", error);
    }

    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
