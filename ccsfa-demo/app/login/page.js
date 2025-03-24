// app/login/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";  // Import crypto-js library

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password using SHA256 before sending it to the server
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    // Log to check the hashed password
    console.log("Hashed password:", hashedPassword);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("📩 API Response:", data);

    if (response.ok) {
      router.push("/wait"); // Redirect on success
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
