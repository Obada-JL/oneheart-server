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
    if (!req.body.title || !req.body.titleAr || !req.body.description || 
        !req.body.descriptionAr || !req.body.category || !req.body.categoryAr || !req.file) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "titleAr", "description", "descriptionAr", "category", "categoryAr", "image"],
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
        !details[0]?.fundAr ||
        !details[0]?.location ||
        !details[0]?.locationAr ||
        !details[0]?.duration ||
        !details[0]?.durationAr ||
        !details[0]?.Beneficiary ||
        !details[0]?.BeneficiaryAr
      ) {
        return res.status(400).json({
          message: "Invalid details format",
          required: ["fund", "fundAr", "location", "locationAr", "duration", "durationAr", "Beneficiary", "BeneficiaryAr"],
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
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      details: details.map((detail) => ({
        fund: detail.fund,
        fundAr: detail.fundAr,
        location: detail.location,
        locationAr: detail.locationAr,
        duration: detail.duration,
        durationAr: detail.durationAr,
        Beneficiary: detail.Beneficiary,
        BeneficiaryAr: detail.BeneficiaryAr,
      })),
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
      titleAr: req.body.titleAr || existingProject.titleAr,
      description: req.body.description || existingProject.description,
      descriptionAr: req.body.descriptionAr || existingProject.descriptionAr,
      category: req.body.category || existingProject.category,
      categoryAr: req.body.categoryAr || existingProject.categoryAr,
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
