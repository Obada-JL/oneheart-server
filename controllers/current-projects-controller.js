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
    if (!req.files?.image) {
      return res
        .status(400)
        .json({ message: "Project image is required" });
    }
    
    // Parse donationLinks if provided
    let donationLinks = [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
      } catch (error) {
        return res.status(400).json({ message: "Invalid donationLinks format" });
      }
    }

    const projectData = {
      image: req.files.image[0].filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      donationLinks: donationLinks
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
      category: req.body.category || existingProject.category,
      categoryAr: req.body.categoryAr || existingProject.categoryAr,
    };

    // Update image if provided
    if (req.files?.image) {
      updateData.image = req.files.image[0].filename;
    }
    
    // Update donationLinks if provided
    if (req.body.donationLinks) {
      try {
        updateData.donationLinks = JSON.parse(req.body.donationLinks);
      } catch (error) {
        return res.status(400).json({ message: "Invalid donationLinks format" });
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
