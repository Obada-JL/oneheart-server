const Sponsorship = require("../models/Sponsorships-model");

// Get all sponsorship items
const getSponsorshipItems = async (req, res) => {
  try {
    const sponsorshipItems = await Sponsorship.find();
    res.status(200).json(sponsorshipItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new sponsorship item
const addSponsorshipItem = async (req, res) => {
  try {
    const sponsorshipData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      donationLink: req.body.donationLink,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      total: req.body.total,
      remaining: req.body.remaining,
    };

    if (req.file) {
      sponsorshipData.sponsorshipImage = req.file.filename;
    }

    const newSponsorship = new Sponsorship(sponsorshipData);
    const savedSponsorship = await newSponsorship.save();

    res.status(201).json(savedSponsorship);
  } catch (error) {
    console.error("Error saving sponsorship:", error);
    res.status(400).json({
      message: "Failed to save sponsorship",
      error: error.message,
      receivedData: { body: req.body, file: req.file },
    });
  }
};

// Update sponsorship item
const updateSponsorshipItem = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      donationLink: req.body.donationLink,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      total: req.body.total,
      remaining: req.body.remaining,
    };

    if (req.file) {
      updateData.sponsorshipImage = req.file.filename;
    }

    const updatedSponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedSponsorship) {
      return res.status(404).json({ message: "Sponsorship item not found" });
    }

    res.status(200).json(updatedSponsorship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete sponsorship item
const deleteSponsorshipItem = async (req, res) => {
  try {
    const deletedSponsorship = await Sponsorship.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSponsorship) {
      return res.status(404).json({ message: "Sponsorship item not found" });
    }
    res.status(200).json({ message: "Sponsorship item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSponsorshipItems,
  addSponsorshipItem,
  updateSponsorshipItem,
  deleteSponsorshipItem,
};
