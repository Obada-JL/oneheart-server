const CompletedProject = require("../models/completed-projects-model");

// Get all completed projects
const getAllCompletedProjects = async (req, res) => {
  try {
    const projects = await CompletedProject.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new completed project
const createCompletedProject = async (req, res) => {
  try {
    console.log("Received data:", {
      body: req.body,
      file: req.file,
    });

    // Validate required fields
    if (!req.body.title || !req.body.category || !req.file) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "category", "image"],
        received: req.body,
      });
    }

    // Parse details data
    let details;
    try {
      details = req.body.details ? JSON.parse(req.body.details) : [];

      // Validate details structure
      if (
        !Array.isArray(details) ||
        !details[0]?.fund ||
        !details[0]?.location ||
        !details[0]?.duration ||
        !details[0]?.Beneficiary
      ) {
        return res.status(400).json({
          message: "Invalid details format",
          required: ["fund", "location", "duration", "Beneficiary"],
          received: details,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid details JSON format",
        error: error.message,
      });
    }

    const projectData = {
      image: req.file.filename,
      title: req.body.title,
      category: req.body.category,
      details: details,
    };

    console.log("Creating project with data:", projectData);

    const project = new CompletedProject(projectData);
    const savedProject = await project.save();

    console.log("Saved project:", savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error in createCompletedProject:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Update completed project
const updateCompletedProject = async (req, res) => {
  try {
    const existingProject = await CompletedProject.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateData = {
      title: req.body.title || existingProject.title,
      category: req.body.category || existingProject.category,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    if (req.body.details) {
      try {
        const details = JSON.parse(req.body.details);
        updateData.details = details;
      } catch (error) {
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    const updatedProject = await CompletedProject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      message: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Delete completed project
const deleteCompletedProject = async (req, res) => {
  try {
    const deletedProject = await CompletedProject.findByIdAndDelete(
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
  getAllCompletedProjects,
  createCompletedProject,
  updateCompletedProject,
  deleteCompletedProject,
};
