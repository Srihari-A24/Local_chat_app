const db = require("../db");
const bcrypt = require("bcrypt");

class User {
  static create(username, password) {
    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    return stmt.run(username, hash);
  }

  static findByUsername(username) {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    return stmt.get(username);
  }

  static findById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
  }

  static validatePassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }
}

module.exports = User;
