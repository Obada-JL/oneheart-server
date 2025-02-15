const ContactInfo = require("../models/contact-info-model");

// Create new contact info
exports.create = async (req, res) => {
  try {
    const contactInfo = new ContactInfo({
      whatsapp: req.body.whatsapp,
      email: req.body.email,
      telegram: req.body.telegram,
      location: req.body.location,
    });

    const savedContactInfo = await contactInfo.save();
    res.status(201).json(savedContactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contact info
exports.findAll = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find();
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact info by ID
exports.update = async (req, res) => {
  try {
    const updatedContactInfo = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      {
        whatsapp: req.body.whatsapp,
        email: req.body.email,
        telegram: req.body.telegram,
        location: req.body.location,
      },
      { new: true }
    );

    if (!updatedContactInfo) {
      return res.status(404).json({ message: "Contact info not found" });
    }
    res.status(200).json(updatedContactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contact info by ID
exports.delete = async (req, res) => {
  try {
    const deletedContactInfo = await ContactInfo.findByIdAndDelete(
      req.params.id
    );
    if (!deletedContactInfo) {
      return res.status(404).json({ message: "Contact info not found" });
    }
    res.status(200).json({ message: "Contact info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
