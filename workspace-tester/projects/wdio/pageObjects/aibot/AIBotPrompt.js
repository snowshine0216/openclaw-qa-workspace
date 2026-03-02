import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { Key } from 'webdriverio';

export default class AIBotPromptPanel extends BasePage {
    static TIMEOUT = 60 * 1000;

    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    //Element locator
    // < --------------------------- prompt panel --------------------------------- >

    getAddPromptBtn() {
        return this.$('.mstr-ai-chatbot-AliasConfig-addPrompt');
    }

    getConfigPromptTitle() {
        return this.$('.mstr-ai-chatbot-AliasConfig-title');
    }

    getAllAliasObjCount() {
        return this.$$('.mstr-ai-chatbot-AliasObject-content').length;
    }

    getAliasObjByIndex(index) {
        return this.$$('.mstr-ai-chatbot-AliasObject-content')[index];
    }

    getAliasNameInputByIndex(index) {
        return this.getAliasObjByIndex(index).$('.mstr-ai-chatbot-AliasObject-name-input');
    }

    getAliasPlayBtnByIndex(index) {
        return this.getAliasObjByIndex(index).$('.mstr-ai-chatbot-AliasObject-play');
    }

    getAliasTextAreaByIndex(index) {
        return this.getAliasObjByIndex(index).$('.mstr-ai-chatbot-AliasObject-step-textarea');
    }

    getAliasDeleteBtn(index) {
        return this.getAliasObjByIndex(index).$(`.//following-sibling::div[contains(@class, 'mstr-ai-chatbot-AliasObject-delete')]`);
    }

    getAliasTextAreaContentByIndex(index) {
        return this.getAliasObjByIndex(index).$(`.//div[contains(@class, 'mstr-chatbot-markdown')]//p`);
    }

    // < ---------------------------  prompts above Q&A input box --------------------------------- >

    getPromptQuickRepliesBtn() {
        return this.$(`div[data-feature-id="aibot-input-footer-prompts-toggle-v2"]`); // change to feature-id to applicable to different languages
    }

    getPromptQuickRepliesByTitle(promptTitle) {
        return this.$(
            `//div[text()='${promptTitle}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-AliasCard')]`
        );
    }

    // < --------------------------- landing page -------------------------------------------------- >
    getPromptGalleryPanel() {
        return this.$('.mstr-ai-chatbot-GalleryPanel-galleryContainer');
    }
    
    getPromptCardByByTitle(promptTitle) {
        return this.$(
            `//h2[text()='${promptTitle}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-AliasCard')]`
        );
    }

    getPromptCardLoadingByTitle(promptTitle) {
        return this.getPromptCardByByTitle(promptTitle).$(`.//div[@class='loadingIcon']`);
    }

    //Actions helper
    // < --------------------------- prompt panel --------------------------------- >
    async clickAddPromptBtn() {
        return await this.getAddPromptBtn().click();
    }

    async isAliasObjDisplayed(index) {
        return this.getAliasObjByIndex(index).isDisplayed();
    }

    async TypeInputBox(input, newValue){
        await this.click({ elem: input });
        await browser.pause(500);
        await browser.keys([Key.Ctrl, 'a']);
        await browser.pause(500);
        await browser.keys([Key.Backspace]);
        await browser.pause(500);
        await browser.keys(newValue);
        await browser.pause(500);

        // click somewhere else to finish the input
        await this.getConfigPromptTitle().click();

    }

    async renameAliasName(index, name) {
        const input = this.getAliasNameInputByIndex(index);
        await this.waitForElementVisible(input);
        await this.TypeInputBox(input, name);
    }

    async updatePromptQuesion(index, Q){
        const input = this.getAliasTextAreaByIndex(index);
        await this.waitForElementVisible(input);
        await this.TypeInputBox(input, Q);
    }

    async deletePromptByIndex(index) {
        return await this.getAliasDeleteBtn(index).click();
    }

    async clickPromptPlayBtn(index) {
        return await this.getAliasPlayBtnByIndex(index).click();
    }

    async deleteAllPrompts() {
        let count = await this.getAllAliasObjCount();
        while (count > 0) {
            await this.deletePromptByIndex(0);
            await browser.pause(200);
            count = await this.getAllAliasObjCount();
        }
    }

    // < --------------------------- prompts above Q&A input box ---------------------------------- >
    async clickPromptQuickRepliesBtn() {
        return await this.getPromptQuickRepliesBtn().click();
    }

    async clickPromptQuickRepliesByTitle(promptTitle) {
        return await this.getPromptQuickRepliesByTitle(promptTitle).click();
    }

    // < --------------------------- landing page -------------------------------------------------- >
    async clickPromptCardByTitle(promptTitle) {
        return await this.getPromptCardByByTitle(promptTitle).click();
    }

    async validatePromptCardDisplayed(promptTitle) {
        const card = await this.getPromptCardByByTitle(promptTitle);
        const loading = await this.getPromptCardLoadingByTitle(promptTitle);

        await this.waitForElementVisible(card, {timeout: 10000});

        if (await loading.isExisting()) {
            await this.waitForElementStaleness(loading, {
                timeout: 30000,
                msg: `Prompt card "${promptTitle}" is still loading.`,
            });
        }
    }

    
}
