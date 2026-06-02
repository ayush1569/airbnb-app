import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = '';
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error("Chrome executable not found on standard Windows paths.");
  process.exit(1);
}

console.log("Using Chrome path:", executablePath);

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]:`, err.message);
  });

  page.on('requestfailed', req => {
    console.error(`[REQUEST FAILED]: ${req.url()} - ${req.failure().errorText}`);
  });

  console.log("Navigating to frontend Vercel deployment...");
  try {
    await page.goto('https://airbnb-app-frontend-gilt.vercel.app', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (err) {
    console.log("Navigation complete or timed out:", err.message);
  }

  // wait a bit for any deferred script execution
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
}

run().catch(err => {
  console.error("Runner failed:", err);
  process.exit(1);
});
