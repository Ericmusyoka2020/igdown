const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Instagram Downloader Backend Running");
});

app.get("/download", (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No Instagram URL provided" });

    // yt-dlp command to get direct video URL
    const cmd = `yt-dlp -f mp4 -g "${videoUrl}"`;

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error || !stdout) {
            console.log("Error:", stderr || error.message);
            return res.status(500).json({
                error: "Failed to fetch media. Post may be private or require login.",
                details: stderr || error.message
            });
        }

        // stdout contains the direct video URL
        const downloadUrl = stdout.trim();
        res.json({
            type: "video",
            url: downloadUrl
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
