const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const saltRounds = 10;
const secretKey = "your_secret_key";

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const stmt = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    stmt.run(username, hashedPassword);
    res.status(201).send("User registered successfully");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      res.status(409).send("Username already exists");
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username);

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
