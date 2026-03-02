import BasePage from '../base/BasePage.js';
import MainTeams from './MainTeams.js';
import allureReporter from '@wdio/allure-reporter';

export default class Conversation extends BasePage {
    constructor() {
        super();
        this.mainTeams = new MainTeams();
    }

    getHeader() {
        return this.$('div[data-tid="app-layout-area--header"]');
    }

    getMoreButtonInHeader() {
        return this.getHeader().$(`button[data-tid='chat-header-more-menu-trigger']`);
    }

    getDeleteButtonInHeaderMenu() {
        return this.$(`div[data-tid='delete-chat-header-item']`);
    }

    getConfirmDeleteButton() {
        return this.$(`div[role=dialog] button[data-tid='delete-chat-confirm-button']`);
    }

    // Channel Tab
    getChannelTabList() {
        return this.$('div[role="tablist"]');
    }

    getRemoveTabButton() {
        return this.$('div[data-tid="data-tid-removeTab"]');
    }

    getRemoveTabConfirmButton() {
        return this.$('button#tab-remove-btn');
    }

    getTab(tabName) {
        return this.$(`//div[contains(text(), '${tabName}')]`);
    }

    isTabExist(tabName) {
        return this.$(`//div[contains(text(), '${tabName}')]`).isDisplayed();
    }

    // Chat Tab: Home, Library, About
    getTabInChat(tabName) {
        return this.$$(`[data-tid='entity-header'] [role='tab']`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText == tabName;
        })[0];
    }

    getAppDetailsDialog() {
        return this.$('div[data-tid="app-details-northstar-dialog"]');
    }

    // Post message
    getInputBox() {
        // return this.$('p[data-placeholder="Type a message"]');
        return this.$(`[placeholder="Type a message"] p`);
    }

    getStartPostButtonInChannel() {
        return this.$('button[data-tid="compose-start-post"]');
    }

    getPostMessageButtonInChannel() {
        return this.$('div[title="Post"]');
    }

    getPostMessageButtonInChat() {
        return this.$(`button[data-tid='sendMessageCommands-send'],button[data-tid='newMessageCommands-send']`);
    }

    getPostCardMessageButtonInChat() {
        return this.$('button[data-tid="newMessageCommands-send"]');
    }

    getSuggestionsPopover() {
        return this.$('ul[aria-label="Suggestions"]');
    }

    getBotsInSuggestions() {
        return this.$('li[aria-label="Get bots"]');
    }

    getSearchedBotInSuggestions(bot) {
        return this.$(`li[aria-label="${bot} Library for Microsoft Teams "]`);
    }

    // chat messages
    getAllChatMessages() {
        return this.$$('div[data-tid="chat-pane-message"]');
    }

    getReceivedChatMessages() {
        return this.$$('.fui-ChatMessage__body');
    }

    getLatestReceivedChatMessage() {
        return this.$(`.fui-ChatMessage__body[data-last-visible='true']`);
    }

    getNumberOfBotInWelcomeCard() {
        const lastMessage = this.getLatestReceivedChatMessage();
        return lastMessage.$$('.ac-container[role="row"]').length;
    }

    // channel message
    getMessageContainer() {
        return this.$$('div[data-tid="channel-pane-message"]');
    }

    // add/remove bot message
    getControlMessage() {
        return this.$$('div[data-tid="control-message-renderer"]');
    }

    getTypingAnimation() {
        return this.$('//span[text()=" Library is typing"]');
    }

    // add bot from conversation
    getSearchBotBox() {
        return this.$('input[aria-label="Search for bots"]');
    }

    getSearchResultsDivider() {
        return this.$('//span[contains(text(), "Search results for")]');
    }

    getUninstalledBot(bot) {
        return this.$$('button[data-inp="store-item"]').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.split('\n')[0] === bot;
        })[0];
    }

    getAddAppButton() {
        return this.$('button[data-tid="install-app-btn"]');
    }

    getMoreOptionsOfApps(appName) {
        const optionsButton = this.$(
            `//span[text()="${appName}"]//ancestor::div[@data-tid="installed-app-item" and contains(@class, "ui-list__item")]//button[@data-testid='manage-apps-item-content']`
        );
        return optionsButton;
    }

    getRemoveOption() {
        return this.$('//div//span[text()="Remove"]');
    }

    getRemoveBotButton() {
        return this.$('//button[text()="Remove"]');
    }

    getRemovedMessage() {
        return this.$$('//div[text()="App was removed"]')[1];
    }


    async getLatestResponse(isChannel) {
        const latestResponse = isChannel
            ? await this.getCardMessagesInLatestMessage()
            : await this.getLatestReceivedChatMessage();
        return latestResponse;
    }
    // get viz image from latest message
    async getVizImageInLatestMessage(isChannel = false) {
        const latestResponse = await this.getLatestResponse(isChannel);
        const card = await latestResponse.$('img');
        await this.waitForElementVisible(card);
        return card;
    }

    async getTagInLatestResponse(isChannel) {
        const response = await this.getLatestResponse(isChannel);
        const answer = await response.$('div[aria-label="Opens card"]');
        return answer.getText();
    }

    // message actions like thumbs up, reply, etc.
    getMessageActionToolbar() {
        return this.$(`div[data-tid='message-actions-container']`);
    }

    getReplyMessageButton() {
        // return this.$(`//*[contains(@title, 'Reply')]`);
        return this.$(`//*[@data-tid='message-actions-quoted-reply']`);
    }

    getMoreButtonOfMessage() {
        return this.getMessageActionToolbar().$(`[data-tid='message-actions-more']`);
    }

    // function
    // tab
    async waitForTabAppear(tabName) {
        await this.waitForElementVisible(this.getTab(tabName));
    }

    async chooseTab(tabName) {
        if (await this.isTabExist(tabName)) {
            await this.click({ elem: this.getTab(tabName) });
        }
    }

    async removeDossiersTab(dossierNames) {
        await browser.switchToFrame(null);
        for (let i = 0; i < dossierNames.length; i++) {
            var tabName = dossierNames[i];
            if (await this.isTabExist(tabName)) {
                console.log(`found target dossier tab ${tabName}, remove it`);
                const button = await this.getTab(tabName);
                await this.removeTab(button);
            }
        }
    }

    async removeTab(tab) {
        await this.waitForElementVisible(tab);
        if ((await tab.getAttribute('aria-selected')) === 'false') {
            console.log('Tab is not selected, click to select it');
            await tab.click();
            await browser.pause(1000);
        }
        await this.rightClick({ elem: tab });
        const removeTab = await this.getRemoveTabButton();
        await this.waitForElementVisible(removeTab);
        await removeTab.click();
        const confirmClose = await this.getRemoveTabConfirmButton();
        await this.waitForElementVisible(confirmClose);
        await confirmClose.click();
    }

    async isTabSelectedInTeamsChannel(tabName, teamsName, channelName) {
        // ensure the target channel is opened
        if (!(await this.isChannelOpened(channelName))) {
            await this.mainTeams.switchToTeamsChannel({ team: teamsName, channel: channelName });
        }
        if (await this.isTabExist(tabName)) {
            const tab = await this.getTab(tabName);
            return (await tab.getAttribute('aria-selected')) === 'true';
        } else {
            console.log(`Tab ${tabName} not found`);
            return false;
        }
    }

    async openPinnedTab({ team, channel, tab }) {
        await this.switchToAppInSidebar('Teams');
        await this.mainTeams.switchToTeamsChannel({ team, channel });
        await this.waitForTabAppear(tab);
        await this.chooseTab(tab);
    }

    async isChannelOpened(channelName) {
        const channelHeader = await this.getHeader();
        return (await channelHeader.getText()).includes(channelName);
    }

    async cleanDossierTabsinChannel(teamName, channelName) {
        await this.mainTeams.switchToTeamsChannel({ team: teamName, channel: channelName });
        let i = 2;
        const tablist = await this.getChannelTabList();
        let buttons = await tablist.$$('button');
        let dossierTabCount = buttons.length - 3;
        let totalTabCount = buttons.length;
        let removedTabCount = 0;
        if ((await buttons[totalTabCount - 2].getText()).match(/\+\d/)) {
            dossierTabCount =
                dossierTabCount + parseInt((await buttons[totalTabCount - 2].getText()).replace('+', '')) - 1;
        }
        // the last button is the add tab button
        while (removedTabCount < dossierTabCount) {
            if ((await buttons[i].getText()).length > 0) {
                await this.removeTab(buttons[i]);
                removedTabCount++;
            }
            buttons = await tablist.$$('button');
        }
    }

    // Chat tab
    async switchToTabInChat(tabName) {
        await this.click({ elem: this.getTabInChat(tabName) });
    }
    // message in chat
    async getChatMessageByIndex(index) {
        const messages = await this.getAllChatMessages();
        const count = messages.length;
        return this.getAllChatMessages()[count - index];
    }

    async getLatestChatMessage() {
        const latestMessage = await this.getChatMessageByIndex(1);
        return latestMessage;
    }
    async getBotNameOnLatestMessage(isChannel = false) {
        const latestResponse = await this.getLatestResponse(isChannel);
        const name = await latestResponse.$$('.ac-container');
        const i = isChannel ? '2' : '1';
        return await name[i].getText();
    }
    
    async getBotNameOnLatestMessageV2(isChannel = false) {
        const latestResponse = await this.getLatestResponse(isChannel);
        const name = await latestResponse.$$('.ac-container');
        const i = isChannel ? '0' : '1';
        return await name[i].$('.ac-container:last-of-type').getText();
    }

    async getViewAllBotsButtonByIndex(index = 1) {
        const messageContainerByIndex = await this.getChatMessageByIndex(index);
        return messageContainerByIndex.$(`button[aria-label='View all bots']`);
    }

    async getViewAllAgentsButtonByIndex(index = 1) {
        const messageContainerByIndex = await this.getChatMessageByIndex(index);
        return messageContainerByIndex.$(`button[aria-label='View all agents']`);
    }

    async getViewMoreButtonByIndex(index = 1) {
        const messageContainerByIndex = await this.getChatMessageByIndex(index);
        return messageContainerByIndex.$(`button[aria-label='View More']`);
    }

    async getViewMoreMessageOfLatestMessage() {
        const latestMessage = await this.getLatestChatMessage();
        const img = await latestMessage.$('img');
        return await img.nextElement('.ac-textBlock').getText();
    }

    // share bot/dashboard in chat
    async getTextInLatestMessage() {
        const latestMessage = await this.getLatestChatMessage();
        const text = await latestMessage.$('p').getText();
        return text;
    }

    async getLinkInLatestMessage() {
        const latestMessage = await this.getLatestChatMessage();
        const link = await latestMessage.$('a[aria-label*=Link]').getText();
        return link;
    }

    // message extension card for both chat and channel
    async getLatestMessageExtensionCard() {
        const messages = await this.$$('.ac-adaptiveCard');
        const count = messages.length;
        return messages[count - 1];
    }

    async getOpenInTeamsButtonInLatestExtensionCard() {
        const message = await this.getLatestMessageExtensionCard();
        const buttons = await message.$$('button');
        return buttons[0];
    }

    async getOpenInWebButtonInLatestMessageExtensionCard() {
        const message = await this.getLatestMessageExtensionCard();
        const buttons = await message.$$('button');
        return buttons[1];
    }

    async getCoverImageInLatestMessageExtensionCard() {
        const latestMessage = await this.getLatestMessageExtensionCard();
        const uiImages = await latestMessage.$$('.ac-container')[1];
        return uiImages;
    }

    async isVizSizeCorrectInLatestAnswer(isChannel = false) {
        //ensure viz render
        const style = await (await this.getVizImageInLatestMessage(isChannel)).getAttribute('style');
        return style.includes('width: 600px;') && style.includes('height: 300px;');
    }

    async openLatestObjectFromMessageExtensionInTeams() {
        await browser.switchToFrame(null);
        await this.click({ elem: await this.getOpenInTeamsButtonInLatestExtensionCard() });
        await this.sleep(1000);
    }

    async openLatestObjectFromMessageExtensionInWeb() {
        await browser.switchToFrame(null);
        await this.click({ elem: await this.getOpenInWebButtonInLatestMessageExtensionCard() });
    }

    // channel
    async getLastestMessageContainer() {
        const messageContainers = await this.getMessageContainer();
        const count = messageContainers.length;
        return messageContainers[count - 1];
    }

    async getResponseInLatestMessage() {
        const latestMessageContainer = await this.getLastestMessageContainer();
        const response = await latestMessageContainer.$('div[data-tid="response-surface"]');
        await this.waitForElementVisible(response);
        return response;
    }

    async getCardMessagesInLatestMessage() {
        const latestMessage = await this.getResponseInLatestMessage();
        await this.waitForElementVisible(latestMessage);
        const cardMessages = await latestMessage.$('.ac-adaptiveCard');
        return cardMessages;
    }

    async getTextInLatestCardMessage() {
        const lastCard = await this.getCardMessagesInLatestMessage();
        const text = await lastCard.$('.ac-textBlock').$('p').getText();
        return text;
    }

    // non-card response in channel
    async getTextInLatestResponse() {
        const latestMessage = await this.getResponseInLatestMessage();
        await this.waitForElementVisible(latestMessage);
        const messages = await latestMessage.$('p').getText();
        return messages;
    }

    async getLatestControlMessage() {
        const controlMessages = await this.getControlMessage();
        const count = controlMessages.length;
        const text = controlMessages[count - 1].getText();
        return text;
    }

    //ask question in 1-1 chat
    async askQuestions(question) {
        await this.getInputBox().addValue(question);
        await this.sleep(1000);
        await this.click({ elem: this.getPostMessageButtonInChat() });
    }

    /**
     * Check answer arrivial by total message count is not stabile since when entering chat mode, the total message count
     * will be inconsistent time to time.
     * So we need to check the timestamp of the last message to make sure the new answer is sent.
     */
    async askQuestionsByWaiting({ question, isChannel = false, mention }) {
        const lastMessageTimestamp = await this.getTimestampOfLastMessage(isChannel);
        if (mention) {
            await this.askQuestionsWithMention({ question, mention, isChannel });
            allureReporter.addStep(`ask question ${question} and mention ${mention} in channel`);
        } else {
            await this.askQuestions(question);
            allureReporter.addStep(`ask question ${question}, isChannel is ${isChannel}`);
        }
        await this.waitForAnswerReady({ timestamp: lastMessageTimestamp, isChannel });
    }

    async askQuestionsWithMention({ question = 'hi', mention = 'Library', isChannel = false }) {
        let startAPostButton = await this.getStartPostButtonInChannel().isDisplayed();
        const postButton = isChannel ? this.getPostMessageButtonInChannel() : this.getPostMessageButtonInChat();
        if (startAPostButton && isChannel) {
            await this.click({ elem: this.getStartPostButtonInChannel() });
        }
        await this.click({ elem: this.getInputBox() });
        // this.getInputBox().addValue('@' + mention); might not trigger Teams app selector in some cases
        await this.getInputBox().addValue('@');
        await this.sleep(500);
        await this.getInputBox().addValue(mention);
        try {
            await this.waitForElementVisible(this.getSuggestionsPopover(), { timeout: 5000 });
        } catch (error) {
            console.log('Suggestion popover does not appear within 5 seconds.');
            await this.click({ elem: postButton });
            if (startAPostButton && isChannel) {
                await this.click({ elem: this.getStartPostButtonInChannel() });
            }
            await this.click({ elem: this.getInputBox() });
            await this.getInputBox().addValue('@' + mention);
        }
        await this.waitForElementVisible(this.getSuggestionsPopover());
        await this.waitForElementVisible(this.getSearchedBotInSuggestions(mention));
        await this.click({ elem: this.getSearchedBotInSuggestions(mention) });
        await this.getInputBox().addValue(' ' + `${question}`);
        await this.sleep(1000);
        await this.click({ elem: postButton });
    }

    async waitForMessageInAnswer(expectText, flag = true) {
        await this.waitForElementVisible(await this.getLatestReceivedChatMessage());
        await browser.waitUntil(
            async () => {
                const actualText = await this.getLatestReceivedChatMessage().getText();
                return (expectText === actualText) === flag;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Text '${expectText}' is displayed = ${flag}, after ${this.DEFAULT_LOADING_TIMEOUT}ms!`,
            }
        );
    }

    async waitForNewAnswerarrival({ timestamp, isChannel }) {
        await browser.waitUntil(
            async () => {
                const actual = await this.getTimestampOfLastMessage(isChannel);
                return actual !== timestamp;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Latest answer is not shown, timestamp is always ${timestamp} after ${this.DEFAULT_LOADING_TIMEOUT}ms!`,
            }
        );
    }

    async waitForNewControlMessageArrival({ timestamp }) {
        await this.waitForElementVisible(this.getInputBox());
        await browser.waitUntil(
            async () => {
                const actual = await this.getTimestampOfLastControlMessage();
                return actual !== timestamp;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Latest control message is not shown, timestamp is always ${timestamp} after ${this.DEFAULT_LOADING_TIMEOUT}ms!`,
            }
        );
    }

    async waitForWelcomePage({ currentCount }) {
        await this.waitForNewAnswerarrival({ currentCount, isChannel: false });
        await this.waitForElementVisible(await this.getViewAllBotsButtonByIndex());
    }

    async waitForAnswerReady({ timestamp, isChannel }) {
        await this.waitForNewAnswerarrival({ timestamp, isChannel });
        await this.sleep(1000);
        return this.getTimestampOfLastMessage(isChannel);
    }

    async addBotFromConversation({ bot, isChannel = false }) {
        let startAPostButton = await this.getStartPostButtonInChannel().isDisplayed();
        if (startAPostButton && isChannel) {
            await this.click({ elem: this.getStartPostButtonInChannel() });
        }
        await this.getInputBox().addValue('@');
        await this.click({ elem: this.getBotsInSuggestions() });
        await this.getSearchBotBox().addValue(bot);
        await this.waitForElementVisible(await this.getSearchResultsDivider());
        await this.click({ elem: this.getUninstalledBot(bot) });
        await this.click({ elem: this.getAddAppButton() });
        await browser.waitUntil(
            async () => {
                const message = await this.getLatestControlMessage();
                return message === 'bot added Library here.';
            },
            {
                timeout: 10000,
                timeoutMsg: `Add bot message not appears after 10s`,
            }
        );
    }

    async removeBot({ conversation, isChannel = false }) {
        if (isChannel) {
            await this.rightClick({ elem: this.mainTeams.getTeam(conversation) });
            await this.click({ elem: this.mainTeams.getItemInCoversationMenu('Manage team') });
            await this.sleep(1000);
            await this.click({ elem: this.getTabInChat('Apps') });
        } else {
            await this.rightClick({ elem: this.mainTeams.getConversation(conversation) });
            await this.click({ elem: this.mainTeams.getItemInCoversationMenu('Manage apps') });
        }
        const isInstalled = await this.getMoreOptionsOfApps(browsers.params.teamsAppName).isDisplayed();
        if (isInstalled) {
            await this.click({ elem: this.getMoreOptionsOfApps(browsers.params.teamsAppName) });
            await this.click({ elem: this.getRemoveOption() });
            await this.click({ elem: this.getRemoveBotButton() });
            await this.waitForElementVisibleInTeams(this.getRemovedMessage());
        }
        return isInstalled;
    }

    async getTotalReceivedMessageCount() {
        return this.getReceivedChatMessages().length;
    }

    async getMessageContainerCount() {
        return this.getMessageContainer().length;
    }

    async getTimestampOfLastMessage(isChannel = false) {
        const totalReceivedMessages = isChannel
            ? await this.getMessageContainerCount()
            : await this.getTotalReceivedMessageCount();
        if (totalReceivedMessages === 0) return '';
        const x = isChannel
            ? await this.getResponseInLatestMessage()
            : await this.getReceivedChatMessages()[totalReceivedMessages - 1];
        await this.waitForElementVisible(x);
        const timestamp = isChannel
            ? await x.$('div[data-testid="message-body-flex-wrapper"]').getAttribute('data-mid')
            : await x.getAttribute('data-mid');
        return timestamp;
    }

    async getTimestampOfLastControlMessage() {
        const totalControlMessages = await this.getControlMessage().length;
        if (totalControlMessages === 0) return '';
        const x = await this.getControlMessage()[totalControlMessages - 1];
        await this.waitForElementVisible(x);
        const timestamp = await x.getAttribute('data-mid');
        return timestamp;
    }

    async waitForChatTabLoaded(chatName) {
        await browser.waitUntil(
            async () => {
                const chatHeaderName = await this.getHeader().getText();
                return chatHeaderName.includes(chatName);
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Chat ${chatName} is not loaded after ${this.DEFAULT_LOADING_TIMEOUT}ms!`,
            }
        );
    }

    /**
     * Click the "View all bots" button in the latest message container
     */
    async clickViewAllBotsButtonOfLatestMessage() {
        await this.waitForElementVisible(await this.getViewAllBotsButtonByIndex());
        await this.click({ elem: await this.getViewAllBotsButtonByIndex() });
    }

    async clickViewAllAgentsButtonOfLatestMessage() {
        await this.waitForElementVisible(await this.getViewAllAgentsButtonByIndex());
        await this.click({ elem: await this.getViewAllAgentsButtonByIndex() });
    }

    async clickViewMoreButtonOfLatestMessage() {
        await this.waitForElementVisible(await this.getViewMoreButtonByIndex());
        await this.click({ elem: await this.getViewMoreButtonByIndex() });
    }

    async clearChatHistory() {
        await this.click({ elem: this.getMoreButtonInHeader() });
        const isDisplayed = await this.getDeleteButtonInHeaderMenu().isDisplayed();
        if (isDisplayed) {
            await this.click({ elem: this.getDeleteButtonInHeaderMenu() });
            await this.click({ elem: this.getConfirmDeleteButton() });
        }
    }

    async replyMessageByIndex({ idx, isQuestion = false }) {
        const item = await this.getChatMessageByIndex(idx);
        await item.scrollIntoView({ block: 'end', inline: 'center' });
        await this.sleep(1000); // wait for annimation finished
        await this.click({ elem: item });
        if (isQuestion) {
            await this.click({ elem: this.getMoreButtonOfMessage() });
        }
        await this.click({ elem: this.getReplyMessageButton() });
        allureReporter.addStep(`reply message by index ${idx}, isQuestion is ${isQuestion}`);
        const lastMessage = await this.getLatestChatMessage();
        await lastMessage.scrollIntoView({ block: 'center', inline: 'center' });
        await this.sleep(1000); // wait for annimation finished
    }
}
