const mongoose = require("mongoose");

const slidersSchema = new mongoose.Schema({
  sliderImage: {
    type: String,
  },
  sliderTitle: {
    type: String,
  },
  sliderDescription: {
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
