const express = require("express");
const router = express.Router();
const CampaignVideo = require("../models/campaign-video-model");
const multer = require("multer");
const path = require("path");

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: "./uploads/campaign-videos",
  filename: function (req, file, cb) {
    cb(null, `campaign-video-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(mp4|webm|mov)$/)) {
      return cb(new Error("Only video files are allowed!"));
    }
    cb(null, true);
  },
});

// Create new campaign video
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const campaignVideo = new CampaignVideo({
      video: req.file.filename,
      title: req.body.title,
    });
    await campaignVideo.save();
    res.status(201).json(campaignVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all campaign videos
router.get("/", async (req, res) => {
  try {
    const videos = await CampaignVideo.find().sort({ date: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single campaign video
router.get("/:id", async (req, res) => {
  try {
    const video = await CampaignVideo.findById(req.params.id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update campaign video
router.put("/:id", upload.single("video"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
    };

    if (req.file) {
      updateData.video = req.file.filename;
    }

    const video = await CampaignVideo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete campaign video
router.delete("/:id", async (req, res) => {
  try {
    await CampaignVideo.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
