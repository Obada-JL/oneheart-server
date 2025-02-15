const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createVideos,
  getAllVideos,
  updateVideos,
  deleteVideos,
} = require("../controllers/docs-videos-controller");

// Create new video with files - 'video' is the field name in form-data
router.post("/", upload.array("video", 5), createVideos);
// Get all videos
router.get("/", getAllVideos);
// Update video by ID
router.put("/:id", upload.array("video", 5), updateVideos);
// Delete video by ID
router.delete("/:id", deleteVideos);

module.exports = router;
