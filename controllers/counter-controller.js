const Counter = require("../models/counter-model");

// Get all counter items
const getCounterItems = async (req, res) => {
  try {
    const counterItems = await Counter.find();
    res.status(200).json(counterItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new counter item
const addCounterItem = async (req, res) => {
  try {
    if (!req.files || !req.files["counterImage"]) {
      return res.status(400).json({ message: "Counter image is required" });
    }

    const newCounter = new Counter({
      counterImage: req.files["counterImage"][0].filename,
      counterTitle: req.body.counterTitleEn,
      counterTitleAr: req.body.counterTitleAr,
      counterNumber: req.body.counterNumber,
    });

    const savedCounter = await newCounter.save();
    res.status(201).json(savedCounter);
  } catch (error) {
    console.error("Error adding counter:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update counter item
const updateCounterItem = async (req, res) => {
  try {
    const updateData = {
      counterTitle: req.body.counterTitleEn,
      counterTitleAr: req.body.counterTitleAr,
      counterNumber: req.body.counterNumber,
    };

    if (req.files && req.files["counterImage"]) {
      updateData.counterImage = req.files["counterImage"][0].filename;
    }

    const updatedCounter = await Counter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCounter) {
      return res.status(404).json({ message: "Counter item not found" });
    }

    res.status(200).json(updatedCounter);
  } catch (error) {
    console.error("Error updating counter:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete counter item
const deleteCounterItem = async (req, res) => {
  try {
    const deletedCounter = await Counter.findByIdAndDelete(req.params.id);
    if (!deletedCounter) {
      return res.status(404).json({ message: "Counter item not found" });
    }
    res.status(200).json({ message: "Counter item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCounterItems,
  addCounterItem,
  updateCounterItem,
  deleteCounterItem,
};
