// api/backup.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const allowedOrigin = "https://menuva-digital.github.io";

  // 1️⃣ Set CORS headers untuk semua response
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // 2️⃣ Preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 3️⃣ GET test route
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, note: "API is alive 🚀" });
  }

  // 4️⃣ POST -> push ke GitHub Gist via ENV token
  if (req.method === "POST") {
    try {
      const { url, data } = req.body;
      const token = process.env.GITHUB_TOKEN;

      if (!url || !data || !token) {
        return res.status(400).json({ ok: false, error: "Missing url, data, or ENV token not set" });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": "token " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          files: { "menuva.json": { content: JSON.stringify(data, null, 2) } },
          public: false
        })
      });

      const result = await response.json();
      if (!response.ok) return res.status(response.status).json({ ok: false, error: result.message || "GitHub error" });

      return res.status(200).json({ success: true, url: result.html_url });

    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
    }
  }

  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
}
