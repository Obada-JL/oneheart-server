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
    const mainImage = req.files.find(file => file.fieldname === 'image');
    if (!mainImage) {
      return res.status(400).json({ message: "Main image is required" });
    }
    
    // Parse donationLinks if provided
    let donationLinks = [];
    if (req.body.donationLinks) {
      try {
        donationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donationLinks:", donationLinks);
        
        // Process donation icon files if they exist
        if (req.files && req.files.length > 0) {
          // Find all donation icon files
          const donationIconFiles = req.files.filter(file => 
            file.fieldname.startsWith('donationIcon_')
          );
          
          // If we have donation icon files, update the links with the filenames
          if (donationIconFiles.length > 0) {
            donationLinks = donationLinks.map(link => {
              // If this link has an iconIndex, find the matching file
              if (link.iconIndex !== undefined) {
                const iconFile = donationIconFiles.find(file => 
                  file.fieldname === `donationIcon_${link.iconIndex}`
                );
                
                if (iconFile) {
                  // Replace iconIndex with the actual filename
                  delete link.iconIndex;
                  link.icon = iconFile.filename;
                }
              }
              return link;
            });
          }
        }
      } catch (error) {
        console.error("Error parsing donationLinks:", error);
        return res.status(400).json({ message: "Invalid donationLinks format" });
      }
    }

    const projectData = {
      image: mainImage.filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      total: Number(req.body.total) || 0,
      paid: Number(req.body.paid) || 0,
      donationLinks: donationLinks
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
    };
    
    // Parse donationLinks if provided
    if (req.body.donationLinks) {
      try {
        let updatedDonationLinks = JSON.parse(req.body.donationLinks);
        console.log("Parsed donationLinks for update:", updatedDonationLinks);
        
        // Process donation icon files if they exist
        if (req.files && req.files.length > 0) {
          // Find all donation icon files
          const donationIconFiles = req.files.filter(file => 
            file.fieldname.startsWith('donationIcon_')
          );
          
          // If we have donation icon files, update the links with the filenames
          if (donationIconFiles.length > 0) {
            updatedDonationLinks = updatedDonationLinks.map(link => {
              // If this link has an iconIndex, find the matching file
              if (link.iconIndex !== undefined) {
                const iconFile = donationIconFiles.find(file => 
                  file.fieldname === `donationIcon_${link.iconIndex}`
                );
                
                if (iconFile) {
                  // Replace iconIndex with the actual filename
                  delete link.iconIndex;
                  link.icon = iconFile.filename;
                }
              }
              return link;
            });
          }
        }
        
        updateData.donationLinks = updatedDonationLinks;
      } catch (error) {
        console.error("Error parsing donationLinks:", error);
        return res.status(400).json({ message: "Invalid donationLinks format" });
      }
    }

    // Update image if provided
    const mainImage = req.files && req.files.find(file => file.fieldname === 'image');
    if (mainImage) {
      updateData.image = mainImage.filename;
      
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
