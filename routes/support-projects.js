const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getAllSupportProjects,
  getSupportProjectById,
  createSupportProject,
  updateSupportProject,
  deleteSupportProject,
} = require("../controllers/support-projects-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/support-projects";
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
router.get("/", getAllSupportProjects);
router.get("/:id", getSupportProjectById);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "detailsImage", maxCount: 1 },
  ]),
  createSupportProject
);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "detailsImage", maxCount: 1 },
  ]),
  updateSupportProject
);
router.delete("/:id", deleteSupportProject);

module.exports = router;
