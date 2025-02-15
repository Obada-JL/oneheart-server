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
    description: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    donateLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SupportCampaign = mongoose.model(
  "SupportCampaign",
  supportCampaignSchema
);

module.exports = SupportCampaign;
