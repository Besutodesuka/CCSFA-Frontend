const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

// Create the users table with logged_in_devices field
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      logged_in_devices TEXT DEFAULT '[]'
    )
  `);

  // Insert mock data with mocked logged_in_devices
  const stmt = db.prepare("INSERT INTO users (email, password, logged_in_devices) VALUES (?, ?, ?)");
  stmt.run("user1@example.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", JSON.stringify(["device1", "device2"])); // Hashed of password
  stmt.run("user2@example.com", "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", JSON.stringify(["device3"])); // Hashed of 123456
  stmt.run("user3@example.com", "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090", JSON.stringify(["Device1", "Device4"])); // Hashed of abc123

  stmt.finalize();

  // Close the database
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database setup complete with mocked devices');
    }
  });
});
