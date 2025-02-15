const mongoose = require("mongoose");

const sponsorshipsSchema = new mongoose.Schema({
  sponsorshipImage: { type: String },
  title: { type: String },
  description: { type: String },
  donationLink: { type: String },
  category: { type: String },
  total: { type: String },
  remaining: { type: String },
});
module.exports = mongoose.model("sponsorships", sponsorshipsSchema);
