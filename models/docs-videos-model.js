const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema({
  Name: { type: String },
  Description: { type: String },
  category: { type: String },
  video: { type: [String] },
});
module.exports = mongoose.model("videos", videosSchema);
