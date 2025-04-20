const mongoose = require("mongoose");

const sponsorshipsSchema = new mongoose.Schema(
  {
    sponsorshipImage: { type: String },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    category: { type: String, required: true },
    categoryAr: { type: String, required: true },
    total: { type: Number, required: true },
    remaining: { type: Number, required: true },
    donationLinks: [
      {
        icon: { type: String, required: false },
        methodName: { type: String, required: true },
        link: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("sponsorships", sponsorshipsSchema);
