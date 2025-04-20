const mongoose = require("mongoose");

const slidersSchema = new mongoose.Schema({
  sliderImage: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 3;
      },
      message: 'Slider must have between 1 and 3 images'
    }
  },
  sliderTitle: {
    type: String,
  },
  sliderTitleEn: {
    type: String,
  },
  sliderTitleAr: {
    type: String,
  },
  sliderDescription: {
    type: String,
  },
  sliderDescriptionEn: {
    type: String,
  },
  sliderDescriptionAr: {
    type: String,
  },
  donationLinks: [
    {
      icon: { type: String, required: false },
      methodName: { type: String, required: true },
      link: { type: String, required: true }
    }
  ],
  detailsLink: {
    type: String,
  },
});

module.exports = mongoose.model("Sliders", slidersSchema);
