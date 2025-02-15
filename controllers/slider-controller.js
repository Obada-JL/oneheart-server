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
  const sliderImage = req.files["sliderImage"]
    ? req.files["sliderImage"][0].filename
    : null;
  const newSlider = new Slider({
    sliderImage,
    sliderTitle: req.body.sliderTitle,
    sliderDescription: req.body.sliderDescription,
    donationsLink: req.body.donationsLink,
    detailsLink: req.body.detailsLink,
  });

  try {
    const savedSlider = await newSlider.save();
    res.status(201).json(savedSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update slider item
const updateSliderItem = async (req, res) => {
  try {
    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      {
        sliderTitle: req.body.sliderTitle,
        sliderDescription: req.body.sliderDescription,
        donationsLink: req.body.donationsLink,
        detailsLink: req.body.detailsLink,
      },
      { new: true }
    );
    if (req.files && req.files["sliderImage"]) {
      updatedSlider.sliderImage = req.files["sliderImage"][0].filename;
    }
    if (!updatedSlider) {
      return res.status(404).json({ message: "Slider item not found" });
    }
    res.status(200).json(updatedSlider);
  } catch (error) {
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
