const { chromium } = require('@playwright/test');
require('dotenv').config({ path: 'tests/config/.env.report' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  const user = process.env.reportTestUser;
  const pass = process.env.reportTestPassword || '';
  const base = process.env.reportTestUrl;

  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.credsLoginContainer', { timeout: 10000 });
  
  await page.fill('#username', user);
  if (pass && pass.toLowerCase() !== 'none') {
      await page.fill('#password', pass);
  } else {
      await page.click('#password');
  }
  await page.click('#loginButton');
  
  await page.waitForURL(/app/i, { timeout: 30000 });
  await page.waitForTimeout(30000);

  const fs = require('fs');
  fs.writeFileSync('/tmp/app_home.html', await page.content());
  await page.screenshot({ path: '/tmp/app_home.png' });
  console.log('Saved /tmp/app_home.html and .png');
  
  await browser.close();
})();
