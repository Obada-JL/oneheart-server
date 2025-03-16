const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    en: { type: String },
    ar: { type: String }
  },
  description: {
    en: { type: String },
    ar: { type: String }
  },
  video: { type: String, required: true },
  videoUrl: { type: String },
  docId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", videoSchema);
