import sqlite3 from "sqlite3";
import path from "path";
import { createHash } from "crypto";

const dbPath = path.join(process.cwd(), "Backend", "Database", "mydatabase.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Database connected");
  }
});

// Function to hash passwords
const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      logged_in_devices TEXT DEFAULT '[]'
    )
  `);

  const stmt = db.prepare("INSERT OR IGNORE INTO users (email, password, logged_in_devices) VALUES (?, ?, ?)");

  stmt.run("user1@example.com", hashPassword("password"), '["Device1", "Device2"]');
  stmt.run("user2@example.com", hashPassword("123456"), '["Device3"]');
  stmt.run("user3@example.com", hashPassword("abc123"), '["Device1", "Device4"]');

  stmt.finalize();
  db.close(() => console.log("Database setup complete"));
});
