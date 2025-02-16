const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", videoSchema);
