const SupportProject = require("../models/support-projects-model");

// Get all support projects
const getAllSupportProjects = async (req, res) => {
  try {
    const projects = await SupportProject.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Create new support project
const createSupportProject = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    // Check for required files
    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Parse details if it's a string
    let details;
    try {
      details =
        typeof req.body.details === "string"
          ? JSON.parse(req.body.details)
          : req.body.details;
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
        image: req.files.detailsImage?.[0]?.filename,
        title: details.title,
        titleAr: details.titleAr,
        description1: details.description1,
        description1Ar: details.description1Ar,
        description2: details.description2,
        description2Ar: details.description2Ar,
      },
    };

    const project = new SupportProject(projectData);
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

// Update support project
const updateSupportProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProject = await SupportProject.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title || existingProject.title,
      titleAr: req.body.titleAr || existingProject.titleAr,
      description: req.body.description || existingProject.description,
      descriptionAr: req.body.descriptionAr || existingProject.descriptionAr,
      buttonLink: req.body.buttonLink || existingProject.buttonLink,
    };

    // Update main image if provided
    if (req.files?.mainImage?.[0]) {
      updateData.image = req.files.mainImage[0].filename;
    }

    // Handle details update
    if (req.body.details) {
      let details =
        typeof req.body.details === "string"
          ? JSON.parse(req.body.details)
          : req.body.details;

      // Update detail images if provided
      const detailImages = req.files?.detailImages || [];
      details = details.map((detail, index) => ({
        ...detail,
        image: detailImages[index]?.filename || detail.image,
      }));

      updateData.details = details;
    }

    const updatedProject = await SupportProject.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, files: req.files },
    });
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSupportProjects,
  getSupportProjectById,
  createSupportProject,
  updateSupportProject,
  deleteSupportProject,
};
