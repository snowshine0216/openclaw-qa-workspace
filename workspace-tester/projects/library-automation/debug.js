const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  try {
    console.log('Navigating...');
    await page.goto('https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Navigated successfully.');
  } catch (e) {
    console.error('Navigation error:', e);
  }

  const content = await page.content();
  fs.writeFileSync('login_debug.html', content);
  
  await page.screenshot({ path: 'login_debug.png' });
  console.log('Saved login_debug.html and login_debug.png');
  
  await browser.close();
})();
