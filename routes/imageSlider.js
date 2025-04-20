const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getSliderItems,
  addSliderItem,
  updateSliderItem,
  deleteSliderItem,
} = require("../controllers/slider-controller");
const fs = require("fs");
const path = require("path");

// Create upload directories if they don't exist
const uploadDirs = [
  "uploads/sliderImages",
  "uploads/payment-icons"
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = "uploads/sliderImages";
    
    // Use different directory for payment icons
    if (file.fieldname.startsWith('donationLinkIcon_')) {
      uploadDir = "uploads/payment-icons";
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Error handling middleware
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message
    });
  } else if (err) {
    console.error('Other upload error:', err);
    return res.status(400).json({ 
      message: 'Error uploading file',
      error: err.message
    });
  }
  next();
};

// Debug middleware for logging requests
router.use((req, res, next) => {
  console.log(`[ImageSlider Route] ${req.method} ${req.url}`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('[ImageSlider Route] Request body:', req.body);
  }
  
  next();
});

// Routes
router.get("/", getSliderItems);
router.post(
  "/",
  (req, res, next) => {
    console.log("POST Request headers:", req.headers);
    
    // Use any() instead of fields() to accept any field
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Multer error in POST:", err);
        return uploadErrorHandler(err, req, res, next);
      }
      next();
    });
  },
  (req, res, next) => {
    console.log("[POST Slider] Received form data:", req.body);
    console.log("[POST Slider] Received files:", req.files);
    next();
  },
  addSliderItem
);
router.put(
  "/:id",
  (req, res, next) => {
    console.log("PUT Request headers:", req.headers);
    
    // Use any() instead of fields() to accept any field
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Multer error in PUT:", err);
        return uploadErrorHandler(err, req, res, next);
      }
      next();
    });
  },
  (req, res, next) => {
    console.log("[PUT Slider] Received form data:", req.body);
    console.log("[PUT Slider] Received files:", req.files);
    next();
  },
  updateSliderItem
);
router.delete("/:id", deleteSliderItem);

module.exports = router;
