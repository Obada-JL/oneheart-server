const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const CampaignVideo = require("../models/campaign-video-model");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest =
      file.fieldname === "thumbnail"
        ? "./uploads/campaign-thumbnails"
        : "./uploads/campaign-videos";
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const prefix = file.fieldname === "thumbnail" ? "thumbnail" : "video";
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB file size limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed for thumbnails!"));
      }
    } else if (file.fieldname === "video") {
      if (!file.originalname.match(/\.(mp4|webm|mov)$/)) {
        return cb(new Error("Only video files are allowed!"));
      }
    }
    cb(null, true);
  },
});

// Create new campaign video route
router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["video"] || !req.files["thumbnail"]) {
        return res
          .status(400)
          .json({ message: "Both video and thumbnail are required" });
      }

      const campaignVideo = new CampaignVideo({
        video: req.files["video"][0].filename,
        thumbnail: req.files["thumbnail"][0].filename,
        title: req.body.title,
        titleAr: req.body.titleAr,
      });

      const savedVideo = await campaignVideo.save();
      res.status(201).json(savedVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

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
