const db = require("../db");

class Room {
  static create(name) {
    const stmt = db.prepare("INSERT INTO rooms (name) VALUES (?)");
    return stmt.run(name);
  }

  static findAll() {
    const stmt = db.prepare("SELECT * FROM rooms");
    return stmt.all();
  }

  static findById(id) {
    const stmt = db.prepare("SELECT * FROM rooms WHERE id = ?");
    return stmt.get(id);
  }
}

module.exports = Room;
