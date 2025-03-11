const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  getAllAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
  getAboutUsSection,
  getGoalSection,
  getVisionSection,
  getValuesSection,
  getMessageSection,
} = require("../controllers/about-us-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/aboutUs";
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

// Routes
router.get("/", getAllAboutUs);
router.post("/", upload.fields([
  { name: 'aboutUsPhotos', maxCount: 2 },
  { name: 'goalPhoto', maxCount: 1 },
  { name: 'visionPhoto', maxCount: 1 },
  { name: 'messagePhoto', maxCount: 1 },
  { name: 'valuesPhoto', maxCount: 1 }
]), createAboutUs);
router.put("/:id", upload.fields([
  { name: 'aboutUsPhotos', maxCount: 2 },
  { name: 'goalPhoto', maxCount: 1 },
  { name: 'visionPhoto', maxCount: 1 },
  { name: 'messagePhoto', maxCount: 1 },
  { name: 'valuesPhoto', maxCount: 1 }
]), updateAboutUs);
router.delete("/", deleteAboutUs);

// Section-specific routes
router.get("/about", getAboutUsSection);
router.get("/goal", getGoalSection);
router.get("/vision", getVisionSection);
router.get("/values", getValuesSection);
router.get("/message", getMessageSection);

module.exports = router;
