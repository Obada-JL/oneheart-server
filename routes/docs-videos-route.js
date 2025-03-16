const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "uploads/documentation";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only videos are allowed"));
    }
  },
});

const {
  getAllVideos,
  getVideosByDocId,
  createVideos,
  deleteVideo,
} = require("../controllers/docs-videos-controller");

// Routes
router.get("/", getAllVideos);
router.get("/:docId", getVideosByDocId);
router.post("/", upload.array("videos", 10), createVideos); // Allow up to 10 videos at once
router.delete("/:id", deleteVideo);

module.exports = router;
