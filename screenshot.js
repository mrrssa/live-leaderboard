const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage({
    viewport: { width: 1000, height: 2000 }
  });

  const url = "https://unbelievaboat.com/leaderboard/1497745326843363398/widget";

  // Load the page without waiting for network idle
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for ANY leaderboard element to appear
  await page.waitForSelector("body", { timeout: 60000 });

  // Extra wait to allow JS to render the widget
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: "leaderboard.png",
    fullPage: true
  });

  await browser.close();
})();
