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
    donationLinks: [
      {
        icon: {
          type: String,
          required: false
        },
        methodName: {
          type: String,
          required: true
        },
        link: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CurrentCampaign", currentCampaignSchema);
