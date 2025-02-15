const mongoose = require("mongoose");

const supportProjectSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    buttonLink: {
      type: String,
      required: true,
    },
    details: {
      image: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description1: {
        type: String,
        required: true,
      },
      description2: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportProject", supportProjectSchema);
