const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const {
  getSponsorshipItems,
  addSponsorshipItem,
  updateSponsorshipItem,
  deleteSponsorshipItem,
} = require("../controllers/Sponsorships-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/sponsorships";
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Add error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: error.message,
    });
  }
  next(error);
});

// Routes
router.get("/", getSponsorshipItems);
router.post("/", upload.single("sponsorshipImage"), addSponsorshipItem);
router.put("/:id", upload.single("sponsorshipImage"), updateSponsorshipItem);
router.delete("/:id", deleteSponsorshipItem);

module.exports = router;
