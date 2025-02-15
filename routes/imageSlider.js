const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getSliderItems,
  addSliderItem,
  updateSliderItem,
  deleteSliderItem,
} = require("../controllers/slider-controller");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/sliderImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/", getSliderItems);
router.post(
  "/",
  upload.fields([{ name: "sliderImage", maxCount: 1 }]),
  addSliderItem
);
router.put(
  "/:id",
  upload.fields([{ name: "sliderImage", maxCount: 1 }]),
  updateSliderItem
);
router.delete("/:id", deleteSliderItem);

module.exports = router;
