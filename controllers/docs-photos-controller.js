const CampaignDoc = require("../models/docs-photos-model");
const Photos = require("../models/docs-photos-model");

// Create new campaign document
const createCampaignDoc = async (req, res) => {
  try {
    const { campaginName, campaginDescription } = req.body;

    // Handle file paths
    const campaginPhoto = req.files
      ? req.files.map((file) => file.filename)
      : [];

    if (!campaginName || !campaginDescription) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["campaginName", "campaginDescription"],
        received: req.body,
      });
    }

    const newCampaignDoc = new CampaignDoc({
      campaginName,
      campaginDescription,
      campaginPhoto,
    });

    const savedCampaignDoc = await newCampaignDoc.save();
    res.status(201).json(savedCampaignDoc);
  } catch (error) {
    console.error("Error creating campaign doc:", error);
    res.status(500).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Get all campaign documents
const getAllCampaignDocs = async (req, res) => {
  try {
    const campaignDocs = await CampaignDoc.find();
    res.status(200).json(campaignDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update campaign document by ID
const updateCampaignDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaginName, campaginDescription } = req.body;

    // Get the existing document first
    const existingDoc = await CampaignDoc.findById(id);
    if (!existingDoc) {
      return res.status(404).json({ message: "Campaign document not found" });
    }

    // Prepare update data
    const updateData = {
      campaginName: campaginName || existingDoc.campaginName,
      campaginDescription:
        campaginDescription || existingDoc.campaginDescription,
    };

    // Only update photos if new files are provided
    if (req.files && req.files.length > 0) {
      updateData.campaginPhoto = req.files.map((file) => file.filename);
    }

    const updatedCampaignDoc = await CampaignDoc.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedCampaignDoc);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Delete campaign document by ID
const deleteCampaignDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaignDoc = await CampaignDoc.findByIdAndDelete(id);

    if (!deletedCampaignDoc) {
      return res.status(404).json({ message: "Campaign document not found" });
    }

    res.status(200).json({ message: "Campaign document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPhotos = async (req, res) => {
  try {
    const photo = await Photos.create(req.body);
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photos.find({});
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photos.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    await Photos.findByIdAndDelete(id);
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCampaignDoc,
  getAllCampaignDocs,
  updateCampaignDoc,
  deleteCampaignDoc,
  createPhotos,
  getAllPhotos,
  updatePhotos,
  deletePhotos,
};
