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
} = require("../controllers/docs-photos-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/campaigns";
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

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes with file upload middleware
router.post("/", upload.array("campaginPhoto", 10), createCampaignDoc);
router.get("/", getAllCampaignDocs);
router.put("/:id", upload.array("campaginPhoto", 10), updateCampaignDoc);
router.delete("/:id", deleteCampaignDoc);

module.exports = router;
