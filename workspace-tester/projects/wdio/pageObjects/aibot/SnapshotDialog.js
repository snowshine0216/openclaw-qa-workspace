import BasePage from '../base/BasePage.js';
import translations from '../../constants/translations.json' assert { type: 'json' };

export default class SnapshotDialog extends BasePage {
    constructor() {
        super();
        this.language = 'en';
        this.translation = translations[this.language];
    }

    setLanguage(language) {
        this.language = language;
        this.translation = translations[this.language];
    }

    getSnapshotDialog() {
        return this.$('.mstr-ai-chatbot-SnapshotFocusView');
    }

    getSnapshotDialogHeader() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-SnapshotFocusView-header');
    }

    getSnapshotDialogActionBar() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-SnapshotFocusView-rightHeader');
    }

    getCloseButton() {
        return this.getSnapshotDialog().$(`button[aria-label='${this.translation.close}']`);
    }

    getCopyButton() {
        return this.getSnapshotDialog().$(`div[role="button"][aria-label='${this.translation.copy}']`);
    }

    getInterpretationButton() {
        return this.getSnapshotDialog().$(`div[role="button"][aria-label='${this.translation.interpretation}']`);
    }

    getCopiedIndicator() {
        return this.getSnapshotDialog().$('div[role="button"][aria-label="Copied"]');
    }

    getDownloadButton() {
        return this.getSnapshotDialog().$(`div[role='button'][aria-label='${this.translation.download}']`);
    }

    getDownloadedIndicator() {
        return this.getSnapshotDialog().$('div[role="button"][aria-label="Downloaded"]');
    }

    getExportedIndicator() {
        return this.getSnapshotDialog().$('div[role="button"][aria-label="Exported"]');
    }

    getDeleteButton() {
        return this.getSnapshotDialog().$(`button[aria-label='${this.translation.delete}']`);
    }

    getSeeMoreButton() {
        return this.getSnapshotDialog().$(`button=${this.translation.seeMore}`);
    }

    getSeeLessButton() {
        return this.getSnapshotDialog().$(`button=${this.translation.seeLess}`);
    }

    getThumbdownIcon() {
        return this.getSnapshotDialog().$(`div[role='button'][aria-label='${this.translation.thumbdown}']`);
    }

    getSnapshotDialogViz() {
        return this.getSnapshotDialog().$('.mstrmojo-DocPanel ');
    }

    getInterpretationComponent() {
        return this.$('.mstr-ai-chatbot-ChatInterpretationComponent');
    }

    getLearningIndicator() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-AnswerBubbleLearningBadges');
    }

    getInterpretationRefLearning() {
        return this.getSnapshotDialog().$('mstr-ai-chatbot-CINuggetsContent');
    }

    getLearningTooltip() {
        return this.$('.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover');
    }

    getExportCSVButton() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-ExportToCsvButton');
    }

    getExportExcelButton() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-ExportToExcelButton');
    }

    async clickDownloadButton() {
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

    async clickExportCSVButton() {
        await this.click({ elem: this.getExportCSVButton() });
        await browser.waitUntil(
            async () => {
                return this.getExportedIndicator().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'export snapshot no response',
            }
        );
    }

    async clickExportExcelButton() {
        await this.click({ elem: this.getExportExcelButton() });
        await browser.waitUntil(
            async () => {
                return this.getExportedIndicator().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'export snapshot no response',
            }
        );
    }

    async clickCopyButton() {
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

    async clickCloseButton() {
        await this.click({ elem: this.getCloseButton() });
    }

    async clickDeleteButton() {
        await this.click({ elem: this.getDeleteButton() });
        await browser.waitUntil(
            async () => {
                return this.getConfirmDeleteDialog().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Delete snapshot no response',
            }
        );
    }

    getConfirmDeleteDialog() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-dialog');
    }

    getSavedTime() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-SnapshotFocusView-time');
    }

    async confirmDelete() {
        await this.click({ elem: this.getConfirmDeleteDialog().$(`button=${this.translation.yes}`) });
        await browser.waitUntil(
            async () => {
                return !(await (await this.getSnapshotDialog()).isExisting());
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Confirm delete snapshot no response',
            }
        );
    }

    async cancelDelete() {
        await this.click({ elem: this.getConfirmDeleteDialog().$(`button=${this.translation.no}`) });
        await browser.waitUntil(
            async () => {
                return !(await (await this.getConfirmDeleteDialog()).isExisting());
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Cancel delete snapshot no response',
            }
        );
    }

    async setSavedTime(value) {
        await browser.execute((value) => {
            const snapshotSavedTime = document.querySelector('.mstr-ai-chatbot-SnapshotFocusView-time');
            snapshotSavedTime.textContent = value;
        }, value);
    }

    async clickSeeMoreButton() {
        await this.click({ elem: this.getSeeMoreButton() });
        await browser.waitUntil(
            async () => {
                return this.getSeeLessButton().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'See more button no response',
            }
        );
    }

    async clickSeeLessButton() {
        await this.click({ elem: this.getSeeLessButton() });
        await browser.waitUntil(
            async () => {
                return this.getSeeMoreButton().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'See less button no response',
            }
        );
    }

    async clickInterpretationButton() {
        await this.click({ elem: this.getInterpretationButton() });
    }

    getLongContentButton() {
        return this.getSnapshotDialog().$('.mstr-ai-chatbot-CILongContent-button');
    }

    async clickLongContentButton() {
        await this.click({ elem: this.getLongContentButton() });
    }

    async isInterpretationComponentDisplayed() {
        return await this.getInterpretationComponent().isDisplayed();
    }

    async isThumbdownIconDisplayed() {
        return await this.getThumbdownIcon().isDisplayed();
    }

    async isLearningIndicatorDisplayed() {
        return await this.getLearningIndicator().isDisplayed();
    }

    async isRefLearningDisplayed() {
        return await this.getInterpretationRefLearning().isDisplayed();
    }

    async isSnapshotDialogDisplayed() {
        return await this.getSnapshotDialog().isDisplayed();
    }

    async clickLearningIndicator() {
        await this.click({ elem: this.getLearningIndicator() });
        await browser.waitUntil(
            async () => {
                return this.getLearningTooltip().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Learning tooltip no response',
            }
        );
    }

    async setInterpretationText(value) {
        await browser.execute((value) => {
            const InterpretationText = document.querySelector(
                '.mstr-ai-chatbot-Dialog-main .mstr-ai-chatbot-CIInterpretedAs-text > span'
            );
            InterpretationText.textContent = value;
        }, value);
    }
}
