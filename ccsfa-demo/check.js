import sqlite3 from 'sqlite3';
import path from 'path';

// Ensure correct database path
const dbPath = path.join(process.cwd(), 'Backend', 'Database', 'mydatabase.db');

// Open the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to database:', dbPath);

    // Query to get all users
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err.message);
      } else {
        console.log('Users:', rows);
      }

      // Close the database after the query
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database closed.');
        }
      });
    });
  }
});
