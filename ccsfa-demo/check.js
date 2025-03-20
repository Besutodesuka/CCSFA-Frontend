// Use to check data in database
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./mydatabase.db');

// Query to get all users
db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log(rows);
});

// Close the database when done
db.close();
