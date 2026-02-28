const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  // 1. Emulate what authenticatedPage does
  await page.goto('https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');

  console.log('Initial URL:', page.url());

  // 2. Emulate what libraryPage.logout() does
  const base = 'https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary';
  const logoutUrl = base.endsWith('/') ? `${base}logout` : `${base}/logout`;
  console.log('Navigating to logout URL:', logoutUrl);
  
  await page.goto(logoutUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e => console.error('Logout error:', e));
  await page.waitForTimeout(1000);
  
  console.log('URL after logout:', page.url());
  const text = await page.content();
  if (text.includes('404')) {
    console.log('Found 404!');
  } else {
    console.log('No 404 found. credsLoginContainer:', !!text.match(/credsLoginContainer/));
  }
  
  await browser.close();
})();
