const mongoose = require("mongoose");

const photosSchema = new mongoose.Schema({
  campaginName: { type: String },
  campaginDescription: { type: String },
  campaginPhoto: { type: [String] },
});
module.exports = mongoose.model("photos", photosSchema);
