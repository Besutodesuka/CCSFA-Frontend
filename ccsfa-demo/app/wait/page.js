// app/wait/page.js
"use client";

import { useRouter } from "next/navigation";

export default function Wait() {
  const router = useRouter();

  const simulateAuth = () => {
    router.push("/setting");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Waiting for Authentication...</h2>
      <p>Please wait while we verify your identity via LINE...</p>
      <button onClick={simulateAuth}>Simulate Authentication Success</button>
    </div>
  );
}
