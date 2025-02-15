const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messages-controller");
router.get("/", getAllMessages);
router.post("/", createMessage);
router.put("/:id", updateMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
