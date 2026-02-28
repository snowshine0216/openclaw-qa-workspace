const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  
  const evalResult = await page.evaluate(() => {
    const creds = document.querySelector('.credsLoginContainer');
    const saml = document.querySelector('.icon-saml');
    const oidcLoader = document.querySelector('.mstr-oidc-loader');
    
    return {
      credsVisible: creds ? window.getComputedStyle(creds).display !== 'none' : false,
      credsRect: creds ? creds.getBoundingClientRect() : null,
      samlVisible: saml ? window.getComputedStyle(saml).display !== 'none' : false,
      oidcLoaderVisible: oidcLoader ? window.getComputedStyle(oidcLoader).display !== 'none' : false,
      bodyText: document.body.innerText.substring(0, 500)
    };
  });
  
  console.log(JSON.stringify(evalResult, null, 2));
  await browser.close();
})();
