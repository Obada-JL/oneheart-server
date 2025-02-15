const mongoose = require("mongoose");

const completedCampaignsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    details: [
      {
        fund: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        Beneficiary: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompletedCampaigns", completedCampaignsSchema);
