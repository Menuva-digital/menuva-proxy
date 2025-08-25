// api/backup.js
// Serverless function Vercel (CommonJS style)
module.exports = (req, res) => {
  // CORS - biarkan sementara "*", nanti ganti ke domain spesifik jika mau lebih aman
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // preflight ok
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/backup",
      note: "API is alive 🚀"
    });
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      // Untuk tahap awal kita hanya echo kembali data (dummy). 
      // Nantinya di sini kita integrasikan penyimpanan ke Firestore/S3/R2/Gist dsb.
      return res.status(200).json({
        ok: true,
        received: body,
        message: "Data diterima (dummy, belum disimpan ke storage)"
      });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err?.message || "Bad Request" });
    }
  }

  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
};
