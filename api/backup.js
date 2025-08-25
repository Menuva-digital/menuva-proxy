// api/backup.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // 1️⃣ CORS headers untuk semua response
  const origin = req.headers.origin;
  // bisa spesifik ke domain admin.html
  const allowedOrigin = "https://menuva-digital.github.io";
  if (origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // 2️⃣ Preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end(); // 204 No Content lebih baik untuk OPTIONS
  }

  // 3️⃣ GET test route
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, route: "/api/backup", note: "API is alive 🚀" });
  }

  // 4️⃣ POST -> push ke Gist via ENV token
  if (req.method === "POST") {
    try {
      const { url, data } = req.body;
      const token = process.env.GITHUB_TOKEN;

      if (!url || !data || !token) {
        return res.status(400).json({ ok: false, error: "Missing url, data, or token not set in ENV" });
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

      if (!response.ok) {
        return res.status(response.status).json({ ok: false, error: result.message || "GitHub error" });
      }

      return res.status(200).json({ success: true, url: result.html_url });

    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
    }
  }

  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
};
