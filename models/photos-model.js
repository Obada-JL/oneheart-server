const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  image: {
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

module.exports = mongoose.model("Photo", photoSchema);
