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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    details: {
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

module.exports = mongoose.model("CurrentCampaign", currentCampaignSchema);
