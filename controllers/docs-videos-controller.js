const Video = require("../models/Video");
const fs = require("fs").promises;
const path = require("path");

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideosByDocId = async (req, res) => {
  try {
    const videos = await Video.find({ docId: req.params.docId });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVideos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No videos uploaded" });
    }

    const { docId } = req.body;
    if (!docId) {
      return res.status(400).json({ message: "Documentation ID is required" });
    }

    const videoData = req.files.map((file) => ({
      video: file.filename,
      docId,
    }));

    const savedVideos = await Video.insertMany(videoData);
    res.status(201).json(savedVideos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete physical file
    const filePath = path.join(
      __dirname,
      "../uploads/documentation",
      video.video
    );
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
