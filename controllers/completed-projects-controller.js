const CompletedProject = require("../models/completed-projects-model");
const path = require("path");
const fs = require("fs");

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
      files: req.files,
    });

    // Find the main image file
    const mainImage = req.files && req.files.find(file => file.fieldname === 'image');
    if (!mainImage) {
      return res.status(400).json({
        message: "Missing required image file",
        received: req.files?.map(f => f.fieldname) || [],
      });
    }

    // Validate required fields
    if (!req.body.title || !req.body.titleAr || !req.body.category || !req.body.categoryAr) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "titleAr", "category", "categoryAr", "image"],
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

    // Parse donation links if provided
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
      donationLinks: donationLinks,
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
      receivedData: { body: req.body, files: req.files },
    });
  }
};

// Update completed project
const updateCompletedProject = async (req, res) => {
  try {
    console.log("Update Received data:", {
      body: req.body,
      files: req.files,
    });

    const existingProject = await CompletedProject.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateData = {
      title: req.body.title || existingProject.title,
      titleAr: req.body.titleAr || existingProject.titleAr,
      category: req.body.category || existingProject.category,
      categoryAr: req.body.categoryAr || existingProject.categoryAr,
    };

    // Find the main image file if provided
    const mainImage = req.files && req.files.find(file => file.fieldname === 'image');
    if (mainImage) {
      updateData.image = mainImage.filename;
    }

    // Parse details data if provided
    if (req.body.details) {
      try {
        const details = JSON.parse(req.body.details);
        updateData.details = details;
      } catch (error) {
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    // Parse donation links if provided
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
      receivedData: { body: req.body, files: req.files },
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
