const express = require("express");
const router = express.Router();
const {
  createCampaignDoc,
  getAllCampaignDocs,
  updateCampaignDoc,
  deleteCampaignDoc,
  createPhotos,
  getAllPhotos,
  updatePhotos,
  deletePhotos,
} = require("../controllers/docs-photos-controller");

// Campaign Doc routes
router.post("/campaign", createCampaignDoc);
router.get("/campaign", getAllCampaignDocs);
router.put("/campaign/:id", updateCampaignDoc);
router.delete("/campaign/:id", deleteCampaignDoc);

// Photos routes
router.post("/", createPhotos);
router.get("/", getAllPhotos);
router.put("/:id", updatePhotos);
router.delete("/:id", deletePhotos);

module.exports = router;
