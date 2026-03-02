import AIBotChatPanel from './AIBotChatPanel.js';
import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import LibraryPage from '../library/LibraryPage.js';

export default class HisoryPanel extends BasePage {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.aiBotChatPanel = new AIBotChatPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
    }

    // Locator
    get historyPanel() {
        return this.$('.mstr-ai-chatbot-MainView-historiesContainer');
    }

    get historyPanelSearchInput() {
        return this.$(`//div[@class = 'mstr-ai-chatbot-SearchBox']//input`);
    }

    get chatList() {
        return this.$('.mstr-ai-chatbot-HistoriesPanelContent-chatList');
    }

    get allChats(){
        return this.$$('.mstr-ai-chatbot-HistoriesPanelContent-chat');
    }

    // e.g. Yesterday, Today, Previous 30 days
    getChatCategoryByName(name) {
        return this.$(`//button[@class = 'mstr-ai-chatbot-Collapsible-trigger' and text() = '${name}']`);
    }

    getChatByName(name) {
        return this.$(`//span[text()= '${name}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-HistoriesPanelContent-chat ')]`);
    }

    getChatByPartialName(partialName) {
        return this.$(`//span[contains(text(), '${partialName}')]/ancestor::div[contains(@class, 'mstr-ai-chatbot-HistoriesPanelContent-chat ')]`);
    }

    getChatContextMenuBtn(name) {
        return this.getChatByName(name).$(`.//button[@class = 'IconButton']`);
    }

    get chatContextMenu() {
        return this.$(`//div[contains(@class, 'HistoriesPanelContent-chat-menu-content')]`);
    }

    // e.g. Rename, Delete
    getChatContextMenuItem(btnName) {
        return this.chatContextMenu.$(`.//div[contains(@class, 'HistoriesPanelContent-chat-menu-item') and text()='${btnName}']`);
    }

    get closeBtn(){
        return this.$('.mstr-ai-chatbot-HistoriesPanel-close');
    }

    get clearSearchBtn(){
        return this.$('.mstr-ai-chatbot-SearchBox-clear');
    }

    get currentChat(){
        return this.$('.mstr-ai-chatbot-HistoriesPanelContent-chat.current')
    }

    get currentChatContextMenuBtn(){
        return this.currentChat.$('.IconButton')
    }

    get deleteChatConfirmationDialog(){
        return this.$('.mstr-ai-chatbot-ConfirmationButton-dialog')
    }

    get deleteChatYesBtn(){
        return this.deleteChatConfirmationDialog.$('.mstr-ai-chatbot-ConfirmationButton-confirm')
    }

    // Action
    async switchToChat(name) {
        await this.click({ elem: this.getChatByName(name) });
    }

    async clickChatContextMenuBtn(name) {
        await this.hover({ elem: this.getChatByName(name)});
        const btn = await this.getChatContextMenuBtn(name);
        await this.waitForElementVisible(btn);
        await this.click({ elem: btn });
    }

    async clickChatContextMenuItem(btnName) {
        await this.click({ elem: this.getChatContextMenuItem(btnName) });
    }

    async closeChatHistoryPanel() {
        await this.click({ elem: this.closeBtn });
        await this.waitForElementInvisible(this.historyPanel);
    }

    async deleteChat(name) {
        await this.clickChatContextMenuBtn(name);
        await this.waitForElementVisible(this.chatContextMenu);
        await this.clickChatContextMenuItem('Delete');
        await this.waitForElementVisible(this.deleteChatConfirmationDialog);
        await this.click({ elem: this.deleteChatYesBtn });
        await this.waitForElementInvisible(this.getChatByName(name));
    }

    async deleteCurrentChat() {
        await this.hover({ elem: this.currentChat});
        const btn = await this.currentChatContextMenuBtn;
        await this.waitForElementVisible(btn);
        await this.click({ elem: btn });
        await this.waitForElementVisible(this.chatContextMenu);
        await this.clickChatContextMenuItem('Delete');
        await this.waitForElementVisible(this.deleteChatConfirmationDialog);
        await this.click({ elem: this.deleteChatYesBtn });
    }

    async deleteChatByIndex(index) {
        const chats = await this.allChats;
        const chatEl = chats[index];

        await this.hover({ elem: chatEl});
        const contextMenuBtn = await chatEl.$('.IconButton');
        await this.waitForElementVisible(contextMenuBtn);
        await this.click({ elem: contextMenuBtn });
        await this.waitForElementVisible(this.chatContextMenu);
        await this.clickChatContextMenuItem('Delete');
        await this.waitForElementVisible(this.deleteChatConfirmationDialog);
        await this.click({ elem: this.deleteChatYesBtn });
        await this.waitForElementInvisible(chatEl);
    }

    async renameChat(oldaName, newName) {
        await this.clickChatContextMenuBtn(oldaName);
        await this.waitForElementVisible(this.chatContextMenu);
        await this.clickChatContextMenuItem('Rename');
        await this.typeKeyboard(newName);
        await this.enter();
        await this.getChatByName(newName).waitForDisplayed();
    }

    async searchChat(searchText) {
        const searchBox = await this.historyPanelSearchInput;
        await searchBox.setValue(searchText);
        await this.enter();
        await this.sleep(1000);
    }

    async clickChatCategoryHeader(name) {
        await this.click({ elem: this.getChatCategoryByName(name) });
    }

    async clearChatSearch() {
        await this.click({ elem: this.clearSearchBtn });
        await this.sleep(1000);
    }

    async getChatCount() {
        return (await this.allChats).length;
    }

    // Assertion
    async isHistoryPanelPresent() {
        return this.historyPanel.isDisplayed();
    }

    async isChatCatgeoryPresent(name) {
        return this.getChatCategoryByName(name).isDisplayed();
    }

    async isChatPresent(name) {
        return this.getChatByName(name).isDisplayed();
    }

    async isChatPartialNamePresent(partialName) {
        return this.getChatByPartialName(partialName).isDisplayed();
    }

    async isChatCategoryOpen(name) {
        const el = await this.getChatCategoryByName(name);
        const state = await el.getAttribute('data-state');
        return state === 'open';
    }

    async isChatCurrent(name) {
        const chat = await this.getChatByName(name);
        const chatClass = await chat.getAttribute('class');
        return chatClass.includes('current');
    }
}
