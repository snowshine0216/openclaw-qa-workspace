import { browser } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class LibraryPage {

    public open (subPath: string) {
        // TODO: make the URL configurable
        const url = `http://localhost:8080/MicroStrategyLibrary/${subPath}`;
        return browser.url(url);
    }
}