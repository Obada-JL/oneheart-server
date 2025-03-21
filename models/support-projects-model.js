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
    titleAr: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    categoryAr: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    paid: {
      type: Number,
      required: true,
      default: 0
    },
    details: {
      image: {
        type: String,
        required: false,
      },
      title: {
        type: String,
        required: false,
      },
      titleAr: {
        type: String,
        required: false,
      },
      description1: {
        type: String,
        required: false,
      },
      description1Ar: {
        type: String,
        required: false,
      },
      description2: {
        type: String,
        required: false,
      },
      description2Ar: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportProject", supportProjectSchema);
