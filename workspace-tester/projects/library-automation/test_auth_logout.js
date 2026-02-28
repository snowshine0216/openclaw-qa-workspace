const { chromium } = require('@playwright/test');
require('dotenv').config({ path: 'tests/config/.env.report' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  const user = process.env.reportTestUser;
  const pass = process.env.reportTestPassword;
  const base = process.env.reportTestUrl;

  console.log('Logging in as', user);
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('#username').waitFor();
  await page.fill('#username', user);
  await page.fill('#password', pass);
  await page.click('#loginButton');
  
  await page.waitForURL(/app/i, { timeout: 30000 });
  console.log('Logged in! URL:', page.url());

  const logoutUrl = base.endsWith('/') ? `${base}logout` : `${base}/logout`;
  console.log('Navigating to logout URL:', logoutUrl);
  
  await page.goto(logoutUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('After logout URL:', page.url());
  const text = await page.content();
  if (text.includes('404')) {
    console.log('Found 404 on /logout AFTER AUTHENTICATION!');
  } else {
    console.log('No 404 found. credsLoginContainer:', !!text.match(/credsLoginContainer/));
  }
  
  // Try /auth/ui/logout
  console.log('Trying /auth/ui/logout...');
  const altLogoutUrl = base.endsWith('/') ? `${base}auth/ui/logout` : `${base}/auth/ui/logout`;
  await page.goto(altLogoutUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(()=>console.log('alt failed'));
  console.log('After alt URL:', page.url());
  
  await browser.close();
})();
