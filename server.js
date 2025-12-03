
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Use yt-dlp-exec to get the direct download link
    const info = await ytdlp(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true
    });

    // Send the first video URL found
    const videoLink = info?.url || info?.formats?.[0]?.url;

    if (!videoLink) {
      return res.status(500).json({ error: "Could not extract video URL" });
    }

    res.json({ videoUrl: videoLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error downloading video" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
