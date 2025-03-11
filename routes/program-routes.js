const express = require("express");
const router = express.Router();
const Program = require("../models/program-model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/programs";
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
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

    if (!req.file) {
      missingFields.push("Program Image");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }

    const program = new Program({
      image: req.file.filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// Get single program
router.get("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: "Program not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update program
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
    };

    // Only update image if a new one is provided
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const program = await Program.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete program
router.delete("/:id", async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
