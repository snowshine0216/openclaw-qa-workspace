import BasePage from '../base/BasePage.js';

export default class RWDAuthoringPage extends BasePage {
    getRwdIframe() {
        return this.$('iframe.mstrd-RwdEditPage, iframe[class*="mstrd-RwdEditPage"]');
    }

    getTemplateByName(templateName) {
        return this.$(`//*[normalize-space(text())='${templateName}']`);
    }

    getAddDatasetButton() {
        return this.$('#tbDatasetNew2Button');
    }

    getDatasetDialogItemByName(reportName) {
        return this.$(`//*[normalize-space(text())='${reportName}']`);
    }

    getDatasetDialogSearchInput() {
        return this.$('.mstrTextBoxWithIconCellInput input');
    }

    getDatasetDialogSearchButton() {
        return this.$('.mstrTextBoxWithIconCellIcon input[type="button"]');
    }

    getFloatingEditorConfirmButton() {
        return this.$$('.mstrFloatingEditorCellButtonBar .mstrButton')[0];
    }

    getPromptEditor() {
        return this.$('#mstrdossierPromptEditor, .mstrdossierPromptEditor, .mstrPromptEditor');
    }

    getPromptRunButton() {
        return this.$('.mstrPromptEditorButtonRun');
    }

    getDatasetTree() {
        return this.$('.mstrTree');
    }

    getFileMenuButton() {
        return this.$('[data-feature-id="document-authoring-menubar-file"]');
    }

    getSaveMenuItem() {
        return this.$('.mnu-dSave');
    }

    getCloseMenuItem() {
        return this.$('.mnu-close');
    }

    getSaveDialog() {
        return this.$('#mstr-rwd-save-as-editor');
    }

    getSaveNameInput() {
        return this.getSaveDialog().$('.mstrmojo-SaveAsEditor-nameInput');
    }

    getSaveDialogHotOkButton() {
        return this.getSaveDialog().$('.mstrmojo-WebButton.okButton.hot');
    }

    getOverwriteDialog() {
        return this.$('.mstrmojo-alert');
    }

    getOverwriteDialogHotOkButton() {
        return this.getOverwriteDialog().$('.mstrmojo-WebButton.hot');
    }

    getAuthoringCloseMenuItem() {
        return this.$('.mstrd-RwdAuthoringCloseMenuItem');
    }

    getToolbarFourthTabRightMenuButton() {
        return this.$('#ribbonToolbarTabsListContainer > div:nth-child(4) .right.menu');
    }

    async getFirstVisibleMenuOption() {
        const menuOptions = await this.$$('.mstrMenuOption');
        for (const menuOption of menuOptions) {
            const visible = await menuOption
                .isDisplayed()
                .catch(() => false);
            if (visible) {
                return menuOption;
            }
        }
        return null;
    }

    getPromptRemoveAllButton() {
        return this.$('.mstrBGIcon_tbRemoveAll');
    }

    async clickWithFallbackAndVerifyAdvance({
        elementGetter,
        advanceCondition,
        actionLabel,
        timeout = 3000,
        interval = 200,
    }) {
        await this.waitForElementClickable(elementGetter(), {
            msg: `${actionLabel} was not clickable.`,
        });

        await elementGetter().click();

        let advanced = await browser
            .waitUntil(async () => advanceCondition(), { timeout, interval })
            .then(() => true)
            .catch(() => false);
        if (advanced) {
            return;
        }

        await this.clickByForce({ elem: elementGetter() });
        advanced = await browser
            .waitUntil(async () => advanceCondition(), { timeout, interval })
            .then(() => true)
            .catch(() => false);
        if (advanced) {
            return;
        }

        await this.clickOnElementByInjectingScript(elementGetter());

        await browser.waitUntil(async () => advanceCondition(), {
            timeout,
            interval,
            timeoutMsg: `${actionLabel} did not complete within ${timeout} ms.`,
        });
    }

    async waitForRwdIframeAndSwitch() {
        await browser.switchToFrame(null);
        await this.waitForElementVisible(this.getRwdIframe(), { msg: 'RWD iframe was not displayed.' });
        await browser.switchToFrame(await this.getRwdIframe());
    }

    async switchBackToMainContext() {
        await browser.switchToFrame(null);
    }

    async selectTemplate(templateName = '01 Blank Interactive Document') {
        const template = this.getTemplateByName(templateName);
        await this.waitForElementVisible(template, { msg: `Template "${templateName}" was not displayed.` });
        await this.waitForElementClickable(template, { msg: `Template "${templateName}" was not clickable.` });
        await this.click({ elem: template });
    }

    async waitForRwdDocumentReadyInFrame() {
        await this.waitForElementVisible(this.getAddDatasetButton(), {
            msg: 'RWD document was not ready for dataset insertion.',
        });
        await this.waitForElementClickable(this.getAddDatasetButton(), {
            msg: 'Add dataset button was not clickable.',
        });
    }

    async addDatasetInRwdFrame(reportName = 'rwd_prompt_report') {
        await this.waitForRwdDocumentReadyInFrame();
        await this.click({ elem: this.getAddDatasetButton() });

        await this.waitForElementVisible(this.getDatasetDialogSearchInput(), {
            msg: 'Dataset dialog search input was not displayed.',
        });
        await this.clear({ elem: this.getDatasetDialogSearchInput() });
        await this.getDatasetDialogSearchInput().setValue(reportName);
        await this.waitForTextPresentInElementValue(this.getDatasetDialogSearchInput(), reportName, {
            msg: 'Dataset dialog search input value was not set correctly.',
        });
        await this.waitForElementClickable(this.getDatasetDialogSearchButton(), {
            msg: 'Dataset dialog search button was not clickable.',
        });
        await this.click({ elem: this.getDatasetDialogSearchButton() });

        const reportItem = this.getDatasetDialogItemByName(reportName);
        await this.waitForElementVisible(reportItem, { msg: `Report "${reportName}" was not displayed.` });
        await this.waitForElementClickable(reportItem, { msg: `Report "${reportName}" was not clickable.` });
        await this.click({ elem: reportItem });

        const confirmButton = this.getFloatingEditorConfirmButton();
        await this.waitForElementVisible(confirmButton, {
            msg: 'Floating editor confirm button was not displayed.',
        });
        await this.waitForElementClickable(confirmButton, {
            msg: 'Floating editor confirm button was not clickable.',
        });
        await this.clickAndNoWait({ elem: confirmButton });
    }

    async runPromptFromEditor() {
        await this.switchBackToMainContext();
        const runButtonExists = await this.getPromptRunButton()
            .isExisting()
            .catch(() => false);
        const promptVisible = await this.getPromptEditor()
            .isDisplayed()
            .catch(() => false);
        const iframeVisibleBefore = await this.getRwdIframe()
            .isDisplayed()
            .catch(() => false);

        if (iframeVisibleBefore && !runButtonExists && !promptVisible) {
            const promptOrRunAppeared = await browser
                .waitUntil(
                    async () => {
                        const delayedRunExists = await this.getPromptRunButton()
                            .isExisting()
                            .catch(() => false);
                        const delayedPromptVisible = await this.getPromptEditor()
                            .isDisplayed()
                            .catch(() => false);
                        return delayedRunExists || delayedPromptVisible;
                    },
                    { timeout: 5000, interval: 200 }
                )
                .then(() => true)
                .catch(() => false);
            if (!promptOrRunAppeared) {
                return;
            }
        }

        await this.waitForElementVisible(this.getPromptRunButton(), { msg: 'Prompt run button was not displayed.' });
        await this.waitForElementClickable(this.getPromptRunButton(), { msg: 'Prompt run button was not clickable.' });

        await this.clickWithFallbackAndVerifyAdvance({
            elementGetter: () => this.getPromptRunButton(),
            actionLabel: 'runPromptFromEditor:run',
            timeout: 15000,
            advanceCondition: async () => {
                const promptStillVisible = await this.getPromptEditor()
                    .isDisplayed()
                    .catch(() => false);
                const frameVisible = await this.getRwdIframe()
                    .isDisplayed()
                    .catch(() => false);
                return !promptStillVisible || frameVisible;
            },
        });

        await browser.waitUntil(
            async () => {
                const promptStillVisible = await this.getPromptEditor()
                    .isDisplayed()
                    .catch(() => false);
                const iframeVisible = await this.getRwdIframe()
                    .isDisplayed()
                    .catch(() => false);
                return !promptStillVisible || iframeVisible;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Prompt run did not transition to next state.',
            }
        );
    }

    async verifyDatasetAttributesInTree(attributes) {
        await this.waitForElementVisible(this.getDatasetTree(), { msg: 'Dataset tree was not displayed.' });
        await browser.waitUntil(
            async () => {
                const treeText = await this.getDatasetTree().getText();
                return attributes.every((attribute) => treeText.includes(attribute));
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: `Expected attributes are not present in dataset tree: ${attributes.join(', ')}`,
            }
        );
    }

    async saveDocumentFromFileMenu(documentName) {
        await this.switchBackToMainContext();
        await this.waitForElementClickable(this.getFileMenuButton(), { msg: 'File menu button was not clickable.' });
        await this.click({ elem: this.getFileMenuButton() });

        await this.waitForElementClickable(this.getSaveMenuItem(), { msg: 'Save menu item was not clickable.' });
        await this.click({ elem: this.getSaveMenuItem() });

        await this.waitForElementVisible(this.getSaveDialog(), { msg: 'Save dialog was not displayed.' });
        await this.waitForElementVisible(this.getSaveNameInput(), { msg: 'Save name input was not displayed.' });
        await this.clear({ elem: this.getSaveNameInput() });
        await this.getSaveNameInput().setValue(documentName);
        await this.waitForTextPresentInElementValue(this.getSaveNameInput(), documentName, {
            msg: 'Save name input value was not set correctly.',
        });
        await this.waitForElementClickable(this.getSaveDialogHotOkButton(), {
            msg: 'Save confirmation hot button was not clickable.',
        });
        await this.clickWithFallbackAndVerifyAdvance({
            elementGetter: () => this.getSaveDialogHotOkButton(),
            actionLabel: 'saveDocumentFromFileMenu:hotOk',
            timeout: 15000,
            advanceCondition: async () =>
                (await this.getPromptEditor()
                    .isDisplayed()
                    .catch(() => false)) ||
                (await this.getOverwriteDialog()
                    .isDisplayed()
                    .catch(() => false)) ||
                !(await this.getSaveDialog()
                    .isDisplayed()
                    .catch(() => false)),
        });

        await browser.waitUntil(
            async () => {
                const promptVisible = await this.getPromptEditor()
                    .isDisplayed()
                    .catch(() => false);
                const overwriteVisible = await this.getOverwriteDialog()
                    .isDisplayed()
                    .catch(() => false);
                return promptVisible || overwriteVisible;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Neither prompt editor nor overwrite dialog appeared after saving.',
            }
        );

        const overwriteVisible = await this.getOverwriteDialog()
            .isDisplayed()
            .catch(() => false);
        if (overwriteVisible) {
            await this.clickWithFallbackAndVerifyAdvance({
                elementGetter: () => this.getOverwriteDialogHotOkButton(),
                actionLabel: 'saveDocumentFromFileMenu:overwriteHotOk',
                advanceCondition: async () =>
                    !(await this.getOverwriteDialog()
                        .isDisplayed()
                        .catch(() => false)),
            });
        }

        await this.waitForElementVisible(this.getPromptEditor(), {
            msg: 'Prompt editor did not appear after save/overwrite flow.',
        });
    }

    async closeDocumentFromFileMenu() {
        await this.switchBackToMainContext();
        await this.waitForElementClickable(this.getFileMenuButton(), { msg: 'File menu button was not clickable.' });
        await this.click({ elem: this.getFileMenuButton() });
        await this.waitForElementClickable(this.getCloseMenuItem(), { msg: 'Close menu item was not clickable.' });
        await this.click({ elem: this.getCloseMenuItem() });
    }

    async closeAuthoringPage() {
        await this.switchBackToMainContext();
        await this.waitForElementClickable(this.getAuthoringCloseMenuItem(), {
            msg: 'RWD authoring close button was not clickable.',
        });
        await this.click({ elem: this.getAuthoringCloseMenuItem() });
    }

    async openRepromptFromFourthMenu() {
        await this.waitForRwdIframeAndSwitch();
        await this.waitForElementClickable(this.getToolbarFourthTabRightMenuButton(), {
            msg: 'Fourth toolbar menu button was not clickable.',
        });
        await this.click({ elem: this.getToolbarFourthTabRightMenuButton() });
        await browser.waitUntil(async () => (await this.getFirstVisibleMenuOption()) !== null, {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            timeoutMsg: 'No visible menu option found for re-prompt.',
        });
        const firstVisibleMenuOption = await this.getFirstVisibleMenuOption();
        await this.waitForElementClickable(firstVisibleMenuOption, {
            msg: 'First visible menu option was not clickable.',
        });
        await this.click({ elem: firstVisibleMenuOption });
        await this.switchBackToMainContext();
        await this.waitForElementVisible(this.getPromptEditor(), {
            msg: 'Prompt editor was not displayed after opening re-prompt.',
        });
    }

    async removeAllSelectedObjectsInPrompt() {
        await this.switchBackToMainContext();
        await this.waitForElementClickable(this.getPromptRemoveAllButton(), {
            msg: 'Remove-all button was not clickable in prompt editor.',
        });
        await this.click({ elem: this.getPromptRemoveAllButton() });
    }
}
