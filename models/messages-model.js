const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  senderName: {
    type: String,
  },
  senderEmail: {
    type: String,
  },
  recievedMessage: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  isRead: {
    type: Boolean,
  },
});
module.exports = mongoose.model("messages", messagesSchema);
