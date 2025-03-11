const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getAllCurrentCampaigns,
  createCurrentCampaign,
  updateCurrentCampaign,
  deleteCurrentCampaign,
} = require("../controllers/current-campaigns-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/current-campaigns";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define file fields for upload
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'detailsImage', maxCount: 1 }
]);

// Routes
router.get("/", getAllCurrentCampaigns);
router.post("/", uploadFields, createCurrentCampaign);
router.put("/:id", uploadFields, updateCurrentCampaign);
router.delete("/:id", deleteCurrentCampaign);

module.exports = router;
