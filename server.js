const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ENV variables you must set in Railway
// DISCORD_WEBHOOK = your webhook URL
// DISCORD_MESSAGE_ID = the message ID to patch
// IMAGE_URL = https://mrrssa.github.io/live-leaderboard/leaderboard.png

const WEBHOOK = process.env.DISCORD_WEBHOOK;
const MESSAGE_ID = process.env.DISCORD_MESSAGE_ID;
const IMAGE_URL = process.env.IMAGE_URL;

// How old the image can be before Railway updates it (in ms)
const MAX_AGE = 15 * 60 * 1000; // 15 minutes

async function getImageAge() {
    try {
        const res = await fetch(IMAGE_URL, { method: "HEAD" });
        const lastModified = res.headers.get("last-modified");

        if (!lastModified) return Infinity;

        const modifiedTime = new Date(lastModified).getTime();
        const now = Date.now();

        return now - modifiedTime;
    } catch (err) {
        console.error("Error checking image age:", err);
        return Infinity;
    }
}

async function updateDiscord() {
    const age = await getImageAge();

    if (age < MAX_AGE) {
        console.log("Image is fresh. No update needed.");
        return;
    }

    console.log("Image is stale. Sending backup PATCH…");

    const timestamp = Date.now();

    const payload = {
        content: "**Live Leaderboard (Backup Update)**",
        embeds: [
            {
                title: "Leaderboard",
                image: { url: `${IMAGE_URL}?ts=${timestamp}` }
            }
        ]
    };

    await fetch(`${WEBHOOK}/messages/${MESSAGE_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    console.log("Backup update sent.");
}

// Run every 10 minutes
setInterval(updateDiscord, 10 * 60 * 1000);

// Start server (Railway needs this)
app.get("/", (req, res) => res.send("Backup leaderboard updater running."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
