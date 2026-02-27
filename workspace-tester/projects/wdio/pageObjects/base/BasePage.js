import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { getElementXpath } from '../../utils/getElementXPath.js';
import { errorLog } from '../../config/consoleFormat.js';
import { formateDateMultiLanguage, calendarStartWeekDay } from '../../utils/DateUtil.js';
import { scrollElement, scrollElementToTop, scrollElementToBottom } from '../../utils/scroll.js';
import Common from '../authoring/Common.js';

import { Key } from 'webdriverio';
import { findOne, findAll } from '../../utils/patched-selector.js';
import os from 'os';
import allureReporter from '@wdio/allure-reporter';
import { observeElements } from '../../utils/observeElements.js';
import { observeRequests } from '../../utils/observeRequests.js';
import { observeEvent } from '../../utils/observeEvent.js';
import { waitForFileToExist } from '../../config/folderManagement.js';

export default class BasePage {
    constructor() {
        this.common = new Common();
    }

    /** The waiting time for JavaScript to respond to user interaction */
    get DEFAULT_TIMEOUT() {
        /**
         * https://web.dev/rail/
         * Complete a transition initiated by user input within 100 ms,
         * So users feel like the interactions are instantaneous.
         */
        return 100 * 3;
    }

    /** The time to wait for page loading */
    get DEFAULT_LOADING_TIMEOUT() {
        /**
         * https://web.dev/rail/
         * Load interactive content in under 60000 ms.
         */
        if (browsers.params.timeout && browsers.params.timeout.defaultLoadingTimeOut) {
            return browsers.params.timeout.defaultLoadingTimeOut;
        } else {
            return 60 * 1000;
        }
    }

    /** The time to wait for response to the network request */
    get DEFAULT_API_TIMEOUT() {
        if (browsers.params.timeout && browsers.params.timeout.defaultAPITimeout) {
            return browsers.params.timeout.defaultAPITimeout;
        } else {
            return 1 * 1000;
        }
    }

    get DEFAULT_DOMNodePresent_Timeout5() {
        return 5 * 1000;
    }

    get DEFAULT_DOMNodePresent_Timeout10() {
        return 10 * 1000;
    }
    get DEFAULT_DOMNodeRender_Timeout3() {
        return 3;
    }

    get $() {
        return findOne;
    }

    get $$() {
        return findAll;
    }

    get element() {
        return $;
    }

    get EC() {
        return browser.waitUntil;
    }

    _normalizeMessage(message, defaultMessage) {
        if (typeof message === 'string') {
            return message;
        }
        return defaultMessage;
    }

    _normalizeTimeout(timeout) {
        if (typeof timeout === 'number') {
            return timeout * 1000 * 60;
        }
        return this.DEFAULT_WAIT_TIMEOUT * 1000 * 60;
    }

    getMstrRoot() {
        return this.$('#mstrd-Root');
    }

    getBackButton() {
        return this.$('.mstr-nav-icon.icon-backarrow_rsd');
    }

    getTooltipContainer() {
        // return this.$('.tooltip-inner');
        return this.$('[class*=tooltip-inner]');
    }

    getMojoTooltip() {
        return this.$('.mstrmojo-Tooltip-content');
    }

    getPageLoading() {
        return $('.mstrd-LoadingIcon-content--visible');
    }

    getPageIndicator() {
        return $('.mstrd-DossierPageIndicator');
    }

    getLoadingIcon() {
        return $('.mstrd-LoadingIcon-loader');
    }

    getDocView() {
        return this.$('.mstrmojo-DocLayoutViewer-layout');
    }

    getTooltip() {
        return this.$('.ant-tooltip-inner');
    }

    getTooltipText() {
        return this.$('.ant-tooltip-inner').getText();
    }

    getErrorMessage() {
        return this.$('#mstrWeb_error .mstrAlertMessage');
    }

    getAntDropdown() {
        return this.$('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    }

    async getCurrentPageByKey() {
        const url = await browser.getUrl();
        const urlParts = url.split('/');
        const key = urlParts[urlParts.length - 1];
        return this.$(`.mstrd-Page[data-k="${key}"]`);
    }

    async getDocLayout() {
        const el = await this.getCurrentPageByKey();
        return el.$('.mstrmojo-DocLayout');
    }

    getMojoWait() {
        return this.$('.mojo-overlay-wait');
    }

    getMojoLoadingIndicator() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor') and contains(@class, 'mstrWaitBox') and contains(@style, 'display: block')]`)
    }

    getLoadingLabel() {
        return this.$('.mstrd-Loadable-icon');
    }

    escapeRegExp(string) {
        return string
            .replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
            .replace(/\s/g, '\\s');
    }

    getCSSContainingText(elem, text) {
        const xpathString = `//*[contains(@class,'${elem}')]/..//*[contains(text(),'${text}')]//ancestor::*[contains(@class,'${elem}')]`;
        return xpathString;
    }

    getTooltipbyMessage(tootip) {
        return this.$$('.ant-tooltip-inner').filter(async (elem) => {
            let toolTipString = await elem.getText();
            if (toolTipString === '') {
                toolTipString = await this.getInnerText(elem);
            }
            return toolTipString.includes(tootip);
        })[0];
    }

    getToastbyMessage(toast) {
        return this.$$('.mstr-ai-chatbot-Toast-title').filter(async (elem) => {
            const toastString = await elem.getText();
            return toastString === toast;
        })[0];
    }

    getChatbotToolTip() {
        return this.$('//span[@role="tooltip"]');
    }

    getErrorDialogue() {
        return this.$('.mstrd-MessageBox');
    }

    getErrorDialogMainContainer() {
        return this.getErrorDialogue().$('.mstrd-MessageBox-main');
    }

    getShowDetailsButton() {
        return this.getErrorDialogue().$('.mstrd-MessageBox-detailsBtn>span');
    }

    getMojoErrorDialogue() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getProgressBar() {
        return this.$('.mstrd-progressBar');
    }

    getWaitingPage() {
        return $('.mstrWait');
    }

    getMojoErrorConfirmButton(text = 'Yes') {
        // eslint-disable-next-line prettier/prettier
        return this.getMojoErrorDialogue()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const buttonText = await elem.getText();
                return buttonText.includes(text);
            })[0];
    }

    async safeGetElement(target, desc, waitTime = this.DEFAULT_LOADING_TIMEOUT) {
        await this.waitForElementVisible(target);
        return target;
    }

    getParent(elem) {
        return elem.parentElement();
    }

    trimStringForSafari(originalText) {
        //getText() method on safari may return text with line seperator, trim it here
        if (typeof originalText === 'string' && this.isSafari()) {
            return originalText.trim();
        } else {
            return originalText;
        }
    }

    getErrorButton(buttonName) {
        return this.getErrorDialogue()
            .$('.mstrd-MessageBox-actionBar')
            .$$('.mstrd-ActionLinkContainer')
            .filter(async (elem) => {
                const buttonText = this.trimStringForSafari(await elem.getText());
                return buttonName === buttonText;
            })[0];
    }

    getErrorPageText() {
        return $('body>h1').getText();
    }

    getErrorDetailsButton() {
        return this.getErrorDialogue().$('.mstrd-MessageBox-detailsBtn');
    }

    async viewErrorDetails() {
        await this.getErrorDetailsButton().click();
    }

    async errorMessage() {
        return this.getErrorMessage().getText();
    }

    // Browser Utils

    async executeScript(...args) {
        return browser.execute(...args);
    }

    async sleep(duration) {
        return browser.pause(duration);
    }

    async wait(...condition) {
        // add try catch to enhance the error call stack.
        try {
            return await browser.wait(...condition);
        } catch (err) {
            const error = new Error(err.message, { cause: err });
            throw error;
        }
    }

    async resizeWindow(width, height) {
        await browser.setWindowSize(width, height);
        return this.sleep(2000);
    }

    async getBrowserTabs() {
        return browser.getWindowHandles();
    }

    async switchToWindow(tabInstance) {
        await browser.switchToWindow(tabInstance);
        return this.sleep(2000);
    }

    async currentURL() {
        return browser.getUrl();
    }

    async closeCurrentTab() {
        return browser.closeWindow();
    }

    async switchToTab(tabIndex) {
        await this.sleep(2000);
        const handles = await this.getBrowserTabs();
        await this.switchToWindow(handles[tabIndex]);
        return tabIndex;
    }

    async switchToNewWindowWithUrl(url) {
        await this.executeScript('window.open()');
        await this.switchToNewWindow();
        await browser.url(url);
        await this.waitForPageLoadByUrl(url.split('bookmarks')[0]);
    }

    async switchToNewWindow() {
        await this.sleep(2000); // wait new page, maybe need modified
        const handles = await this.getBrowserTabs();
        await this.switchToWindow(handles[handles.length - 1]);
    }

    async closeTab(index) {
        await this.sleep(2000); // wait new page
        const handles = await this.getBrowserTabs();
        if (handles.length > 1) {
            await this.switchToWindow(handles[index]);
            await this.closeCurrentTab();
            // if the closed index is 0, we need to switch to index 1
            const newIndex = index > 0 ? index - 1 : 1;
            await this.switchToWindow(handles[newIndex]);
        } else {
            throw new Error('Please make sure there are at least two browser widnows');
        }
    }

    async closeAllTabs() {
        const handles = await this.getBrowserTabs();
        if (handles.length === 1) {
            return;
        }
        for (let i = 1; i < handles.length; i++) {
            await this.switchToWindow(handles[i]);
            await this.closeCurrentTab();
            const newIndex = i > 0 ? i - 1 : 1;
            await this.switchToWindow(handles[newIndex]);
        }
    }

    // leaves initial window handle opened
    async closeAllSecondaryTabs() {
        let handles = await this.getBrowserTabs();
        if (handles.length === 1) {
            await this.switchToWindow(handles[0]);
            return;
        }

        await this.switchToWindow(handles[1]);
        await this.closeCurrentTab();
        await this.closeAllSecondaryTabs(); // recursion
    }

    async tabCount() {
        const handles = await this.getBrowserTabs();
        return handles.length;
    }

    async waitDocumentToBeLoaded(checkDocumentLoaded = true) {
        if (checkDocumentLoaded) {
            if (!this.isWeb()) {
                await this.waitForElementVisible(await this.getDocLayout());
            }
            await this.waitForCurtainDisappear();
            await this.waitForElementStaleness(this.getMojoWait());
        }
    }

    async isWaitingPageDisplayed() {
        return (await this.getWaitingPage()).isDisplayed();
    }

    async waitPageLoading() {
        await this.waitForElementInvisible($('#pageLoadingWaitBox'), 'waitPageLoading');
        if (this.isWaitingPageDisplayed()) {
            await this.waitForElementInvisible(this.getWaitingPage());
        }
        await this.waitForCurtainDisappear();
    }

    // Accessibility

    async activeElement() {
        const elem = await browser.getActiveElement();
        return this.$(elem);
    }

    async activeElementText() {
        const elem = await this.activeElement();
        return elem.getText();
    }

    async hideElement(el) {
        await this.executeScript("arguments[0].setAttribute('style', 'visibility:hidden')", await el);
    }

    async fakeElementText(el, text = 'fakeText') {
        await this.executeScript(`arguments[0].innerText = '${text}'`, await el);
    }
    async getTitle(el) {
        return this.executeScript('return arguments[0].title', await el);
    }

    async getInputValue(el) {
        return this.executeScript('return arguments[0].value', await el);
    }

    async getInnerText(el) {
        return this.executeScript('return arguments[0].innerText', await el);
    }

    async waitDataLoaded() {
        const el = this.$('.fullscreen-mask,.mstrmojo-Xtab-overlay.wait');
        await this.waitForElementStaleness(el);
    }

    async waitPageRefresh() {
        try {
            await this.waitForElementVisible(this.getPageLoading());
        } catch (err) {
            // ignore
            console.log('wait page refreshed error:', err);
        }
        await this.waitForElementInvisible(this.getPageLoading());
    }

    async showElement(el) {
        await this.executeScript("arguments[0].setAttribute('style', 'visibility:visible')", await el);
    }

    async getLabelValue(el) {
        return this.executeScript('return arguments[0].ariaLabel', await el);
    }

    async getHeightValue(el) {
        return this.executeScript('return arguments[0].clientHeight', await el);
    }

    async getFontFamily(el) {
        const cssProperty = await el.getCSSProperty('font-family');
        return cssProperty.value;
    }

    async getCSSProperty(el, property) {
        const cssProperty = await el.getCSSProperty(property);
        return cssProperty.value;
    }

    async dismissError() {
        await this.waitForElementVisible(this.getErrorButton('OK'), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'The OK button did not exist',
        });
        await this.getErrorButton('OK').click();
        return this.sleep(1000); // Wait for redirection
    }

    async dismissErrorByText(text) {
        await this.waitForElementVisible(this.getErrorButton(text), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'The OK button did not exist',
        });
        await this.getErrorButton(text).click();
        return this.sleep(1000); // Wait for redirection
    }

    async waitForMojoError() {
        return this.waitForElementVisible(this.getMojoErrorDialogue(), { timeout: this.DEFAULT_TIMEOUT * 100 });
    }

    async waitForError() {
        return this.waitForElementVisible(this.getErrorDialogue(), { timeout: this.DEFAULT_TIMEOUT * 100 });
    }

    async dismissMojoError() {
        return this.getMojoErrorConfirmButton().click();
    }

    async clickMojoErrorButton(text) {
        return this.getMojoErrorConfirmButton(text).click();
    }

    async clickErrorActionButton(buttonName) {
        await this.click({ elem: this.getErrorButton(buttonName) });
        return this.sleep(1000);
    }

    async clickErrorActionButtonNoWait(buttonName) {
        await this.getErrorButton(buttonName).click();
        return this.sleep(1000);
    }

    async getI18NFormattedDate(day, month, year) {
        return formateDateMultiLanguage(day, month, year);
    }

    async setTextToClipboard(text) {
        await this.executeScript(
            `
            var textarea = document.createElement('textarea');
            textarea.setAttribute('id', 'customInputForCopy');
            document.body.appendChild(textarea);
            textarea.textContent = arguments[0];
            textarea.focus();
            textarea.select();
            `,
            text
        );
        await this.ctrlA();
        await this.copy();
        await this.executeScript(function () {
            const el = document.getElementById('customInputForCopy');
            document.getElementsByTagName('body')[0].removeChild(el);
        });
    }

    async getI18NCalendarStartWeekDay() {
        return calendarStartWeekDay();
    }

    async openCustomAppById({ id, dossier = false, check_flag = true }) {
        const url = browser.options.baseUrl.endsWith('/')
            ? new URL('app/config/' + id, browser.options.baseUrl)
            : new URL('app/config/' + id, browser.options.baseUrl + '/');
        console.log('openCustomAppById:', url.toString());
        await browser.url(url.toString(), this.DEFAULT_TIMEOUT);
        if (dossier == false) {
            await this.waitForLibraryLoading();
            await this.waitForItemLoading();
        }
        // add more to check whether the app is opened successfully
        // check whether the app id is in the url
        // will check whe check_flag is true
        if (check_flag) {
            const currentUrl = await this.currentURL();
            if (!currentUrl.includes(id)) {
                throw new Error(`Failed to open app with id ${id}`);
            }
        }
    }

    async openDefaultApp() {
        const url = new URL('app', browser.options.baseUrl);
        await browser.url(url.toString(), this.DEFAULT_TIMEOUT);
        await this.waitForLibraryLoading();
        allureReporter.addStep(`openDefaultApp`);
    }

    async previousPage() {
        await this.waitForElementVisible(this.getBackButton()), { msg: 'The back button is not clickable' };
        await this.getBackButton().click();
        return this.sleep(2000);
    }

    // Keyboard inputs

    async input(keyword) {
        return browser.keys(keyword);
    }

    async enter() {
        return browser.keys(Key.Enter);
    }

    async arrow(direction) {
        if (direction === 'ArrowUp') {
            return browser.keys(Key.ArrowUp);
        }
        if (direction === 'ArrowDown') {
            return browser.keys(Key.ArrowDown);
        }
        if (direction === 'ArrowLeft') {
            return browser.keys(Key.ArrowLeft);
        }
        if (direction === 'ArrowRight') {
            return browser.keys(Key.ArrowRight);
        }
    }

    async delete() {
        return browser.keys(Key.Backspace);
    }

    async ctrlA() {
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'a']);
    }

    async ctrlF() {
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'f']);
    }

    async copy() {
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'c']);
    }

    async paste() {
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'v']);
    }

    async esc() {
        return browser.keys(Key.Escape);
    }

    async space() {
        return browser.keys(Key.Space);
    }

    async tab(repeatTimes = 0) {
        await browser.keys(Key.Tab);
        await this.waitForDynamicElementLoading();
        for (let i = 0; i < repeatTimes; i++) {
            await browser.keys(Key.Tab);
            await this.waitForDynamicElementLoading();
            await this.sleep(500);
        }
        return this.sleep(500);
    }

    async f6(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await browser.keys(Key.F6);
        }
    }

    async home() {
        return browser.keys(Key.Home);
    }

    async end() {
        return browser.keys(Key.End);
    }

    async ctrlHome() {
        await browser.keys([Key.Control, Key.Home]);
        await this.waitForDynamicElementLoading();
        return this.sleep(100);
    }

    async ctrlEnd() {
        await browser.keys([Key.Control, Key.End]);
        await this.waitForDynamicElementLoading();
        return this.sleep(100);
    }

    async shiftTab(repeatTimes = 0) {
        await browser.keys([Key.Shift, Key.Tab]);
        await this.waitForDynamicElementLoading();
        for (let i = 0; i < repeatTimes; i++) {
            await browser.keys([Key.Shift, Key.Tab]);
            await this.waitForDynamicElementLoading();
            await this.sleep(500);
        }
        return this.sleep(500);
    }

    async shiftEnter() {
        await browser.keys([Key.Shift, Key.Enter]);
        await this.waitForDynamicElementLoading();
        return this.sleep(100);
    }

    async navigateUpWithArrow(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await this.arrowUp();
        }
    }

    async navigateUpUsingShiftArrow(loopCount) {
        for (let i = 0; i < loopCount; i++) {
            await browser.keys([Key.Shift, Key.ArrowUp]);
        }
    }

    async navigateDownWithArrow(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await this.arrowDown();
        }
    }

    async navigateDownUsingShiftArrow(loopCount) {
        for (let i = 0; i < loopCount; i++) {
            await browser.keys([Key.Shift, Key.ArrowDown]);
        }
    }

    async navigateRightWithArrow(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await this.arrowRight();
        }
    }

    async navigateLeftWithArrow(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await this.arrowLeft();
        }
    }
    async tabForward(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await this.tab();
        }
    }

    async tabBackward(loopCount = 1) {
        for (let i = 0; i < loopCount; i++) {
            await browser.keys([Key.Shift, Key.Tab]);
        }
    }

    async tabToElement(elem, options = {}) {
        const backwards = (loopCount) => this.tabBackward(loopCount);
        const forwards = (loopCount) => this.tab(loopCount);

        const maxTabs = options.maxTabs || 30;
        let tabDirection = options.direction === 'backward' ? backwards : forwards;

        const expected = await this.executeScript(getElementXpath, await elem);

        for (let pressCount = 0; pressCount < maxTabs; pressCount++) {
            const activeElement = await this.activeElement();
            const active = await this.executeScript(getElementXpath, activeElement);

            if (active === expected) {
                return true;
            }
            await tabDirection();
        }

        if (options.direction === 'both') {
            tabDirection = tabDirection === forwards ? backwards : forwards;
            await tabDirection(options.maxTabs);

            for (let pressCount = 0; pressCount < maxTabs; pressCount++) {
                const activeElement = await this.activeElement();
                const active = await this.executeScript(getElementXpath, activeElement);

                if (active === expected) {
                    return true;
                }
                await tabDirection();
            }
        }
        const elementClasses = await getAttributeValue(elem, 'className');
        throw new Error(`Unable to find provided element: ${elementClasses} through tabbing`);
    }

    // Use the WDIO built in method to check if element has focus
    async isFocused(elem) {
        return elem.isFocused();
    }

    async isFocusedElement(elem) {
        const activeElement = await this.activeElement();
        const activeElemPath = await this.executeScript(getElementXpath, activeElement);
        // const elemToCheck = await elem.getWebElement();
        const elemToCheck = await elem;
        const elemToCheckPath = await this.executeScript(getElementXpath, elemToCheck);
        return activeElemPath === elemToCheckPath;
    }

    async arrowUp() {
        return browser.keys(Key.ArrowUp);
    }

    async arrowDown() {
        return browser.keys(Key.ArrowDown);
    }

    async arrowLeft() {
        return browser.keys(Key.ArrowLeft);
    }

    async arrowRight() {
        return browser.keys(Key.ArrowRight);
    }

    async clickAndNoWait({ elem, offset = { x: 0, y: 0 } }, checkClickable = true) {
        await this.waitForElementVisible(elem);
        if (checkClickable) {
            await this.waitForElementClickable(elem);
        }
        await this.waitForElementEnabled(elem);
        await elem.click(offset);
    }

    async performClickAction({ type = 'pointer', button = 0, x = 0, y = 0 }) {
        await browser.performActions([
            {
                type,
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 0, x, y },
                    { type: 'pointerDown', button },
                    { type: 'pause', duration: 200 },
                    { type: 'pointerUp', button },
                ],
            },
        ]);
    }

    async clickByXYPosition({ elem, x = 0, y = 0, checkClickable = true }) {
        await this.waitForElementVisible(elem);
        if (checkClickable) {
            await this.waitForElementClickable(elem);
        }
        await this.waitForElementEnabled(elem);
        const location = await this.getElementPositionOfScreen(elem, { x, y });
        await this.performClickAction({ x: location.x, y: location.y });
    }

    async clickByXYPositionNoWait({ elem, x, y }) {
        const v = await this.executeScript('return arguments[0].getBoundingClientRect()', await elem);
        const v1 = await this.executeScript('return arguments[0].clientWidth', await elem);
        const v2 = await this.executeScript('return arguments[0].clientHeight', await elem);
        const newx = parseInt(v.x + v1 + x);
        const newy = parseInt(v.y + y);
        await this.performClickAction({ x: newx, y: newy });
    }

    async clickWithOffset({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        await this.waitForElementEnabled(elem);
        if (offset.x !== 0 || offset.y !== 0) {
            await this.moveToElement(elem, offset);
            await browser.action('pointer').down({ button: 0 }).pause(50).up({ button: 0 }).perform();
        } else {
            await elem.click();
        }
        return this.waitForCurtainDisappear();
    }

    async click({ elem, offset = { x: 0, y: 0 }, checkClickable = true }) {
        await this.clickAndNoWait({ elem, offset }, checkClickable);
        return this.waitForCurtainDisappear();
    }

    async clickOnElement(elem) {
        await elem.click();
        return this.waitForCurtainDisappear();
    }

    async clickByForce({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementEnabled(elem);
        await elem.click({ button: 0, x: offset.x, y: offset.y });
    }

    async clickByPresence({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementPresence(elem);
        await elem.click({ elem: 0, x: offset.x, y: offset.y });
    }

    async clickForSafari(elem) {
        const hasClickMethod = !this.isSafari() || (await this.elemSupportsClickMethodOnSafari(elem));
        if (hasClickMethod) {
            try {
                await elem.click();
                return;
            } catch (err) {
                if (!this.isSafari()) {
                    throw err;
                }
                // for safari, we catch the error, the error may be caused by element not support click method,
                //  try js to click
                const elementClass = await elem.getAttribute('class');
                const elementTag = await elem.getTagName();
                console.warn(
                    '###clickForSafari, click element tag <' +
                        elementTag +
                        '> with class[' +
                        elementClass +
                        '] error, call js instead'
                );
            }
        }
        const elemString = 'var elem = arguments[0];';
        const clickScript = elemString + 'elem.click();';
        //console.log('###clickForSafari, script: ' + clickScript);
        await this.executeScript(clickScript, elem);
        await this.sleep(2000);
    }

    async doubleClick({ elem, offset = { x: 0, y: 0 } }) {
        const target = await elem;
        await target.doubleClick();
    }

    async doubleClickOnElement(elem) {
        await this.doubleClick({ elem: elem });
    }

    async ctrlClick({ elem, offset = { x: 0, y: 0 }, checkClickable = true }) {
        await this.waitForElementVisible(elem);
        if (checkClickable) {
            await this.waitForElementClickable(elem);
        }
        await this.moveToElement(elem, offset);
        const location = await this.getElementPositionOfScreen(elem, offset);
        await browser.actions([
            browser
                .action('key')
                .down(os.platform() === 'darwin' ? Key.Command : Key.Ctrl)
                .pause(1000),
            browser.action('pointer').move(location).down({ button: 0 }).pause(50).up({ button: 0 }),
            browser
                .action('key')
                .up(os.platform() === 'darwin' ? Key.Command : Key.Ctrl)
                .pause(1000),
        ]);
    }

    /**
     * Move and click the mouse by the given offset from the given element
     * @param {WebElement} elements as the reference to move away from
     * @param {int} x offset in pixels (horizontially)
     * @param {int} y offset in pixels (vertically)
     */
    async moveAndClickByOffsetFromMultiElements({ elements, offset = { x: 0, y: 0 } }) {
        const commandKey = os.platform() === 'darwin' ? '\uE03D' : '\uE009';

        if (elements.length > 0) {
            await elements[0].click();
        }

        for (let i = 1; i < elements.length; i++) {
            await browser.performActions([
                {
                    type: 'key',
                    id: 'keyboard1',
                    actions: [{ type: 'keyDown', value: commandKey }],
                },
            ]);

            await elements[i].click();
        }

        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard1',
                actions: [{ type: 'keyUp', value: commandKey }],
            },
        ]);
    }

    async clear({ elem }, isPrompted = false) {
        if (isPrompted) {
            await elem.click();
        } else {
            await this.click({ elem: elem });
        }
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'a']);
        await browser.pause(200);
        await browser.keys([Key.Delete]); 

        
    }

    async rightClick({ elem, offset = { x: 0, y: 0 }, checkClickable = true }) {
        await this.waitForElementVisible(elem);
        if (checkClickable) {
            await this.waitForElementClickable(elem);
        }
        await this.waitForElementEnabled(elem);
        if (offset.x !== 0 || offset.y !== 0) {
            await this.rightClickWithOffset({ elem: elem, offset: offset });
        } else {
            await elem.click({ button: 2, x: offset.x, y: offset.y });
        }
    }

    async rightClickByXYPosition({ elem, x = 0, y = 0, checkClickable = true }) {
        await this.waitForElementVisible(elem);
        if (checkClickable) {
            await this.waitForElementClickable(elem);
        }
        await this.waitForElementEnabled(elem);
        const location = await this.getElementPositionOfScreen(elem, { x, y });
        await this.performClickAction({ button: 2, x: location.x, y: location.y });
    }

    async rightClickWithOffset({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        let location = await this.getElementPositionOfScreen(elem, offset);
        let xCoords = location.x;
        let yCoords = location.y;

        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointer1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    {
                        type: 'pointerMove',
                        duration: 0,
                        x: xCoords,
                        y: yCoords,
                    },
                    { type: 'pointerDown', button: 2 },
                    { type: 'pointerUp', button: 2 },
                ],
            },
        ]);
    }

    async rightMouseClickOnElement(elem) {
        await this.rightClick({ elem });
    }

    async hoverWithoutWait({ elem, offset = { x: 0, y: 0 }, useBrowserActionForSafari = false }) {
        await this.sleep(2000);
        if (this.isSafari()) {
            return this.hoverForSafari({ elem: elem, offset: offset });
        }
        await this.moveToElement(elem, offset);
    }

    async hover({ elem, offset = { x: 0, y: 0 }, useBrowserActionForSafari = false }) {
        await this.waitForElementVisible(elem);
        await this.hoverWithoutWait({ elem, offset, useBrowserActionForSafari });
    }

    async hoverMouseOnElement(elem) {
        await this.hover({ elem: elem });
    }

    async hoverMouseAndClickOnElement(element) {
        await this.hoverMouseOnElement(element);
        await this.clickOnElement(element);
    }

    async hoverForICSTooltip({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        const height = await elem.getSize('height');
        offset.y = parseInt(height / 2 - 5);

        await this.moveToElement(elem, offset);
    }

    async dismissPreloadDropdown({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        const width = await elem.getSize('width');
        const height = await elem.getSize('height');
        offset.y = -parseInt(height / 2 + 2);
        await this.clickWithOffset({ elem: elem, offset: offset });
    }

    // Avoid the 2 seconds waiting in the hoverWithoutWait function
    async hoverWithoutPause({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        await this.moveToElement(elem, offset);
    }

    // whether we can perform browser action like mouseMove on these element
    async elemSupportsActionOnSafari(elem) {
        const tagName = await elem.getTagName();
        const lowerCase = tagName && tagName.toLowerCase();
        return lowerCase !== 'a' && lowerCase !== 'circle' && lowerCase != 'path';
    }

    async hoverForSafari({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(elem);
        const location = await this.getElementPositionOfScreen(elem, offset);

        let xCoords = location.x;
        let yCoords = location.y;

        xCoords = xCoords > 0 ? xCoords + 1 : 0;
        yCoords = yCoords > 0 ? yCoords : 0;
        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: {
                    pointerType: 'mouse',
                },
                actions: [
                    {
                        type: 'pointerMove',
                        duration: 0,
                        x: xCoords,
                        y: yCoords,
                    },
                ],
            },
        ]);
    }

    async multiSelectElements({ elem1, elem2 }) {
        await this.ctrlClick({ elem: elem1, checkClickable: false });
        await this.dossierPage.waitForPageLoading();
        await this.ctrlClick({ elem: elem2, checkClickable: false });
        return this.dossierPage.waitForPageLoading();
    }

    async shiftClick({ elem, offset = { x: 0, y: 0 } }) {
        await this.waitForElementVisible(elem);
        await this.waitForElementClickable(elem);
        await elem.moveTo();
        const location = await this.getElementPositionOfScreen(elem, offset);
        await browser.actions([
            browser.action('key').down(Key.Shift).pause(1000),
            browser.action('pointer').move(location).down({ button: 0 }).pause(50).up({ button: 0 }),
        ]);
    }

    async multiSelectElementsUsingShift(headElement, tailElement) {
        switch (browsers.params.browserName) {
            case 'chrome':
            case 'MicrosoftEdge':
            case 'msedge':
            case 'Safari':
                await this.clickOnElement(headElement);
                await this.shiftClick({ elem: tailElement });
                break;
            case 'firefox':
                let headElLocation = await headElement.getLocation();
                let tailElLocation = await tailElement.getLocation();
                let scriptToExecInBrowser = `
                let domele1 = document.evaluate("${
                    headElement.locator().value
                }", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', true, true, window, 1,  ${
                    headElLocation.x + headElLocation.width / 2
                }, ${headElLocation.y + headElLocation.height / 2}, ${headElLocation.x + headElLocation.width / 2}, ${
                    headElLocation.y + headElLocation.height / 2
                }, false, false, true, false, 0, null);
                domele1.dispatchEvent(clickEvent);`;
                await browser.execute(scriptToExecInBrowser);
                scriptToExecInBrowser = `
                let domele1 = document.evaluate("${
                    tailElement.locator().value
                }", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', true, true, window, 1,  ${
                    tailElLocation.x + tailElLocation.width / 2
                }, ${tailElLocation.y + tailElLocation.height / 2}, ${tailElLocation.x + tailElLocation.width / 2}, ${
                    tailElLocation.y + tailElLocation.height / 2
                }, false, false, true, false, 0, null);
                domele1.dispatchEvent(clickEvent);`;
                await browser.execute(scriptToExecInBrowser);
                break;
            default:
                throw ` page.multiSelectElementsUsingShift not implemented for browsers.params.browserName=${browsers.params.browserName}`;
        }
    }

    async selectAll(elem) {
        await this.moveToElement(elem);
        await this.clickByForce({ elem: elem });
        await browser.keys([os.platform() === 'darwin' ? Key.Command : Key.Ctrl, 'a']);
    }

    async dragAndDrop({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } }) {
        if (this.isSafari()) {
            await this.dragAndDropForSafari({ fromElem: await fromElem, fromOffset, toElem: await toElem, toOffset });
            return;
        }
        const srcPos = await this.getElementPositionOfScreen(fromElem, fromOffset);
        const tarPos = await this.getElementPositionOfScreen(toElem, toOffset);
        await browser
            .action('pointer')
            .move({ duration: 0, x: srcPos.x, y: srcPos.y })
            .down({ button: 0 })
            .move({ duration: 0, origin: 'pointer', x: 0, y: 0 })
            .pause(1000)
            .move({ duration: 2000, x: tarPos.x, y: tarPos.y })
            .up({ button: 0 })
            .perform();
    }

    async dragAndDropForCondition({ fromElem, toElem }) {
        const srcPos = await this.getElementPositionOfScreen(fromElem);
        const tarPos = await this.getElementPositionOfScreen(toElem);
        await this.dragAndDropPixelByPixel(srcPos, tarPos);
    }

    async dragAndDropByInterval({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } }) {
        const srcPos = await this.getElementPositionOfScreen(fromElem, fromOffset);
        const tarPos = await this.getElementPositionOfScreen(toElem, toOffset);
        console.log('tarPos', tarPos);
        await browser
            .action('pointer')
            .move({ duration: 0, x: srcPos.x, y: srcPos.y })
            .down({ button: 0 })
            .pause(1000)
            .move({ duration: 2000, x: tarPos.x, y: tarPos.y })
            .up({ button: 0 })
            .perform();
        let temPos = await this.getElementPositionOfScreen(fromElem);
        let count = 0;
        // how to calculate the absolute value of temPos.x -tarPos.x

        while ((Math.abs(temPos.x - tarPos.x) > 2 || Math.abs(temPos.y < tarPos.y) > 2) && count < 10) {
            await browser
                .action('pointer')
                .move({ duration: 0, x: temPos.x, y: temPos.y })
                .down({ button: 0 })
                .pause(1000)
                .up({ button: 0 })
                .perform();
            await browser
                .action('pointer')
                .move({ duration: 0, x: temPos.x, y: temPos.y })
                .down({ button: 0 })
                .pause(1000)
                .move({ duration: 2000, x: tarPos.x, y: tarPos.y })
                .up({ button: 0 })
                .perform();
            count++;
            temPos = await this.getElementPositionOfScreen(fromElem);
            console.log('temPos', temPos);
        }
    }

    async dragAndDropForSafari({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } }) {
        let dragAndDropScript =
            'var triggerDragAndDrop = function (elemDrag, fromOffset = {x: 0, y: 0},  elemDrop, toOffset = {x: 0, y: 0}) {\n' +
            'if (!elemDrag || !elemDrop) return false;\n' +
            '/* function for triggering mouse events*/\n' +
            'var fireMouseEvent = function (type, elem, centerX, centerY) {\n' +
            "var evt = document.createEvent('MouseEvents');\n" +
            'evt.initMouseEvent(' +
            'type,' +
            'true,' +
            'true,' +
            'window,' +
            '1,' +
            '1,' +
            '1,' +
            'centerX,' +
            'centerY,' +
            'false,' +
            'false,' +
            'false,' +
            'false,' +
            '0,' +
            'elem' +
            ');\n' +
            'elem.dispatchEvent(evt);\n' +
            '}\n' +
            '/* calculate positions*/\n' +
            'var pos = elemDrag.getBoundingClientRect();\n' +
            'var center1X = Math.floor((pos.left + pos.right) / 2 + fromOffset.x);\n' +
            'var center1Y = Math.floor((pos.top + pos.bottom) / 2 + fromOffset.y);\n' +
            'pos = elemDrop.getBoundingClientRect();\n' +
            'var center2X = Math.floor((pos.left + pos.right) / 2 + toOffset.x);\n' +
            'var center2Y = Math.floor((pos.top + pos.bottom) / 2 + toOffset.y);\n' +
            '/* mouse over dragged element and mousedown*/\n' +
            "fireMouseEvent('mousemove', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('mouseover', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('mousedown', elemDrag, center1X, center1Y);\n" +
            '/* start dragging process over to drop target*/\n' +
            "fireMouseEvent('dragstart', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('drag', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('mousemove', elemDrag, center1X, center1Y);\n" +
            "fireMouseEvent('drag', elemDrag, center2X, center2Y);\n" +
            "fireMouseEvent('mousemove', elemDrop, center2X, center2Y);\n" +
            '/* trigger dragging process on top of drop target*/\n' +
            "fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);\n" +
            "fireMouseEvent('dragenter', elemDrop, center2X, center2Y);\n" +
            "fireMouseEvent('mouseover', elemDrop, center2X, center2Y);\n" +
            "fireMouseEvent('dragover', elemDrop, center2X, center2Y);\n" +
            '/* release dragged element on top of drop target*/\n' +
            "fireMouseEvent('drop', elemDrop, center2X, center2Y);\n" +
            "fireMouseEvent('dragend', elemDrag, center2X, center2Y);\n" +
            "fireMouseEvent('mouseup', elemDrag, center2X, center2Y);\n" +
            'return true;\n' +
            '};\n';

        dragAndDropScript += 'var fromElem = arguments[0];';
        dragAndDropScript += 'var toElem = arguments[1];';

        dragAndDropScript +=
            '\ntriggerDragAndDrop(fromElem, {x:' +
            fromOffset.x +
            ', y:' +
            fromOffset.y +
            '}, toElem, {x:' +
            toOffset.x +
            ', y:' +
            toOffset.y +
            '});';

        await this.executeScript(dragAndDropScript, fromElem, toElem);
    }

    async dragAndDropForAuthoring({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } }) {
        const src_location = await this.getElementPositionOfScreen(fromElem, fromOffset);
        const tar_location = await this.getElementPositionOfScreen(toElem, toOffset);
        const differenceX = Math.round(src_location.x - tar_location.x);
        const differenceXAbs = Math.abs(differenceX);
        const isSourceOnTheLeftOfTarget = !(differenceX > 0);
        const differenceY = Math.round(src_location.y - tar_location.y);
        const differenceYAbs = Math.abs(differenceY);
        const isSourceOnTheTopOfTarget = !(differenceY > 0);

        const moveStep = 5;

        const actions = [
            { type: 'pointerMove', duration: 0, x: Math.round(src_location.x), y: Math.round(src_location.y) },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 200 },
        ];
        for (let i = 0; i < Math.ceil(differenceXAbs / moveStep); i++) {
            const moveX = isSourceOnTheLeftOfTarget ? moveStep : -moveStep;
            actions.push({
                type: 'pointerMove',
                duration: 20,
                origin: 'pointer',
                x: moveX,
                y: 0,
            });
        }

        for (let i = 0; i < Math.ceil(differenceYAbs / moveStep); i++) {
            const moveY = isSourceOnTheTopOfTarget ? moveStep : -moveStep;
            actions.push({
                type: 'pointerMove',
                duration: 20,
                origin: 'pointer',
                x: 0,
                y: moveY,
            });
        }
        actions.push({ type: 'pointerUp', button: 0 });

        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointerDividerMoving',
                parameters: { pointerType: 'mouse' },
                actions: actions,
            },
        ]);

        await this.releasePointer();
    }

    /**
     * High-precision drag and drop function with offset support
     * @param {Object} params Configuration object
     *   - fromElem     Source element
     *   - fromOffset   Offset from source element center
     *   - toElem       Target element
     *   - toOffset     Offset from target element center
     *   - speedFactor  Speed multiplier (1=normal, higher=faster)
     */
    async dragAndDropForAuthoringWithOffset({
        fromElem,
        fromOffset = { x: 0, y: 0 },
        toElem,
        toOffset = { x: 0, y: 0 },
        speedFactor = 1,
    }) {
        try {
            // ==== Calculate precise coordinates ====
            // Source/Target coordinates (element center + offset)
            const src_location = await this.getElementPositionOfScreen(fromElem, fromOffset);
            const tar_location = await this.getElementPositionOfScreen(toElem, toOffset);
            const startX = src_location.x;
            const startY = src_location.y;
            const endX = tar_location.x;
            const endY = tar_location.y;

            // ==== Dynamic path calculation ====
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const totalDistance = Math.hypot(deltaX, deltaY);

            // Adaptive step size calculation
            const baseStep = speedFactor > 1 ? 10 : 5;
            const stepSize = Math.min(baseStep * speedFactor, 20);
            const totalSteps = Math.ceil(totalDistance / stepSize);

            // ==== Build action sequence ====
            const actions = [
                // Move to start point and press
                { type: 'pointerMove', duration: 0, x: Math.round(startX), y: Math.round(startY) },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 50 }, // Short pause to trigger drag recognition
            ];

            // Linear interpolation movement
            for (let i = 1; i < totalSteps; i++) {
                const ratio = i / totalSteps;
                const x = startX + deltaX * ratio;
                const y = startY + deltaY * ratio;
                actions.push({
                    type: 'pointerMove',
                    duration: speedFactor > 1 ? 2 : 5, // Faster movement when speedFactor > 1
                    x: Math.round(x),
                    y: Math.round(y),
                });
            }

            // Final position adjustment and release
            actions.push(
                { type: 'pointerMove', duration: 10, x: Math.round(endX), y: Math.round(endY) },
                { type: 'pointerUp', button: 0 }
            );

            // ==== Execute drag operation ====
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'precisionDrag',
                    parameters: { pointerType: 'mouse' },
                    actions: actions,
                },
            ]);
        } catch (error) {
            // Log error without retry
            console.error('Drag and drop operation failed:', error);
        } finally {
            await this.releasePointer();
        }
    }

    async dragAndDropPixelByPixel(src_location, tar_location) {
        const differenceX = Math.round(src_location.x - tar_location.x);
        const differenceXAbs = Math.abs(differenceX);
        const isSourceOnTheLeftOfTarget = !(differenceX > 0);
        const differenceY = Math.round(src_location.y - tar_location.y);
        const differenceYAbs = Math.abs(differenceY);
        const isSourceOnTheTopOfTarget = !(differenceY > 0);
        const actions = [
            { type: 'pointerMove', duration: 0, x: Math.round(src_location.x), y: Math.round(src_location.y) },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 1000 },
        ];
        for (let i = 0; i < differenceXAbs; i++) {
            actions.push({
                type: 'pointerMove',
                duration: 100,
                origin: 'pointer',
                x: isSourceOnTheLeftOfTarget ? 1 : -1,
                y: 0,
            });
        }
        for (let i = 0; i < differenceYAbs; i++) {
            actions.push({
                type: 'pointerMove',
                duration: 100,
                origin: 'pointer',
                x: 0,
                y: isSourceOnTheTopOfTarget ? 1 : -1,
            });
        }
        actions.push({ type: 'pointerUp', button: 0 });

        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointerDividerMoving',
                parameters: { pointerType: 'mouse' },
                actions: actions,
            },
        ]);

        await this.releasePointer();
    }

    /**
     * Another DnD method but this time moving by pixel.
     * Have to first move to some arbitrary position before moving to desired position
     * TO-DO: when validation is important, this fails when pixels > 300, top/left positions off by 5
     * @param {*} element the element to move
     * @param {*} pixels  pixels to move
     * @param {*} direction x or y
     */
    async dragAndDropByPixel(element, xPixels = 0, yPixels = 0, waitForLoadingDialog) {
        let dndInnerTime = 500;
        try {
            // Move to the element (hover)
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse1',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', origin: element, x: 0, y: 0 },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerDown', button: 0 }, // Click to hold the element
                        { type: 'pause', duration: dndInnerTime },

                        // Small moves to adjust position
                        { type: 'pointerMove', origin: 'pointer', x: 5, y: 0 },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', origin: 'pointer', x: 0, y: 5 },
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerMove', origin: 'pointer', x: -5, y: -5 },
                        { type: 'pause', duration: dndInnerTime },

                        // Actual move to the new position, split the movement into 2 steps
                        {
                            type: 'pointerMove',
                            origin: 'pointer',
                            x: Math.floor(xPixels * 0.5),
                            y: Math.floor(yPixels * 0.5),
                        },
                        { type: 'pause', duration: dndInnerTime },
                        {
                            type: 'pointerMove',
                            origin: 'pointer',
                            x: Math.ceil(xPixels * 0.5),
                            y: Math.ceil(yPixels * 0.5),
                        }, // Move the remaining half
                        { type: 'pause', duration: dndInnerTime },
                        { type: 'pointerUp', button: 0 }, // Release the mouse button
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);
        } catch (err) {
            console.log(err.message);
        }
        if (waitForLoadingDialog) {
            await this.sleep(10000);
        }
    }

    async releasePointer() {
        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointerDividerUp',
                parameters: { pointerType: 'mouse' },
                actions: [{ type: 'pointerUp', button: 0 }],
            },
        ]);
    }

    async getElementPositionOfScreen(elem, offset = { x: 0, y: 0 }) {
        const result = { x: 0, y: 0 };
        try {
            const location = await elem.getLocation();
            const width = await elem.getSize('width');
            const height = await elem.getSize('height');
            result.x = parseInt(location.x + width / 2 + offset.x);
            result.y = parseInt(location.y + height / 2 + offset.y);
        } catch (err) {
            errorLog(
                `Failed to get absolute x,y position of the given element, return top left (0,0) instead. Error: ${err}}`
            );
        }
        return result;
    }

    async typeKeyboard(keys) {
        for (const key of keys) {
            await browser.keys(key);
        }
        return this.sleep(2000);
    }

    async mouseClick(el, eventData) {
        /* eslint-disable */
        await this.executeScript(
            function injectedScript(el, eventData) {
                var e = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: eventData.clientX,
                    clientY: eventData.clientY,
                    screenX: eventData.screenX,
                    screenY: eventData.screenY,
                });
                el.dispatchEvent(e);
            },
            await el,
            eventData
        );
        /* eslint-enable */
    }

    async moveToElement(el, offset = { x: 0, y: 0 }) {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(el);
        const location1 = await this.getElementPositionOfScreen(el);
        const location = await this.getElementPositionOfScreen(el, offset);
        await browser.action('pointer').move(location).perform();
    }

    async moveToPosition({ x, y }) {
        await browser.action('pointer').move(x, y).perform();
    }

    /**
     * Get the height of a web element
     * @param {WebElement} element
     */
    async getElementHeight(element) {
        let size = await element.getSize();
        return size.height;
    }

    /**
     * Scroll down a overflowed list if necessary and select the target selection. Applicable to both incremental fetched and partial rendered list
     * Applicable to scroll a list web element within page
     * @param {WebElement} listContent Current displayed dropdown list box div
     * @param {WebElement} wholeList Dropdown whole list including the overflowed options
     * @param {WebElement} item taget option element
     * @param {Integer} pixel pixel to select per scroll action
     */
    async scrollDownToTargetOption(listContent, wholeList, item, pixel = 150) {
        let isVisible = this.isElementVisible(item, this.DEFAULT_DOMNodeRender_Timeout3);
        if (isVisible) return;
        await this.waitForElementVisible(listContent, { timeout: this.DEFAULT_DOMNodePresent_Timeout10 });
        await this.waitForElementVisible(wholeList, { timeout: this.DEFAULT_DOMNodePresent_Timeout10 });
        let contentHeight = await this.getElementHeight(listContent);
        let wholeListHeight = await this.getElementHeight(wholeList);
        if (wholeListHeight > contentHeight) {
            let length;
            // Scroll down until the element is visible
            for (let i = 0; !isVisible && i < wholeListHeight / pixel; i++) {
                length = pixel * (i + 1);
                await browser.execute('arguments[0].scrollTop = arguments[1];', listContent, length);
                isVisible = this.isElementVisible(item, this.DEFAULT_DOMNodeRender_Timeout3);
            }
            // If the element is still invisible, scroll up until the element is visible
            if (length >= wholeListHeight && !isVisible) {
                for (let i = 0; !isVisible && i < wholeListHeight / pixel; i++) {
                    length = pixel * (i + 1);
                    await browser.execute('arguments[0].scrollBy(0, arguments[1]);', listContent, length * -1);
                    isVisible = this.isElementVisible(item, this.DEFAULT_DOMNodeRender_Timeout3);
                }
            }
        }
    }

    async renameTextField(newName) {
        let elEditingTextField = await this.common.editingTextField;
        await this.waitForElementClickable(elEditingTextField);
        await this.clickOnElement(elEditingTextField);
        await this.clear({ elem: elEditingTextField });
        await elEditingTextField.addValue(newName);
        await browser.keys(Key.Enter);
        await this.sleep(1000);
    }

    // Actions
    async scrollDown(elem, offset) {
        await this.executeScript('arguments[0].scrollTop = arguments[1];', await elem, offset);
        return this.sleep(1000);
    }

    async scrollOnPage(toPosition) {
        await scrollElement(this.getDocView(), toPosition);
    }

    /**
     * Scroll the on page to to top
     */
    async scrollPageToTop() {
        await scrollElementToTop(this.getDocView());
    }

    async scrollPageToBottom() {
        await scrollElementToBottom(this.getDocView());
    }

    async waitForElementPresence(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForExist({
            timeout: options.timeout,
            timeoutMsg,
        });
    }

    /**
     * Dynamic wait
     * @param { WebdriverIO.$return } el
     * @param {*} options
     */
    async waitForElementInvisible(
        el,
        options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '', interval: undefined }
    ) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        const interval = options.interval ? options.interval : undefined;
        await el.waitForDisplayed({
            timeout: options.timeout,
            reverse: true,
            interval,
            timeoutMsg,
        });
    }

    /**
     * @param { WebdriverIO.$return } el
     */
    async waitForElementStaleness(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForExist({
            timeout: options.timeout,
            reverse: true,
            timeoutMsg,
        });
    }

    /**
     * @param { WebdriverIO.$return } el
     */
    async waitForTextPresentInElementValue(el, txt, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(
            async () => {
                let value = await el.getValue();
                return value.includes(txt);
            },
            {
                timeout: options.timeout,
                timeoutMsg,
            }
        );
    }

    async waitForElementClickable(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForClickable({
            timeout: options.timeout,
            timeoutMsg,
        });
    }

    async waitForElementEnabled(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForEnabled({
            timeout: options.timeout,
            timeoutMsg,
        });
    }

    async waitForElementDisabled(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(
            async () => {
                const isEnabled = await el.isEnabled();
                return !isEnabled;
            },
            {
                timeout: options.timeout,
                timeoutMsg,
            }
        );
    }

    async waitForDynamicElementLoading() {
        const loadingElement = await this.$('.mstrd-Spinner.mstrd-Loadable-icon');
        const isLoadingElementPresent = await loadingElement.isExisting();
        if (isLoadingElementPresent) {
            await this.waitForElementInvisible(loadingElement, {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'The dynamic loading spinner took too long to be removed from the dom.',
            });
            await this.sleep(1000); // Give it some time for the element to be rendered to the DOM
        }
    }

    isSafari() {
        return browsers.params.browser && browsers.params.browser.browserName == 'safari';
    }

    async waitForLibraryLoading() {
        await this.waitForElementStaleness(this.getLoadingLabel(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Library Page Loading takes too long',
        });
        await this.waitForItemLoading();
        await this.sleep(1000);
        await this.waitForElementStaleness(this.getLoadingLabel(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Library Page Loading takes too long',
        });
    }

    async waitForItemLoading() {
        await this.waitForElementInvisible(this.getPageLoading(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Library page loading takes too long.',
        });
        return this.sleep(2000); // Time buffer for animation
    }

    async waitForPageIndicatorInvisible() {
        await this.waitForElementInvisible(this.getPageIndicator(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Library page loading takes too long.',
        });
        return this.sleep(2000); // Time buffer for animation
    }

    async waitForCurtainDisappear() {
        await this.waitForElementStaleness(this.getPageLoading());
        await this.waitForElementStaleness(this.getLoadingIcon());
    }

    async waitForCondition(conditionFunc, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(conditionFunc, { timeout: options.timeout, timeoutMsg });
    }

    /**
     * Dynamic wait
     * @param { WebdriverIO.$return } el
     * @param {*} options
     */
    async waitForElementVisible(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForDisplayed({
            timeout: options.timeout,
            timeoutMsg,
        });
    }

    /**
     * Dynamic wait
     * @param { WebdriverIO.$return } el
     * @param {*} options
     */
    async waitForElementVisibleInTeams(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(
            async () => {
                return await el.isDisplayed();
            },
            {
                timeout: options.timeout,
                timeoutMsg,
            }
        );
    }

    async waitForEitherElemmentVisible(el1, el2, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        var waitCount = 0;
        while (!(await el1.isDisplayed()) && !(await el2.isDisplayed()) && waitCount < options.timeout) {
            await this.sleep(1000);
            waitCount += 1000;
        }
        if (await el1.isDisplayed()) {
            return el1;
        }
        if (await el2.isDisplayed()) {
            return el2;
        }
        if (waitCount >= options.timeout) {
            throw new Error(timeoutMsg || 'Time out, neither element is displayed');
        }
    }

    observeElements = observeElements;
    observeRequests = observeRequests;
    observeEvent = observeEvent;

    async waitForElementExsiting(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await el.waitForExist({
            timeout: options.timeout,
            timeoutMsg,
        });
    }

    async waitForTextAppearInElement(el, text, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(
            async () => {
                const elementText = await el.getText();
                return elementText.includes(text);
            },
            {
                timeout: options.timeout,
                timeoutMsg,
            }
        );
    }

    async waitForTextUpdated(el, text, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const timeoutMsg = options.msg !== '' && options.msg !== undefined ? options.msg : undefined;
        await browser.waitUntil(
            async () => {
                const elementText = await el.getText();
                return !elementText.includes(text);
            },
            {
                timeout: options.timeout,
                timeoutMsg,
            }
        );
    }

    async waitForElementAppearAndGone(el) {
        await this.waitForElementVisible(el);
        await this.waitForElementInvisible(el);
    }

    async waitForPageLoadByTitle(title, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const normalizedMessage = this._normalizeMessage(
            options.msg,
            `${title} page didn't visible for ${options.timeout} seconds`
        );
        await browser.waitUntil(
            async () => {
                const pageTitle = await browser.getTitle();
                return pageTitle.toLowerCase().includes(title.toLowerCase());
            },
            {
                timeout: options.timeout,
                timeoutMsg: normalizedMessage,
            }
        );
    }

    async waitForPageLoadByUrl(title, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const normalizedMessage = this._normalizeMessage(
            options.msg,
            `${title} page didn't visible for ${options.timeout} seconds`
        );
        await browser.waitUntil(
            async () => {
                const pageTitle = await browser.getUrl();
                return pageTitle.toLowerCase().includes(title.toLowerCase());
            },
            {
                timeout: options.timeout,
                timeoutMsg: normalizedMessage,
            }
        );
    }

    async waitForPendoToBeInitialized(options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' }) {
        const normalizedMessage = this._normalizeMessage(
            options.msg,
            `Pendo did not initialize within timeout period of ${options.timeout} seconds`
        );

        let isReady = false;

        await browser
            .waitUntil(
                async () => {
                    isReady = await browser.execute(() => window.pendo?.isReady?.());
                    return isReady;
                },
                {
                    timeout: options.timeout,
                    timeoutMsg: normalizedMessage,
                }
            )
            .catch((error) => {
                console.warn('####waitForPendoToBeInitialized() Error:', error);
            });
        return isReady;
    }

    async waitForProcessorDisappear() {
        await this.waitForElementInvisible(this.getProgressBar());
    }

    async waitForErrorMessage() {
        await this.waitForElementVisible(this.getErrorDialogMainContainer());
    }

    async tooltip() {
        await this.sleep(2000); // Sometimes more than 1 tooltip will be displayed or the old one is unmounting before the tooltip we want is ready, lets wait for the old one to be removed
        await this.waitForElementVisible(
            this.getTooltipContainer(),
            { timeout: this.DEFAULT_TIMEOUT },
            { msg: 'The tooltip took too long to display' }
        );
        const toolTipString = await this.getTooltipContainer().getText();
        return toolTipString.trim();
    }

    async mojoTooltip() {
        await this.sleep(2000); // Sometimes more than 1 tooltip will be displayed or the old one is unmounting before the tooltip we want is ready, lets wait for the old one to be removed
        await this.waitForElementVisible(this.getMojoTooltip(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'The mojo tooltip took too long to display',
        });
        const toolTipString = await this.getMojoTooltip().getText();
        return toolTipString.trim();
    }

    async isTooltipDisplayed(tooltip) {
        const el = this.getTooltipbyMessage(tooltip);
        return el.isDisplayed();
    }

    async isErrorPresent() {
        return this.getErrorDialogue().isDisplayed();
    }

    async isErrorActionButtonPresent(buttonName) {
        return this.getErrorButton(buttonName).isDisabled();
    }

    async isMojoErrorPresent() {
        return this.getMojoErrorDialogue().isDisplayed();
    }

    async errorTitle() {
        let errorTitle = await this.getErrorDialogue().$('.mstrd-MessageBox-title').getText();
        errorTitle = this.trimStringForSafari(errorTitle);
        return errorTitle;
    }

    async showDetails() {
        await this.clickAndNoWait({ elem: this.getShowDetailsButton() });
    }

    async errorDetails() {
        return this.getErrorDialogue().$('.mstrd-MessageBox-errorDetails.show').getText();
    }

    // fsuo: helper function to get value from browser by executing script
    // @condition: 'return arguments[0].getBoundingClientRect()'...
    async getBrowserData(script, domElement) {
        return await driver.executeScript(script, [domElement]);
    }

    async dragMoveAndDrop(source, target) {
        const src_location = await source.getLocation();
        const trg_location = await target.getLocation();
        return browser
            .action('pointer')
            .move(src_location.x, src_location.y)
            .down({ button: 0 })
            .move(src_location.x + 5, src_location.y + 5)
            .move(src_location.x, src_location.y)
            .move(trg_location.x, trg_location.y)
            .up({ button: 0 })
            .perform();
    }

    async dragAndDropObjectWithExtraMove(
        movingElement,
        targetElement,
        moveX = 0,
        moveY = 0,
        waitForLoadingDialog = false
    ) {
        const dndInnerTime = 300; // Allow DND animation to work properly (in milliseconds)
        try {
            // Move to the moving element and press down
            const movingElementLocation = await movingElement.getLocation();
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: movingElementLocation.x, y: movingElementLocation.y },
                        { type: 'pointerDown', button: 0 },
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);

            // Perform small adjustments
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', duration: 100, origin: 'pointer', x: 5, y: 0 },
                        { type: 'pointerMove', duration: 100, origin: 'pointer', x: 0, y: 5 },
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);

            // Move to the target element
            const targetElementLocation = await targetElement.getLocation();
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', duration: 200, x: targetElementLocation.x, y: targetElementLocation.y },
                        { type: 'pointerMove', duration: 200, origin: 'pointer', x: moveX, y: moveY },
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);

            // Release the mouse button
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [{ type: 'pointerUp', button: 0 }],
                },
            ]);
            await browser.pause(dndInnerTime);
        } catch (err) {
            console.error(`Error during drag and drop: ${err.message}`);
        }

        // Optional: Wait for loading dialog to disappear
        if (waitForLoadingDialog) {
            await this.sleep(10000);
        }
    }
    /** For clicking through options when an element is obscured
     * Use this as a workaround for web driver errors relating to obscured or unlclickable elements
     * @param {WebElement} element the Web Element to clicked on
     * @author Eduardo Alcazar-Bustills <ebustillos@microstrategy.com>
     */
    async clickOnElementByInjectingScript(element) {
        const scriptToExecInBrowser = `
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        arguments[0].dispatchEvent(clickEvent);
        `;
        await browser.execute(scriptToExecInBrowser, element);
    }

    /**
     * @param {WebdriverIO.$return} el
     */
    async isSelected(el, key = 'selected') {
        const name = await getAttributeValue(el, 'className');
        return name.toLowerCase().includes(key);
    }

    async isUnSelected(el, key = 'unselected') {
        const name = await getAttributeValue(el, 'className');
        return name.toLowerCase().includes(key);
    }

    async isChecked(el) {
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('checked');
    }

    async isCollapsed(el) {
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('collapsed');
    }

    async isOn(el) {
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('on');
    }

    async getSelected(els, key = 'selected') {
        const items = [];
        const elements = els.then ? await els : els;
        for (const [, el] of elements.entries()) {
            const name = await el.getAttribute('class');
            if (name.toLowerCase().includes(key)) {
                items.push(name);
            }
        }
        return items;
    }

    async elemSupportsClickMethodOnSafari(elem) {
        const tagName = await elem.getTagName();
        const lowerCase = tagName && tagName.toLowerCase();
        return lowerCase !== 'a' && lowerCase !== 'span' && lowerCase !== 'tr' && lowerCase !== 'input';
    }

    async errorMsg() {
        let errorMsg = await this.getErrorDialogue().$('.mstrd-MessageBox-msg').getText();
        errorMsg = this.trimStringForSafari(errorMsg);
        return errorMsg;
    }

    async mojoErrorMsg() {
        return this.getMojoErrorDialogue().$('.error-details').getText();
    }

    /**
     * @param {WebdriverIO.$return} el
     */
    async isDisabled(el) {
        const clsName = await el.getAttribute('class');
        return clsName.includes('disabled') || clsName.includes('Disabled');
    }

    async isAriaDisabled(el) {
        const ariaDisabled = await el.getAttribute('aria-disabled');
        return ariaDisabled === 'true';
    }

    async isAriaReadOnly(el) {
        const ariaReadOnly = await el.getAttribute('aria-readonly');
        return ariaReadOnly === 'true';
    }

    async isAriaChecked(el) {
        const ariaChecked = await el.getAttribute('aria-checked');
        return ariaChecked === 'true';
    }

    async isAiraSelected(el) {
        const ariaSelected = await el.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isDisabledStatus(el) {
        const clsName = await el.getAttribute('class');
        return clsName.includes('disabled');
    }

    async isHidden(el) {
        const ariaDisabled = await el.getAttribute('aria-hidden');
        return ariaDisabled === 'true';
    }

    async isActive(el) {
        const clsName = await el.getAttribute('class');
        return clsName.includes('active');
    }

    async isExpanded(el) {
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('isExpanded');
    }

    /**
     * Check whether an item value is existed on target elements
     * @param {string} item the item value to check
     * @param {WebdriverIO.$$return} els the target elements
     * @param {string} attribute the item attribute, e.g. value/text
     * @returns {boolean} return true if exsited
     */
    async isExisted(item, els, attribute = 'value') {
        const elements = els.then ? await els : els;
        let attributeValue;
        for (let i = 0; i < elements.length; i++) {
            if (attribute === 'text') {
                attributeValue = await elements[i].getText();
            } else {
                attributeValue = await getAttributeValue(elements[i], attribute);
            }
            if (attributeValue.includes(item)) {
                return true;
            }
        }
        return false;
    }

    async switchToNewWindowWithLink(link) {
        await this.executeScript('window.open()');
        await this.switchToNewWindow();
        await browser.url(link);
    }

    async waitForDownloadComplete(name, fileType) {
        if (!name) {
            throw new Error('The name parameter must be provided.');
        }

        if (!browser.isIE && !(browser.isEdge && fileType === 'pdf')) {
            // Wait the file to be completely generated after the download spinner disappears
            await waitForFileToExist(name, fileType);
        }
    }

    isWeb() {
        return browsers.params.isWeb !== null && browsers.params.isWeb !== undefined && browsers.params.isWeb === 'true'
            ? true
            : false;
    }

    getRequestPostData(request) {
        return request.postData ? JSON.parse(request.postData) : {};
    }

    async getClipboardText() {
        return this.executeScript('return navigator.clipboard.readText()');
    }

    async moveToTopLeftCorner() {
        let body = await this.$(`/html/body`);
        await this.moveToElement(body, { x: 0, y: 0 });
    }

    async clickTopLeftCorner() {
        let body = await this.$(`/html/body`);
        await this.click({ elem: body, offset: { x: 0, y: 0 } });
    }

    /**
     * Check if an element is visible or not, when the element is invisible, it might be in the DOM. The expected status is visible.
     * @param {WebElement} element
     * @returns {Boolean} true: element is visible; false: element is not visible.
     */
    async isElementVisible(element, timeout = this.DEFAULT_LOADING_TIMEOUT) {
        let isVisible = false;
        try {
            await this.waitForElementVisible(element, { timeout: timeout });
            isVisible = true;
        } catch (err) {
            isVisible = false;
        }
        return isVisible;
    }

    async isElementPresent(element) {
        try {
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    /**
     * scroll element into view
     * Firefox part is to be refined. As current method only use class value for the xpath, it may return multiple elements. ${element.locator().value} does not work well in webdriverio.
     * @param {WebElement} element
     */
    async scrollIntoView(
        element,
        options = { block: 'nearest', inline: 'nearest', behavior: 'smooth' },
        attributeName = 'class'
    ) {
        switch (browsers.params.browserName) {
            case 'chrome':
            case 'MicrosoftEdge':
            case 'msedge':
                await element.scrollIntoView({
                    block: options.block,
                    inline: options.inline,
                    behavior: options.behavior,
                });
                break;
            case 'firefox': {
                const locatorValue = await element.getAttribute(attributeName);
                let scriptToExecInBrowser = `
                    let domele1 = document.evaluate(".//*[@${attributeName}='${locatorValue}']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    `;
                scriptToExecInBrowser += `
                        domele1.scrollIntoView({behavior: "smooth"});`;
                await browser.execute(scriptToExecInBrowser);
                break;
            }
            default:
                throw `page.scrollIntoView not implemented for browsers.params.browserName=${browsers.params.browserName}`;
        }
    }

    async setValueByJavaScript({ element, value, shouldEnter = false }) {
        await this.executeScript(
            (elem, val, shouldEnter) => {
                // More robust value setting for different element types
                if (elem.isContentEditable) {
                    elem.innerHTML = val;
                } else {
                    // Clear existing value first
                    elem.value = '';
                    elem.value = val;
                }

                // More comprehensive event triggering
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                const changeEvent = new Event('change', { bubbles: true, cancelable: true });

                // For React compatibility
                const eventTracker = elem._valueTracker;
                if (eventTracker) {
                    eventTracker.setValue('');
                }

                elem.dispatchEvent(inputEvent);
                elem.dispatchEvent(changeEvent);

                if (shouldEnter) {
                    const keyEventInit = {
                        key: 'Enter',
                        code: 'Enter',
                        charCode: 13,
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                    };

                    // More complete keyboard simulation
                    elem.dispatchEvent(new KeyboardEvent('keydown', keyEventInit));
                    elem.dispatchEvent(new KeyboardEvent('keypress', keyEventInit));
                    elem.focus();
                    elem.dispatchEvent(new KeyboardEvent('keyup', keyEventInit));
                    elem.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            },
            element,
            value,
            shouldEnter
        );
    }

    async setInputValue({ element, value}) {
        await this.executeScript("arguments[0].value = arguments[1]", await element, value);
    }
}
