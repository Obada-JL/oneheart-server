const CampaignDoc = require("../models/docs-photos-model");
const Photo = require("../models/photos-model");
const fs = require("fs").promises;
const path = require("path");

// Campaign Doc Controllers
exports.createCampaignDoc = async (req, res) => {
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

exports.getAllCampaignDocs = async (req, res) => {
  try {
    const campaignDocs = await CampaignDoc.find();
    res.status(200).json(campaignDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaignDoc = async (req, res) => {
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

exports.deleteCampaignDoc = async (req, res) => {
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

// Photo Controllers
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPhotosByDocId = async (req, res) => {
  try {
    const photos = await Photo.find({ docId: req.params.docId });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPhotos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const { docId } = req.body;
    if (!docId) {
      return res.status(400).json({ message: "Documentation ID is required" });
    }

    const photoData = req.files.map((file) => ({
      image: file.filename,
      docId,
    }));

    const savedPhotos = await Photo.insertMany(photoData);
    res.status(201).json(savedPhotos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete physical file
    const filePath = path.join(
      __dirname,
      "../uploads/documentation",
      photo.image
    );
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    // Delete database record
    await Photo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image
      const oldFilePath = path.join(
        __dirname,
        "../uploads/documentation",
        photo.image
      );
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.error("Error deleting old file:", err);
      }

      // Update with new image
      photo.image = req.file.filename;
    }

    // Update other fields if needed
    if (req.body.docId) {
      photo.docId = req.body.docId;
    }

    const updatedPhoto = await photo.save();
    res.status(200).json(updatedPhoto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.handlePhotoUpload = async (req, res) => {
  try {
    const { docId } = req.body;
    const files = req.files;

    if (!docId || !files) {
      return res.status(400).json({
        message: "Both docId and image files are required",
      });
    }

    const photos = await Promise.all(
      files.map(async (file) => {
        const photo = new Photo({
          image: file.filename,
          docId,
        });
        return await photo.save();
      })
    );

    res.status(201).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fixed exports at the bottom
module.exports = {
  createCampaignDoc: exports.createCampaignDoc,
  getAllCampaignDocs: exports.getAllCampaignDocs,
  updateCampaignDoc: exports.updateCampaignDoc,
  deleteCampaignDoc: exports.deleteCampaignDoc,
  getAllPhotos: exports.getAllPhotos,
  getPhotosByDocId: exports.getPhotosByDocId,
  createPhotos: exports.createPhotos,
  deletePhoto: exports.deletePhoto,
  updatePhoto: exports.updatePhoto,
  handlePhotoUpload: exports.handlePhotoUpload,
};
