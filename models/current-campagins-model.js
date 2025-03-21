const mongoose = require("mongoose");

const currentCampaignSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryAr: {
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
      titleAr: {
        type: String,
        required: true,
      },
      description1: {
        type: String,
        required: true,
      },
      description1Ar: {
        type: String,
        required: true,
      },
      description2: {
        type: String,
        required: true,
      },
      description2Ar: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CurrentCampaign", currentCampaignSchema);
