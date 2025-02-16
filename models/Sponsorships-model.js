const mongoose = require("mongoose");

const sponsorshipsSchema = new mongoose.Schema(
  {
    sponsorshipImage: { type: String },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    donationLink: { type: String, required: true },
    category: { type: String, required: true },
    categoryAr: { type: String, required: true },
    total: { type: String, required: true },
    remaining: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sponsorships", sponsorshipsSchema);
