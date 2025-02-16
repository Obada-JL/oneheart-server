const express = require("express");
const router = express.Router();
const Program = require("../models/program-model");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: "./uploads/programs",
  filename: function (req, file, cb) {
    cb(null, `program-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Create new program
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const program = new Program({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
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
    const programs = await Program.find();
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
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const program = await Program.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete program
router.delete("/:id", async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
