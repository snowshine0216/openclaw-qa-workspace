import BaseComponent from '../base/BaseComponent.js';
import SnapshotCard from './SnapshotCard.js';
import translations from '../../constants/translations.json' assert { type: 'json' };

export default class SnapshotCategoryArea extends BaseComponent {
    constructor(container, locator = '.mstr-ai-chatbot-SnapshotCategoryArea', language = 'en') {
        super(container, locator, 'Snapshot Category Area');
        this.translation = translations[language];
    }

    static create(name, language = 'en') {
        return new SnapshotCategoryArea(
            null,
            `//button[contains(normalize-space(.), '${name}')]/ancestor::div[@class="mstr-ai-chatbot-SnapshotCategoryArea"]`,
            language
        );
    }

    isCollapsed() {
        return this.getSnapshotCatgoryAreaCollapseButton().getAttribute('aria-expanded') === 'false';
    }

    isExisting() {
        return this.getElement().isExisting();
    }

    isDisplayed() {
        return this.getElement().isDisplayed();
    }

    getSnapshotCategoryAreaMoreOpitionsButton() {
        return this.getElement().$(`button[aria-label='${this.translation.moreOptions}']`);
    }

    getSnapshotCatgoryAreaCollapseButton() {
        return this.getElement().$('//button[@class="mstr-ai-chatbot-Collapsible-trigger"]');
    }

    async clickCollapseButton() {
        await this.click({ elem: this.getSnapshotCatgoryAreaCollapseButton() });
    }

    getRenameInput() {
        return this.$('.mstr-ai-chatbot-SnapshotCategoryArea-titleInput');
    }

    async clickThreeDotsButton() {
        await this.click({ elem: this.getSnapshotCategoryAreaMoreOpitionsButton() });
        await browser.waitUntil(
            async () => {
                return this.getCategoryMenu().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Snapshot category menu button no response',
            }
        );
    }

    getCategoryMenu() {
        return this.$('.mstr-ai-chatbot-CategoryMenuButton-content');
    }

    async renameCategory(newName) {
        await this.clickThreeDotsButton();
        await this.click({ elem: this.getCategoryMenu().$('div=Rename') });
        await this.typeKeyboard(newName);
        await browser.keys('Enter');
    }

    getSnapshotCardInsideByText(text) {
        return SnapshotCard.createByText(text);
    }

    getNumberOfDisplayedSnapshotCard() {
        return this.getElement().$$('.mstr-ai-chatbot-SnapshotCard-content').length;
    }
}
