const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getCounterItems,
  addCounterItem,
  updateCounterItem,
  deleteCounterItem,
} = require("../controllers/counter-controller");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/counterImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/", getCounterItems);
router.post(
  "/",
  upload.fields([{ name: "counterImage", maxCount: 1 }]),
  addCounterItem
);
router.put(
  "/:id",
  upload.fields([{ name: "counterImage", maxCount: 1 }]),
  updateCounterItem
);
router.delete("/:id", deleteCounterItem);

module.exports = router;
