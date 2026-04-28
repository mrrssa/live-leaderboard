const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://unbelievaboat.com/leaderboard/1497745326843363398/widget", {
    waitUntil: "networkidle"
  });

  await page.setViewportSize({ width: 450, height: 500 });

  await page.screenshot({
    path: "leaderboard.png"
  });

  await browser.close();
}

run();
