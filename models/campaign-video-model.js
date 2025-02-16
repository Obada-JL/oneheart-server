const mongoose = require("mongoose");

const campaignVideoSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CampaignVideo", campaignVideoSchema);
