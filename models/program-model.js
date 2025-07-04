const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleAr: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionAr: {
    type: String,
    required: true,
  },
  donationLinks: [
    {
      icon: { type: String, required: false },
      methodName: { type: String, required: true },
      link: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Program", programSchema);
