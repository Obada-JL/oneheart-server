const Message = require("../models/messages-model");

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const { language } = req.query; // Allow filtering by language
    const query = language ? { language } : {};

    const messages = await Message.find(query);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const TimeStamp = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
    });

    // Check incoming data before creating message
    if (
      !req.body.senderName ||
      !req.body.senderEmail ||
      !req.body.recievedMessage
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["senderName", "senderEmail", "recievedMessage"],
        received: {
          senderName: req.body.senderName,
          senderEmail: req.body.senderEmail,
          recievedMessage: req.body.recievedMessage,
        },
      });
    }

    const message = new Message({
      senderName: req.body.senderName,
      senderEmail: req.body.senderEmail,
      recievedMessage: req.body.recievedMessage, // Use the spelling from the request
      language: req.body.language || "en", // Default to English if not specified
      isRead: false,
      timestamp: TimeStamp,
    });
    console.log("Message:", message);
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      receivedData: req.body,
    });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    // Update only the provided fields
    message.senderName = req.body.senderName || message.senderName;
    message.senderEmail = req.body.senderEmail || message.senderEmail;
    message.receivedMessage =
      req.body.receivedMessage || message.receivedMessage;
    message.timestamp = req.body.timestamp || message.timestamp;
    message.isRead = req.body.isRead || message.isRead;
    // Update the isRead field if provided
    if (req.body.hasOwnProperty("isRead")) {
    }

    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.remove();
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
