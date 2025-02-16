const Documentation = require("../models/documentation-model");
const fs = require("fs").promises;
const path = require("path");

exports.getAllDocumentations = async (req, res) => {
  try {
    const docs = await Documentation.find().sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDocumentation = async (req, res) => {
  try {
    const { title, titleAr, description, descriptionAr, detailsLink } =
      req.body;

    // Validate required fields
    if (!title || !titleAr || !description || !descriptionAr) {
      return res.status(400).json({
        message: "All text fields are required in both languages",
      });
    }

    const images = req.files?.map((file) => file.filename) || [];

    const documentation = new Documentation({
      title,
      titleAr,
      description,
      descriptionAr,
      images,
      detailsLink,
    });

    const savedDoc = await documentation.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDocumentation = async (req, res) => {
  try {
    const doc = await Documentation.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Documentation not found" });
    }
    res.status(200).json({ message: "Documentation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocumentationById = async (req, res) => {
  try {
    const doc = await Documentation.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Documentation not found" });
    }
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDocumentation = async (req, res) => {
  try {
    const { title, titleAr, description, descriptionAr, detailsLink } =
      req.body;

    const doc = await Documentation.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    // Handle images update
    let images = doc.images;
    if (req.files && req.files.length > 0) {
      // Update with new images
      images = req.files.map((file) => file.filename);
    }

    const updateData = {
      title: title || doc.title,
      titleAr: titleAr || doc.titleAr,
      description: description || doc.description,
      descriptionAr: descriptionAr || doc.descriptionAr,
      detailsLink: detailsLink || doc.detailsLink,
      images,
    };

    const updatedDoc = await Documentation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
