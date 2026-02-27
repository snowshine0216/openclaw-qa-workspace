/* eslint-disable no-var */
/**
 * ==== define types ====
 */
type WDIOConfig = typeof import('./wdio.conf.ts');
type WDIOTeamsConfig = typeof import('./wdioteams.conf.ts');
type PageBuilder = typeof import('./pageObjects/pageBuilder.js').default;
type Browsers = {
    params: WDIOConfig['DEFAULT_PARAMS'] | WDIOTeamsConfig['DEFAULT_PARAMS'];
    pageObj1: ReturnType<PageBuilder>;
    pageObj2?: ReturnType<PageBuilder>;
};

/**
 * ==== add global variables ====
 */

declare var browsers: Browsers;

declare namespace NodeJS {
    interface Global {
        browsers: Browsers;
    }
}

/**
 * ==== enhance existing interface ====
 */

declare namespace WebdriverIO {
    type $return = ReturnType<WebdriverIO.Browser['$']>;
    type $$return = ReturnType<WebdriverIO.Browser['$$']>;
}
