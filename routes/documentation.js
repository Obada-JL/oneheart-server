const express = require("express");
const router = express.Router();
const {
  getAllDocumentations,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
  getDocumentationById,
} = require("../controllers/documentation-controller");

// Validation middleware
const validateDocumentation = (req, res, next) => {
  const requiredFields = ["title", "titleAr", "description", "descriptionAr"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Missing required fields",
      fields: missingFields,
    });
  }
  next();
};

// Routes without validation
router.get("/", getAllDocumentations);
router.get("/:id", getDocumentationById);
router.delete("/:id", deleteDocumentation);

// Routes with validation
router.post("/", validateDocumentation, createDocumentation);
router.put("/:id", validateDocumentation, updateDocumentation);

module.exports = router;
