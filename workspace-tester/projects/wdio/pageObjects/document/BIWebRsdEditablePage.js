import BasePage from '../base/BasePage.js';

export default class BIWebRsdEditablePage extends BasePage {
    constructor() {
        super();
    }

    DocView() {
        return this.$('.mstrDocViewer');
    }

    DocName() {
        return this.$('.mstrPathTextCurrent');
    }

    PathAccount() {
        return this.$('#mstrPathAccount');
    }

    getWaitCurtain() {
        return this.$('#mstrWeb_waitCurtain');
    }

    getPageLoadingWaitBox() {
        return this.$$('#pageLoadingWaitBox').filter((el) => el.isDisplayed())[0];
    }

    getErrorMessage() {
        return this.$('.mstrAlert');
    }

    async waitForErrorMessage() {
        await this.waitForElementVisible(this.getErrorMessage(), {
            msg: 'Login page Error box was not displayed.',
            timeout: this.DEFAULT_LOADING_TIMEOUT,
        });
    }

    async getDocName() {
        return this.DocName().getText();
    }

    async getAccountName() {
        return this.PathAccount().$('span').getText();
    }

    async waitForCurtainDisappear(timeout = this.DEFAULT_LOADING_TIMEOUT) {
        await this.waitForElementInvisible(this.getWaitCurtain(), timeout);
        await this.waitForElementInvisible(this.getPageLoadingWaitBox(), timeout);
        await this.waitForElementInvisible($('#waitBox .mstrWaitBox'), timeout);
        // In some scenarios the wait box id is 'mstrWeb_wait'
        await this.waitForElementInvisible($('#mstrWeb_wait .mstrWaitBox'), timeout);
        await this.waitForElementInvisible(this.$$('.mstrmojo-Editor.mstrWaitBox.modal')[0], timeout);
        // RSD loading curtain
        await this.waitForElementInvisible($('#waitBox .mstrmojo-Editor-curtain'), timeout);
    }

    async waitForRsdLoad(timeout = this.DEFAULT_LOADING_TIMEOUT, message = timeout) {
        const normalizedTimeout = this._normalizeTimeout(timeout);
        const normalizedMessage = this._normalizeMessage(message, `RSD didn't visible for ${normalizedTimeout} ms.`);
        await this.waitForElementVisible(this.DocView(), { timeout: normalizedTimeout, msg: normalizedMessage });
        await this.waitForCurtainDisappear();
    }
}
