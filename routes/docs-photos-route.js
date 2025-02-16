const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  createCampaignDoc,
  getAllCampaignDocs,
  updateCampaignDoc,
  deleteCampaignDoc,
  getAllPhotos,
  getPhotosByDocId,
  createPhotos,
  deletePhoto,
  updatePhoto,
  handlePhotoUpload,
} = require("../controllers/docs-photos-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/documentation";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const Photo = require("../models/photos-model");

// Campaign Doc routes
router.post("/campaign", createCampaignDoc);
router.get("/campaign", getAllCampaignDocs);
router.put("/campaign/:id", updateCampaignDoc);
router.delete("/campaign/:id", deleteCampaignDoc);

// Photos routes
router.get("/", getAllPhotos);
router.get("/:docId", getPhotosByDocId);
router.post("/", upload.array("images", 10), createPhotos); // Changed from handlePhotoUpload to createPhotos
router.delete("/:id", deletePhoto);
router.put("/:id", upload.single("image"), updatePhoto);

module.exports = router;
