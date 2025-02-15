const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    whatsapp: { type: String },
    email: { type: String },
    telegram: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
