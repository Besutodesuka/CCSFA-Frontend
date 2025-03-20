// pages/api/login.js

import db from '../../db'; // Ensure you're importing your DB connection correctly
import crypto from 'crypto';

export default (req, res) => {
  console.log("Received API request:", req.method);

  if (req.method === 'POST') {
    const { email, password } = req.body;

    console.log("Received login attempt:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query the database to check the user's credentials
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        console.log("User found:", row);
        return res.status(200).json({ message: 'Login successful', user: row });
      } else {
        console.log("No matching user found");
        return res.status(400).json({ error: 'Invalid email or password' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
