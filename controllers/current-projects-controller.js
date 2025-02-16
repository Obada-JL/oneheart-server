const CurrentProject = require("../models/current-projects-model");

// Get all current projects
const getAllCurrentProjects = async (req, res) => {
  try {
    const projects = await CurrentProject.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current project by ID
const getCurrentProjectById = async (req, res) => {
  try {
    const project = await CurrentProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new current project
const createCurrentProject = async (req, res) => {
  try {
    // Check for required files
    if (!req.files?.image || !req.files?.detailsImage) {
      return res
        .status(400)
        .json({ message: "Both main image and details image are required" });
    }

    // Parse details from the request body
    let details;
    try {
      details = JSON.parse(req.body.details);
    } catch (error) {
      return res.status(400).json({ message: "Invalid details format" });
    }

    const projectData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      buttonLink: req.body.buttonLink,
      details: {
        image: req.files.detailsImage[0].filename,
        title: details.title,
        titleAr: details.titleAr,
        description1: details.description1,
        description1Ar: details.description1Ar,
        description2: details.description2,
        description2Ar: details.description2Ar,
      },
    };

    const project = new CurrentProject(projectData);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

const updateCurrentProject = async (req, res) => {
  try {
    const existingProject = await CurrentProject.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateData = {
      title: req.body.title || existingProject.title,
      titleAr: req.body.titleAr || existingProject.titleAr,
      description: req.body.description || existingProject.description,
      descriptionAr: req.body.descriptionAr || existingProject.descriptionAr,
      buttonLink: req.body.buttonLink || existingProject.buttonLink,
    };

    // Update main image if provided
    if (req.files?.image) {
      updateData.image = req.files.image[0].filename;
    }

    // Handle details update
    if (req.body.details) {
      const details = JSON.parse(req.body.details);
      updateData.details = {
        ...existingProject.details,
        ...details,
      };

      // Update details image if provided
      if (req.files?.detailsImage) {
        updateData.details.image = req.files.detailsImage[0].filename;
      }
    }

    const updatedProject = await CurrentProject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Delete current project
const deleteCurrentProject = async (req, res) => {
  try {
    const deletedProject = await CurrentProject.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCurrentProjects,
  getCurrentProjectById,
  createCurrentProject,
  updateCurrentProject,
  deleteCurrentProject,
};
