const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage({
    viewport: { width: 1000, height: 2000 }
  });

  const url = "https://unbelievaboat.com/leaderboard/1497745326843363398/widget";

  // Load the page and wait for network to settle
  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for the widget container to appear
  try {
    await page.waitForSelector(".leaderboard-container", { timeout: 15000 });
  } catch (e) {
    console.log("Widget did not load in time.");
  }

  // Take screenshot
  await page.screenshot({
    path: "leaderboard.png",
    fullPage: true
  });

  await browser.close();
})();
