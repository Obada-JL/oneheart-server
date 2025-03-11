const SupportProject = require("../models/support-projects-model");
const path = require("path");
const fs = require("fs");

// Get all support projects
const getAllSupportProjects = async (req, res) => {
  try {
    const projects = await SupportProject.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

// Get support project by ID
const getSupportProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await SupportProject.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project", error: error.message });
  }
};

// Create new support project
const createSupportProject = async (req, res) => {
  try {
    console.log("Body received:", req.body);
    console.log("Files received:", req.files);

    // Check if image is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Parse details if it's a string
    let details = {};
    if (req.body.details) {
      try {
        details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
      } catch (error) {
        console.error("Error parsing details:", error);
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    const projectData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      total: Number(req.body.total) || 0,
      paid: Number(req.body.paid) || 0,
      details: {
        image: req.files.detailsImage?.[0]?.filename,
        title: details.title || req.body.detailsTitle,
        titleAr: details.titleAr || req.body.detailsTitleAr,
        description1: details.description1 || req.body.detailsDescription1,
        description1Ar: details.description1Ar || req.body.detailsDescription1Ar,
        description2: details.description2 || req.body.detailsDescription2,
        description2Ar: details.description2Ar || req.body.detailsDescription2Ar,
      },
    };

    // Validate required fields
    const requiredFields = [
      { field: 'title', label: 'Title in English' },
      { field: 'titleAr', label: 'Title in Arabic' },
      { field: 'description', label: 'Description in English' },
      { field: 'descriptionAr', label: 'Description in Arabic' },
      { field: 'total', label: 'Required Amount' },
      { field: 'paid', label: 'Paid Amount' },
    ];

    const missingFields = [];
    requiredFields.forEach(({ field, label }) => {
      if (projectData[field] === undefined || projectData[field] === null || 
          (typeof projectData[field] === 'string' && projectData[field].trim() === '')) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newProject = new SupportProject(projectData);
    await newProject.save();

    res.status(201).json({
      message: "Support project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating support project:", error);
    res.status(500).json({ message: "Error creating support project" });
  }
};

// Update support project
const updateSupportProject = async (req, res) => {
  try {
    console.log("Update Body received:", req.body);
    console.log("Update Files received:", req.files);

    const { id } = req.params;

    // Check if project exists
    const existingProject = await SupportProject.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Support project not found" });
    }

    // Parse details if it's a string
    let details = {};
    if (req.body.details) {
      try {
        details = typeof req.body.details === "string" ? JSON.parse(req.body.details) : req.body.details;
      } catch (error) {
        console.error("Error parsing details:", error);
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      total: Number(req.body.total) || 0,
      paid: Number(req.body.paid) || 0,
      details: {
        ...existingProject.details,
        title: details.title || req.body.detailsTitle || existingProject.details.title,
        titleAr: details.titleAr || req.body.detailsTitleAr || existingProject.details.titleAr,
        description1: details.description1 || req.body.detailsDescription1 || existingProject.details.description1,
        description1Ar: details.description1Ar || req.body.detailsDescription1Ar || existingProject.details.description1Ar,
        description2: details.description2 || req.body.detailsDescription2 || existingProject.details.description2,
        description2Ar: details.description2Ar || req.body.detailsDescription2Ar || existingProject.details.description2Ar,
      },
    };

    // Update image if provided
    if (req.files && req.files.image) {
      updateData.image = req.files.image[0].filename;
      
      // Delete old image
      if (existingProject.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'support-projects', existingProject.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else {
      // Keep existing image
      updateData.image = existingProject.image;
    }

    // Update details image if provided
    if (req.files && req.files.detailsImage) {
      updateData.details.image = req.files.detailsImage[0].filename;
      
      // Delete old details image
      if (existingProject.details && existingProject.details.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'support-projects', 'details', existingProject.details.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (existingProject.details && existingProject.details.image) {
      // Keep existing details image
      updateData.details.image = existingProject.details.image;
    }

    // Validate required fields
    const requiredFields = [
      { field: 'title', label: 'Title in English' },
      { field: 'titleAr', label: 'Title in Arabic' },
      { field: 'description', label: 'Description in English' },
      { field: 'descriptionAr', label: 'Description in Arabic' },
      { field: 'total', label: 'Required Amount' },
      { field: 'paid', label: 'Paid Amount' },
    ];

    const missingFields = [];
    requiredFields.forEach(({ field, label }) => {
      if (updateData[field] === undefined || updateData[field] === null || 
          (typeof updateData[field] === 'string' && updateData[field].trim() === '')) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Update project
    const updatedProject = await SupportProject.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Support project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating support project:", error);
    res.status(500).json({ message: "Error updating support project" });
  }
};

// Delete support project
const deleteSupportProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await SupportProject.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};

module.exports = {
  getAllSupportProjects,
  getSupportProjectById,
  createSupportProject,
  updateSupportProject,
  deleteSupportProject,
};
