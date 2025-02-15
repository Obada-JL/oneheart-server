const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getAllCompletedProjects,
  createCompletedProject,
  updateCompletedProject,
  deleteCompletedProject,
} = require("../controllers/completed-projects-controller");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/completed-projects";
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
router.get("/", getAllCompletedProjects);
router.post("/", upload.single("image"), createCompletedProject);
router.put("/:id", upload.single("image"), updateCompletedProject);
router.delete("/:id", deleteCompletedProject);

module.exports = router;
