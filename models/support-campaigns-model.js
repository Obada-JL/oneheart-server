const mongoose = require("mongoose");

const supportCampaignSchema = new mongoose.Schema({
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
    required: true,
  },
  categoryAr: {
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
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  paid: {
    type: Number,
    required: true,
    default: 0,
  },
  donationLinks: {
    type: String,
    default: "[]",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SupportCampaign", supportCampaignSchema); 