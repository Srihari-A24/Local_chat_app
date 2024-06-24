const express = require("express");
const Message = require("../models/message");

const router = express.Router();

// Send Message
router.post("/", (req, res) => {
  const { roomId, userId, message } = req.body;
  try {
    const info = Message.create(roomId, userId, message);
    res.status(201).json({ id: info.lastInsertRowid, roomId, userId, message });
  } catch (error) {
    res.status(400).json({ message: "Error sending message" });
  }
});

// Get Messages by Room ID
router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = Message.findByRoomId(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving messages" });
  }
});

module.exports = router;
