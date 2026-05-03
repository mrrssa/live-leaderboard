const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage({
    viewport: { width: 2000, height: 3000 }
  });

  const url = "https://unbelievaboat.com/leaderboard/1497745326843363398/widget";

  // Load page without waiting for network idle
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for the widget to appear
  await page.waitForSelector("body", { timeout: 60000 });

  // Allow JS to finish rendering
  await page.waitForTimeout(5000);

  // Save screenshot
  await page.screenshot({
    path: "leaderboard.png",
    fullPage: true
  });

  await browser.close();
})();
