import sqlite3 from "sqlite3";
import path from "path";
import { createHash } from "crypto";

// ✅ Ensure the correct database path
const dbPath = path.join(process.cwd(), "Backend", "Database", "mydatabase.db");

// ✅ Function to hash passwords using SHA-256
const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

// ✅ Function to open database connection
const openDatabase = () => {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error("❌ Database connection error:", err);
    } else {
      console.log("✅ Connected to database:", dbPath);
    }
  });
};

// ✅ API Route Handler
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ Ensure request body is parsed properly
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { email, password } = req.body;
  console.log("📩 Received Data:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const db = openDatabase();

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        console.error("❌ Database query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      if (!user) {
        console.log("❌ User not found:", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      console.log("🔍 User found:", user);

      // ✅ Compare hashed passwords
      const hashedPassword = hashPassword(password);
      console.log("🔑 Stored Hash:", user.password);
      console.log("🔑 Input Hash:", hashedPassword);

      if (user.password !== hashedPassword) {
        console.log("❌ Password mismatch for user:", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      console.log("✅ Login successful for:", email);
      return res.status(200).json({ message: "Login successful", user });
    });

    db.close();
  } catch (err) {
    console.error("❌ Error in login process:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
