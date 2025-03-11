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
    console.log("Create documentation - Request body:", req.body);
    console.log("Create documentation - Request files:", req.files);
    
    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images are allowed" });
    }

    const documentationData = {
      title: {
        en: req.body['title[en]'],
        ar: req.body['title[ar]']
      },
      description: {
        en: req.body['description[en]'],
        ar: req.body['description[ar]']
      },
      images: req.files.map(file => file.filename)
    };

    console.log("Documentation data:", documentationData);

    const documentation = new Documentation(documentationData);
    const savedDocumentation = await documentation.save();
    res.status(201).json(savedDocumentation);
  } catch (error) {
    console.error("Create error:", error);
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
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
    console.log("Update documentation - Request body:", req.body);
    console.log("Update documentation - Request files:", req.files);
    
    const doc = await Documentation.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    if (req.files && req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images are allowed" });
    }

    const updateData = {
      title: {
        en: req.body['title[en]'],
        ar: req.body['title[ar]']
      },
      description: {
        en: req.body['description[en]'],
        ar: req.body['description[ar]']
      }
    };

    // Update images only if new files are uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
      
      // Delete old images
      for (const oldImage of doc.images) {
        const imagePath = path.join(__dirname, '../uploads/documentations', oldImage);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    } else if (req.body.keepExistingImages === 'true') {
      // Keep existing images - explicitly set the images field to the existing images
      updateData.images = doc.images;
      console.log('Keeping existing images:', doc.images);
    } else {
      // If no new images and not keeping existing ones, ensure at least one image exists
      return res.status(400).json({ message: "At least one image is required" });
    }

    console.log('Update data:', updateData);

    const updatedDoc = await Documentation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDoc);
  } catch (error) {
    console.error('Update error:', error);
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ message: error.message });
  }
};
