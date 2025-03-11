const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllDocumentations,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
  getDocumentationById,
} = require("../controllers/documentation-controller");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/documentations");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Validation middleware
const validateDocumentation = (req, res, next) => {
  console.log("Validating documentation with body:", req.body);
  
  try {
    // Parse JSON strings if needed
    if (typeof req.body.title === 'string') {
      try {
        req.body.title = JSON.parse(req.body.title);
        console.log("Parsed title JSON:", req.body.title);
      } catch (e) {
        console.error("Error parsing title JSON:", e);
      }
    }
    
    if (typeof req.body.description === 'string') {
      try {
        req.body.description = JSON.parse(req.body.description);
        console.log("Parsed description JSON:", req.body.description);
      } catch (e) {
        console.error("Error parsing description JSON:", e);
      }
    }
    
    // Check if we have nested objects or bracket notation
    const hasNestedObjects = req.body.title && req.body.title.en && req.body.title.ar && 
                            req.body.description && req.body.description.en && req.body.description.ar;
    
    const hasBracketNotation = req.body['title[en]'] && req.body['title[ar]'] && 
                              req.body['description[en]'] && req.body['description[ar]'];
    
    // If we have nested objects, convert them to bracket notation for the controller
    if (hasNestedObjects) {
      req.body['title[en]'] = req.body.title.en;
      req.body['title[ar]'] = req.body.title.ar;
      req.body['description[en]'] = req.body.description.en;
      req.body['description[ar]'] = req.body.description.ar;
      console.log("Converted nested objects to bracket notation:", req.body);
      return next();
    }
    
    // If we have bracket notation, proceed
    if (hasBracketNotation) {
      return next();
    }
    
    // If neither format is complete, return error
    return res.status(400).json({
      message: "Missing required fields",
      fields: ["title[en]", "title[ar]", "description[en]", "description[ar]"],
    });
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(400).json({
      message: "Error validating request",
      error: error.message
    });
  }
};

// Routes without validation
router.get("/", getAllDocumentations);
router.get("/:id", getDocumentationById);
router.delete("/:id", deleteDocumentation);

// Routes with validation and file upload
router.post("/", upload.array("images", 3), validateDocumentation, createDocumentation);
router.put("/:id", upload.array("images", 3), validateDocumentation, updateDocumentation);

module.exports = router;
