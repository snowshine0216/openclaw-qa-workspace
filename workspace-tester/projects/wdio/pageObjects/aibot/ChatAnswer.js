import BaseComponent from '../base/BaseComponent.js';
import translations from '../../constants/translations.json' assert { type: 'json' };

export default class ChatAnswer extends BaseComponent {
    constructor(container, locator = 'Message Left', language = 'en') {
        super(container, locator, 'Chat Answer');
        this.translation = translations[language];
    }

    static createByText(text, language) {
        const el = new ChatAnswer(
            null,
            `//p[contains(normalize-space(.), '${text}')]/ancestor::div[@class="chat-bubble Bubble text full-message"]`,
            language
        );
        return el;
    }

    getCopyButton() {
        return this.getElement().$(`div[role='button'][aria-label='${this.translation.copy}']`);
    }

    getCopiedIndicator() {
        return this.getElement().$('div[role="button"][aria-label="Copied"]');
    }

    getDownloadButton() {
        return this.getElement().$(`div[role='button'][aria-label='${this.translation.download}']`);
    }

    getDownloadedIndicator() {
        return this.getElement().$('div[role="button"][aria-label="Downloaded"]');
    }

    getPinButton() {
        return this.getElement().$(`div[role='button'][aria-label='${this.translation.pin}']`);
    }

    getUnpinButton() {
        return this.getElement().$(`div[role='button'][aria-label='${this.translation.unpin}']`);
    }

    getMoreButton() {
        return this.getElement().$('.mstr-ai-chatbot-MoreButton');
    }

    getOpenedMoreButton() {
        return this.getElement().$('.mstr-ai-chatbot-MoreButton.isOpened');
    }

    async hoverOnAnswer() {
        await this.hover({ elem: await this.getElement() });
    }

    async hoverAndGetTooltip(e) {
        await this.hoverOnAnswer();
        await this.hover({ elem: e });
        const tooltip = await this.getChatbotToolTip();
        await this.waitForElementVisible(tooltip);
        return tooltip;
    }

    async clickMoreButton() {
        await this.hoverOnAnswer();
        await this.click({ elem: this.getMoreButton() });
    }

    async clickDownloadButton() {
        await this.hoverOnAnswer();
        const moreBtn = await this.getMoreButton();
        if (await moreBtn.isExisting()) {
            await this.click({ elem: moreBtn });
        }
        await this.click({ elem: this.getDownloadButton() });
        await browser.waitUntil(
            async () => {
                const downloadedIndicator = await this.getDownloadedIndicator().isDisplayed();
                return downloadedIndicator;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Download snapshot no response',
            }
        );
    }

    async clickCopyButton() {
        await this.hoverOnAnswer();
        const moreBtn = await this.getMoreButton();
        if (await moreBtn.isExisting()) {
            await this.click({ elem: moreBtn });
        }
        await this.click({ elem: this.getCopyButton() });
        await browser.waitUntil(
            async () => {
                const copiedIndicator = await this.getCopiedIndicator().isDisplayed();
                return copiedIndicator;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Copy snapshot no response',
            }
        );
    }

    async clickPinButton() {
        await this.hoverOnAnswer();
        await this.click({ elem: this.getPinButton() });
        await browser.waitUntil(
            async () => {
                const unpinButton = await this.getUnpinButton().isDisplayed();
                return unpinButton;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Pin snapshot no response',
            }
        );
    }
}
