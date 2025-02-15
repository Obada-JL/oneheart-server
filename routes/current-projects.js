const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getAllCurrentProjects,
  getCurrentProjectById,
  createCurrentProject,
  updateCurrentProject,
  deleteCurrentProject,
} = require("../controllers/current-projects-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/current-projects";
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
router.get("/", getAllCurrentProjects);
router.get("/:id", getCurrentProjectById);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "detailsImage", maxCount: 1 },
  ]),
  createCurrentProject
);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "detailsImage", maxCount: 1 },
  ]),
  updateCurrentProject
);
router.delete("/:id", deleteCurrentProject);

module.exports = router;
