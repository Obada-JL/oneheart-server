const mongoose = require("mongoose");

const slidersSchema = new mongoose.Schema({
  sliderImage: {
    type: String,
    required: true,
  },
  sliderTitle: {
    type: String,
  },
  sliderTitleAr: {
    type: String,
  },
  sliderDescription: {
    type: String,
  },
  sliderDescriptionAr: {
    type: String,
  },
  donationsLink: {
    type: String,
  },
  detailsLink: {
    type: String,
  },
});

module.exports = mongoose.model("Sliders", slidersSchema);
