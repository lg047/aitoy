// server.js
import express from "express";
import fetch from "node-fetch"; // Node18+: global fetch works; keep for compat
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/session", async (req, res) => {
  try {
    // Create ephemeral session for browser
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2025-06-03",
        voice: "shimmer", // try: alloy, ash, ballad, coral, echo, sage, verse
        instructions: `You are "Mallow", a gentle, modern plush friend.
- Keep replies short (3–10 seconds).
- Warm, comforting tone; subtle humour; avoid “as an AI”.
- If asked for disallowed topics, gracefully distract with breathing tips or a soft story prompt.`,
        // If you only want text back (no audio), set: modalities: ["text"]
        // modalities: ["audio","text"],
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: text });
    }
    const data = await r.json();
    // Returns { client_secret: { value: "ephemeral_api_key" }, ... }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.use(express.static("public")); // serve index.html

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
