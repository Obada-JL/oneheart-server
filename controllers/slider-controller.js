const Slider = require("../models/slider-model");

// Get all slider items
const getSliderItems = async (req, res) => {
  try {
    const sliderItems = await Slider.find();
    res.status(200).json(sliderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new slider item
const addSliderItem = async (req, res) => {
  try {
    if (!req.files || !req.files["sliderImage"]) {
      return res.status(400).json({ message: "Slider image is required" });
    }

    const newSlider = new Slider({
      sliderImage: req.files["sliderImage"][0].filename,
      sliderTitle: req.body.sliderTitleEn,
      sliderTitleAr: req.body.sliderTitleAr,
      sliderDescription: req.body.sliderDescriptionEn,
      sliderDescriptionAr: req.body.sliderDescriptionAr,
      donationsLink: req.body.donationsLink,
      detailsLink: req.body.detailsLink,
    });

    const savedSlider = await newSlider.save();
    res.status(201).json(savedSlider);
  } catch (error) {
    console.error("Error adding slider:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update slider item
const updateSliderItem = async (req, res) => {
  try {
    const updateData = {
      sliderTitle: req.body.sliderTitleEn,
      sliderTitleAr: req.body.sliderTitleAr,
      sliderDescription: req.body.sliderDescriptionEn,
      sliderDescriptionAr: req.body.sliderDescriptionAr,
      donationsLink: req.body.donationsLink,
      detailsLink: req.body.detailsLink,
    };

    if (req.files && req.files["sliderImage"]) {
      updateData.sliderImage = req.files["sliderImage"][0].filename;
    }

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedSlider) {
      return res.status(404).json({ message: "Slider item not found" });
    }

    res.status(200).json(updatedSlider);
  } catch (error) {
    console.error("Error updating slider:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete slider item
const deleteSliderItem = async (req, res) => {
  try {
    const deletedSlider = await Slider.findByIdAndDelete(req.params.id);
    if (!deletedSlider) {
      return res.status(404).json({ message: "Slider item not found" });
    }
    res.status(200).json({ message: "Slider item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSliderItems,
  addSliderItem,
  updateSliderItem,
  deleteSliderItem,
};
