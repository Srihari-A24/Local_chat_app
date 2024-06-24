const express = require("express");
const Room = require("../models/room");

const router = express.Router();

// Create Room
router.post("/", (req, res) => {
  const { name } = req.body;
  try {
    const info = Room.create(name);
    res.status(201).json({ id: info.lastInsertRowid, name });
  } catch (error) {
    res.status(400).json({ message: "Error creating room" });
  }
});

// Get All Rooms
router.get("/", (req, res) => {
  try {
    const rooms = Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rooms" });
  }
});

module.exports = router;
