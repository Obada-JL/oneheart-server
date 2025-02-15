const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    aboutUs: {
      description: {
        type: String,
        required: true,
      },
      photos: {
        type: [String],
        required: true,
        validate: [arrayLimit, "About Us section can only have 2 photos"],
      },
    },
    goal: {
      description: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
    vision: {
      description: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
    message: {
      description: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
    values: {
      description: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 2;
}

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
