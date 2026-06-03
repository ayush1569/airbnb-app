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
  console.error("Chrome executable not found.");
  process.exit(1);
}

const pagesToTest = [
  { name: "Homepage", url: "https://airbnb-app-frontend-gilt.vercel.app/" },
  { name: "Login Page", url: "https://airbnb-app-frontend-gilt.vercel.app/login" },
  { name: "SignUp Page", url: "https://airbnb-app-frontend-gilt.vercel.app/signup" }
];

async function runTests() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true
  });

  console.log("=========================================");
  console.log("STARTING AUTOMATED WEBSITE AUDIT...");
  console.log("=========================================\n");

  for (const testPage of pagesToTest) {
    console.log(`--- Auditing: ${testPage.name} (${testPage.url}) ---`);
    const page = await browser.newPage();
    
    const errors = [];
    const consoleLogs = [];

    page.on('console', msg => {
      consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
      errors.push(`[PAGE ERROR]: ${err.message}`);
    });

    try {
      await page.goto(testPage.url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000)); // wait for transitions
      
      console.log("Page loaded. Current URL:", page.url());
      
      // Page specific assertions
      if (testPage.name === "Homepage") {
        const cardsCount = await page.evaluate(() => {
          const divs = Array.from(document.querySelectorAll('span'));
          return divs.filter(d => d.textContent.includes('IN ') || d.textContent.includes('In ')).length;
        });
        console.log(`Verified content: Found ${cardsCount} listing cards rendered on the homepage.`);
      } else if (testPage.name === "Login Page") {
        const hasForm = await page.evaluate(() => {
          return !!document.getElementById('email') && !!document.getElementById('password');
        });
        const pageHTML = await page.evaluate(() => document.body.innerHTML);
        console.log(`Verified content: Email & Password inputs exist: ${hasForm}`);
        console.log("Body HTML snippet:", pageHTML.slice(0, 300));
        if (!hasForm) {
          errors.push("[FORM ERROR]: Login inputs are missing.");
        }
      } else if (testPage.name === "SignUp Page") {
        const hasForm = await page.evaluate(() => {
          return !!document.getElementById('name') && !!document.getElementById('email') && !!document.getElementById('password');
        });
        const pageHTML = await page.evaluate(() => document.body.innerHTML);
        console.log(`Verified content: Name, Email & Password inputs exist: ${hasForm}`);
        console.log("Body HTML snippet:", pageHTML.slice(0, 300));
        if (!hasForm) {
          errors.push("[FORM ERROR]: SignUp inputs are missing.");
        }
      }

    } catch (err) {
      errors.push(`[CRITICAL FAILED]: ${err.message}`);
    }

    if (errors.length > 0) {
      console.log(`❌ Audit Failed with ${errors.length} issue(s):`);
      errors.forEach(e => console.log("   " + e));
    } else {
      console.log("✅ Audit Passed! 0 issues detected.");
    }
    console.log("");
    await page.close();
  }

  await browser.close();
  console.log("=========================================");
  console.log("AUDIT COMPLETE!");
  console.log("=========================================");
}

runTests().catch(err => {
  console.error("Audit runner failed:", err);
  process.exit(1);
});
