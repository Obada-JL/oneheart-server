const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  recievedMessage: {
    type: String,
    required: true,
  },
  language: {
    // Add this field
    type: String,
    enum: ["en", "ar"],
    default: "en",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
