const express = require('express');
const puppeteer = require('puppeteer');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Discord Client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const DISCORD_CHANNEL_ID = 'your-channel-id'; // Replace with your channel ID

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN); // Add your Discord bot token in .env file

// Function to take a screenshot and update Discord
async function takeScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://your-website.com'); // Replace with your target website
    const screenshot = await page.screenshot();
    await browser.close();

    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    channel.send({ files: [{ attachment: screenshot, name: 'screenshot.png' }] });
}

// Take a screenshot every 30 seconds
setInterval(takeScreenshot, 30000);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
