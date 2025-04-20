const mongoose = require("mongoose");

const supportCampaignSchema = new mongoose.Schema(
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

module.exports = mongoose.model("SupportCampaign", supportCampaignSchema);
