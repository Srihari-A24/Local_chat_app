const db = require("../db");

class Message {
  static create(roomId, userId, message) {
    const stmt = db.prepare(
      "INSERT INTO messages (roomId, userId, message) VALUES (?, ?, ?)"
    );
    return stmt.run(roomId, userId, message);
  }

  static findByRoomId(roomId) {
    const stmt = db.prepare(
      "SELECT messages.*, users.username FROM messages JOIN users ON messages.userId = users.id WHERE roomId = ? ORDER BY timestamp"
    );
    return stmt.all(roomId);
  }
}

module.exports = Message;
