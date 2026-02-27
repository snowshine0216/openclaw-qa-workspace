import BaseBotConfigTab from '../base/BaseBotConfigTab.js';
import { scrollElement, scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';
import RadioButton from '../selector/RadioButton.js';
export default class BotCustomInstruction extends BaseBotConfigTab {
    constructor() {
        super();
    }

    // Element locator

    getCustomInstructionsSwitch() {
        return this.$('.mstr-ai-chatbot-CustomInstruction-item .mstr-ai-chatbot-Switch-root');
    }

    getFiscalYearSettings() {
        return this.$('.mstr-ai-chatbot-FiscalYearSettings');
    }

    getFiscalYearSwitch() {
        return this.$('.mstr-ai-chatbot-FiscalYearSettings .mstr-ai-chatbot-Switch-root');
    }

    getInfoIndicator() {
        return this.$$('.mstr-icons-lib-icon.mstr-ai-chatbot-CustomInstruction-info-icon');
    }

    getEnabledInputBox(index) {
        return this.$$('.mstr-ai-chatbot-CustomInstruction-textarea:not([disabled])')[index];
    }

    getDisabledInputBox(index) {
        return this.$$('.mstr-ai-chatbot-CustomInstruction-textarea[disabled]')[index];
    }

    getInputAreas() {
        return this.$$('.mstr-ai-chatbot-CustomInstruction-instruction');
    }

    getBackgroundArea() {
        return this.getInputAreas()[0];
    }

    getFormatArea() {
        return this.getInputAreas()[1];
    }

    getCount(index) {
        return this.$$('.mstr-ai-chatbot-Textarea-word-count')[index].getText();
    }

    getKnowledgeSection() {
        return this.$('.mstr-ai-chatbot-knowledge-container');
    }

    getMissingFileWarningIcon() {
        return this.getKnowledgeSection().$('.mstr-ai-chatbot-knowledge-container-warning-icon');
    }

    // warning message in knowledge section
    // 1. Need privilege to upload knowledge.
    // 2. Lack "Read" access to view knowledge details.
    // 3. Lack 'Write' access or the privilege to re-upload the knowledge asset.
    // when execute warning exists, index should use 1
    getWarning(index = 0) {
        return this.$$('.mstr-ai-chatbot-WarningInfo-container')[index];
    }

    getWarningMessage(index = 0) {
        return this.getWarning(index).getText();
    }

    // 4. Lack "Execute" access to view knowledge details.
    getExecuteAclWarning() {
        return this.$('.mstr-ai-chatbot-collection-container-item-warning');
    }

    getExecuteAclWarningMessage() {
        return this.getExecuteAclWarning().getText();
    }

    getNuggetsItem(index = 0) {
        return this.getKnowledgeSection().$$('.mstr-ai-chatbot-collection-container-item')[index];
    }

    getNuggetName(index = 0) {
        return this.getNuggetsItem(index).$('.mstr-ai-chatbot-collection-container-name-left');
    }

    getDeleteIconOnNuggetsItem(index = 0) {
        return this.getNuggetsItem(index).$('.mstr-ai-chatbot-collection-container-delete-icon');
    }

    getConfirmDeleteContainer() {
        return this.$('.mstr-ai-chatbot-ConfirmationDialog');
    }

    getConfirmDeleteNuggetButton() {
        return this.getConfirmDeleteContainer().$$('.mstr-ai-chatbot-ConfirmationDialog-button')[0];
    }

    getConfirmCancelButton() {
        return this.getConfirmDeleteContainer().$$('.mstr-ai-chatbot-ConfirmationDialog-button')[1];
    }

    getNuggetsFileUploaderContainer() {
        return this.getKnowledgeSection().$('.mstr-ai-chatbot-FileUploader');
    }

    getNuggetsBrowserFileButton() {
        return this.getNuggetsFileUploaderContainer().$('.mstr-ai-chatbot-FileUploader-details-text-button');
    }

    getCollectionItem(index = 0) {
        return this.$$('.mstr-ai-chatbot-collection-container').filter(async (elem) => {
            const isDisplayed = await elem.isDisplayed();
            return isDisplayed;
        })[index];
    }

    getNuggetFileReuploadInput(index = 0) {
        return this.getCollectionItem(index).$('input[type="file"]');
    }

    getNuggetFileUploadInput() {
        return this.getNuggetsFileUploaderContainer().$('input#ai-chatbot-file-uploader');
    }

    getReuploadFileButton(index = 0) {
        return this.getCollectionItem(index).$('.mstr-ai-chatbot-collection-container-reupload-container');
    }

    getUploadedFileNameInCollectionItem(index = 0) {
        return this.getCollectionItem(index).$('.mstr-ai-chatbot-collection-container-name');
    }

    getUploadedFileProgressContainer(index = 0) {
        return this.getCollectionItem(index).$('.mstr-ai-chatbot-collection-container-progress-container');
    }

    getNuggetProgressErrorIcon(index = 0) {
        return this.getCollectionItem(index).$('.error-icon');
    }

    getKnowledgeContainerDescription(index = 0) {
        return this.$$('.mstr-ai-chatbot-knowledge-container-description')[index];
    }

    getKnowledgeContainerDescriptionTitle() {
        return this.getKnowledgeContainerDescription()
            .$('.mstr-ai-chatbot-knowledge-container-description-title')
            .getText();
    }

    getKnowledgeContainerDescriptionMessage() {
        return this.getKnowledgeContainerDescription()
            .$('.mstr-ai-chatbot-knowledge-container-description-body')
            .getText();
    }

    // --- below are for download learning section ---
    getDownloadLearningSection() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings');
    }

    getDownloadLearningTitle() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-title');
    }

    getDownloadLearningButton() {
        return this.$('.mstr-ai-chatbot-LearningDownloadButton');
    }

    getDownloadLearningInfoIcon() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-infoIcon');
    }

    getLastDownloadedTimeLabel() {
        return this.$('.mstr-ai-chatbot-download-learning-info-dialog-last-time-label');
    }

    async getLastDownloadedTime() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-lastDownloadDate').getText();
    }

    getTotalLearningCapturedLabel() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-learningCountLable');
    }

    async getTotalLearningCaptured() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-learningCount').getText();
    }

    async getAdaptiveLearningWarning() {
        return this.$('.mstr-ai-chatbot-ConsolidatedLearnings-warnText').getText();
    }

    // getDownloadLearningError() {
    //     return this.$('.mstr-ai-chatbot-download-learning-error');
    // }

    // --- above are for download learning section ---

    getApplyTimeFilterSwitch() {
        return this.$$(`.mstr-ai-chatbot-Switch-root`)[1];
    }

    getSendObjectDescriptionSwitch() {
        return this.$$(`.mstr-ai-chatbot-Switch-root`)[2];
    }

    getApplyTimeFilterInfoIcon() {
        return this.$$(`.mstr-icons-lib-icon.mstr-ai-chatbot-CustomInstruction-advanced-configurations-info-icon`)[0];
    }

    getSendObjectDescriptionInfoIcon() {
        return this.$$(`.mstr-icons-lib-icon.mstr-ai-chatbot-CustomInstruction-advanced-configurations-info-icon`)[1];
    }

    getAdvencedConfigurationTitle() {
        return this.$('.mstr-ai-chatbot-CustomInstruction-item-title');
    }

    getApplyTimeFilterSwtichLabel() {
        return this.$$('.mstr-ai-chatbot-SwitchWithLabel-label')[0];
    }

    getSendObjectDescriptionSwitchLabel() {
        return this.$$('.mstr-ai-chatbot-SwitchWithLabel-label')[1];
    }

    async getAdvancedConfigurationTitleText() {
        return this.getAdvencedConfigurationTitle().getText();
    }

    async getSendObjectDescriptionSwitchLabelText() {
        return this.getSendObjectDescriptionSwitchLabel().getText();
    }

    async getApplyTimeFilterSwitchLabelText() {
        return this.getApplyTimeFilterSwtichLabel().getText();
    }

    getTemperatureSliderContainers() {
        return this.$$('.mstr-ai-chatbot-Slider');
    }

    // Element locator for temperature sliders
    getAttributeFormTemperatureSlider() {
        return this.getTemperatureSliderContainers()[0].$('input.mstr-ai-chatbot-Slider-slider');
    }

    getMetricTemperatureSlider() {
        return this.getTemperatureSliderContainers()[1].$('input.mstr-ai-chatbot-Slider-slider');
    }

    getSpeakerTemperatureSlider() {
        return this.getTemperatureSliderContainers()[2].$('input.mstr-ai-chatbot-Slider-slider');
    }

    getAttributeFormTemperatureValueElement() {
        return this.getTemperatureSliderContainers()[0].$('.mstr-ai-chatbot-Slider-value');
    }

    getMetricTemperatureValueElement() {
        return this.getTemperatureSliderContainers()[1].$('.mstr-ai-chatbot-Slider-value');
    }

    getSpeakerTemperatureValueElement() {
        return this.getTemperatureSliderContainers()[2].$('.mstr-ai-chatbot-Slider-value');
    }

    getAttributeFormTemperatureTooltip() {
        return this.getTemperatureSliderContainers()[0].$('.mstr-ai-chatbot-Slider-tooltip-icon');
    }

    getMetricTemperatureTooltip() {
        return this.getTemperatureSliderContainers()[1].$('.mstr-ai-chatbot-Slider-tooltip-icon');
    }

    getSpeakerTemperatureTooltip() {
        return this.getTemperatureSliderContainers()[2].$('.mstr-ai-chatbot-Slider-tooltip-icon');
    }

    // Default value button locators
    getAttributeFormDefaultValueButton() {
        return this.getTemperatureSliderContainers()[0].$('.mstr-ai-chatbot-Slider-default-value-indicator');
    }

    getMetricDefaultValueButton() {
        return this.getTemperatureSliderContainers()[1].$('.mstr-ai-chatbot-Slider-default-value-indicator');
    }

    getSpeakerDefaultValueButton() {
        return this.getTemperatureSliderContainers()[2].$('.mstr-ai-chatbot-Slider-default-value-indicator');
    }

    getDropdownTriggerByOption(optionName) {
        const optionElem = this.$(`//*[text()="${optionName}"]`);
        const elem = optionElem.parentElement();
        return elem.$('.ant-select.mstr-ai-chatbot-Select-selectTrigger');
    }

    getWebManagementSwitch() {
        return this.$('div[data-feature-id="aibot-edit-customizations-web-search-toggle-v2"] button');
    }

    getWebManagementSetting() {
        return this.$('.mstr-ai-chatbot-WebSearchSettings');
    }

    getWebManagementList(text) {
        return this.getWebManagementSetting()
            .$$('.mstr-ai-chatbot-WebSearchSettings-section')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getAddBtnOnAllowlist(tag) {
        return this.getWebManagementList(tag).$('.mstr-ai-chatbot-WebSearchSettings-add-button');
    }

    getWebManagementItems(tag) {
        return this.getWebManagementList(tag).$$('.mstr-ai-chatbot-WebSearchSettings-website-item');
    }

    getWebManagementInputBoxes(tag) {
        return this.getWebManagementList(tag).$$('.mstr-ai-chatbot-WebSearchSettings-website-input');
    }

    getWebManagementDeleteIcons(tag) {
        return this.getWebManagementList(tag).$$('.mstr-ai-chatbot-WebSearchSettings-delete-button');
    }

    getWebManagementErrorMessage(tag) {
        return this.getWebManagementList(tag).$$('.mstr-ai-chatbot-WebSearchSettings-error-message');
    }

    // Action helper

    async enableCustomInstructions() {
        const isChecked = await this.isCustomInstructionsEnabled();
        if (!isChecked) {
            await this.click({ elem: this.getCustomInstructionsSwitch() });
        }
    }

    async disableCustomInstructions() {
        const isChecked = await this.isCustomInstructionsEnabled();
        if (isChecked) {
            await this.click({ elem: this.getCustomInstructionsSwitch() });
        }
    }

    async inputBackground(background) {
        if (background.length > 0) {
            await this.getEnabledInputBox(0).setValue(background);
        } else {
            await this.getEnabledInputBox(0).clearValue();
        }
    }

    async inputFormat(format) {
        if (format.length > 0) {
            await this.getEnabledInputBox(1).setValue(format);
        } else {
            await this.getEnabledInputBox(1).clearValue();
        }
    }

    async inputDeniedAnswer(deniedAnswer) {
        if (deniedAnswer.length > 0) {
            await this.getEnabledInputBox(2).setValue(deniedAnswer);
        } else {
            await this.getEnabledInputBox(2).clearValue();
        }
    }

    // index is dynamically changed per bot type. e,g, universal bot don't have background instructions
    async inputCustomInstructions(instructions, index = 0) {
        await this.getEnabledInputBox(index).clearValue();
        await this.getEnabledInputBox(index).setValue(instructions);
    }

    async inputBackgroundByPaste(background) {
        await this.setTextToClipboard(background);
        await this.getEnabledInputBox(0).clearValue();
        await this.getEnabledInputBox(0).click();
        await this.paste();
    }

    async inputFormatByPaste(format) {
        await this.setTextToClipboard(format);
        await this.getEnabledInputBox(1).clearValue();
        await this.getEnabledInputBox(1).click();
        await this.paste();
    }

    async triggerBackgroundTooltip() {
        await this.hover({ elem: this.getInfoIndicator()[0], time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async triggerFormatTooltip() {
        await this.hover({ elem: this.getInfoIndicator()[1], time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async triggerProgressErrorTooltip(index = 0) {
        await this.hover({ elem: this.getNuggetProgressErrorIcon(index), time: 2000 });
    }

    async waitForNuggetsItemsLoaded() {
        await this.waitForElementVisible(this.getNuggetsItem());
    }

    async hoverOnMissingFileWarningIcon() {
        await this.hover({ elem: this.getMissingFileWarningIcon() });
        await this.waitForTooltipDisplayed();
    }

    async hoverOnNuggetTitle(index = 0) {
        await this.hover({ elem: this.getNuggetName(index), time: 2000 });
        await this.waitForTooltipDisplayed();
    }

    async deleteNuggetItem(index = 0) {
        await this.waitForElementVisible(this.getNuggetsItem(index));
        await this.click({ elem: this.getDeleteIconOnNuggetsItem(index) });
        await this.click({ elem: this.getConfirmDeleteNuggetButton() });
        await this.waitForElementInvisible(this.getNuggetsItem(index));
    }

    async makeFileUploaderVisible(fileUploderInput) {
        const isFileUploaderVisible = await fileUploderInput.isDisplayed();
        if (!isFileUploaderVisible) {
            await this.executeScript((elem) => elem.removeAttribute('hidden'), await fileUploderInput);
        }
        await this.waitForElementVisible(fileUploderInput);
    }

    async fakeNuggetNameInUI(index = 0) {
        await this.executeScript((elem) => (elem.innerText = 'fakeNugget'), await this.getNuggetName(index));
    }

    async uploadNuggetsFileWorkaroundNoWait({ fileName, fileUploader = this.getNuggetFileUploadInput() }) {
        await this.makeFileUploaderVisible(fileUploader);
        await fileUploader.addValue(this.getRelativePath(fileName));
        await this.waitForNuggetsItemsLoaded();
    }

    async upLoadNuggetsFileError(fileName) {
        await this.uploadNuggetsFileWorkaroundNoWait({ fileName });
        await this.waitForElementVisible(this.getNuggetProgressErrorIcon());
    }

    async uploadNuggetsFileWorkaround({ fileName, fileUploader, index = 0 }) {
        // await this.makeFileUploaderVisible(fileUploader);
        // await fileUploader.addValue(this.getRelativePath(fileName));
        // await this.waitForNuggetsItemsLoaded();
        await this.uploadNuggetsFileWorkaroundNoWait({ fileName, fileUploader });
        await this.waitForElementVisible(this.getUploadedFileNameInCollectionItem(index));
        await this.waitForElementVisible(this.getUploadedFileProgressContainer(index));
        await this.waitForElementStaleness(this.getUploadedFileProgressContainer(index), {
            timeout: 4 * 60000,
            msg: 'File upload progress container still displayed after 4 min',
        });
    }

    /**
     * Description: Reupload nuggets file by index
     * @param {*} fileName file name to be reuploaded without path, relevant path which refers to files under 'wdio/production/resources' will be added
     * @param {*} index currently, production only support 1 knowledge file, use index=0 or omit it to use default 0
     */
    async reuploadNuggetsFile(fileName, index = 0) {
        await this.uploadNuggetsFileWorkaround({ fileName, fileUploader: this.getNuggetFileReuploadInput(index) });
    }

    /**
     * Description: Upload nuggets file when nuggets is empty
     * @param {*} fileName file name to be reuploaded without path, which refers to files under 'wdio/production/resources'
     */
    async uploadNuggetsFile(fileName) {
        await this.uploadNuggetsFileWorkaround({ fileName, fileUploader: this.getNuggetFileUploadInput() });
    }

    getRelativePath(fileName) {
        const workspacePath = process.cwd();
        return `${workspacePath}/resources/${fileName}`;
    }

    async scrollToBottom() {
        await this.click({ elem: this.getCurrentTabContainer() });
        await scrollElementToBottom(this.getCurrentTabContainer());
    }

    async scrollCustomInstructionsTo(position) {
        await this.click({ elem: this.getCurrentTabContainer() });
        return scrollElement(this.getCurrentTabContainer(), position);
    }
    async hoverDownloadLearningInfoIcon() {
        await this.hover({ elem: this.getDownloadLearningInfoIcon() });
    }

    async hoverDownloadLearningButton() {
        await this.hover({ elem: this.getDownloadLearningButton() });
    }

    async clickDownloadLearningButton() {
        await this.click({ elem: this.getDownloadLearningButton() });
    }

    async enableSendObjectDescription() {
        if (!(await this.isSendObjectDescriptionEnabled())) {
            await this.click({ elem: this.getSendObjectDescriptionSwitch() });
        }
    }

    async disableSendObjectDescription() {
        if (await this.isSendObjectDescriptionEnabled()) {
            await this.click({ elem: this.getSendObjectDescriptionSwitch() });
        }
    }

    async enableApplyTimeFilter() {
        if (!(await this.isApplyTimeFilterEnabled())) {
            await this.click({ elem: this.getApplyTimeFilterSwitch() });
        }
    }

    async disableApplyTimeFilter() {
        if (await this.isApplyTimeFilterEnabled()) {
            await this.click({ elem: this.getApplyTimeFilterSwitch() });
        }
    }

    async hoverOnApplyTimeFilterInfoIcon() {
        await this.hover({ elem: this.getApplyTimeFilterInfoIcon() });
        await this.waitForTooltipDisplayed();
    }

    async hoverOnSendObjectDescriptionInfoIcon() {
        await this.hover({ elem: this.getSendObjectDescriptionInfoIcon() });
        await this.waitForTooltipDisplayed();
    }

    // Action helper for temperature sliders
    async setAttributeFormTemperature(value) {
        const slider = await this.getAttributeFormTemperatureSlider();
        await this.executeScript(
            (elem, val) => {
                elem.value = val;
                // Trigger input event for real-time updates
                elem.dispatchEvent(new Event('input', { bubbles: true }));
                // Trigger change event for onChange listeners
                elem.dispatchEvent(new Event('change', { bubbles: true }));
            },
            slider,
            value
        );
    }

    async setMetricTemperature(value) {
        const slider = await this.getMetricTemperatureSlider();
        await this.executeScript(
            (elem, val) => {
                elem.value = val;
                // Trigger input event for real-time updates
                elem.dispatchEvent(new Event('input', { bubbles: true }));
                // Trigger change event for onChange listeners
                elem.dispatchEvent(new Event('change', { bubbles: true }));
            },
            slider,
            value
        );
    }

    async setSpeakerTemperature(value) {
        const slider = await this.getSpeakerTemperatureSlider();
        await this.executeScript(
            (elem, val) => {
                elem.value = val;
                // Trigger input event for real-time updates
                elem.dispatchEvent(new Event('input', { bubbles: true }));
                // Trigger change event for onChange listeners
                elem.dispatchEvent(new Event('change', { bubbles: true }));
            },
            slider,
            value
        );
    }

    async hoverOnAttributeFormTemperatureTooltip() {
        await this.hover({ elem: this.getAttributeFormTemperatureTooltip() });
        await this.waitForTooltipDisplayed();
    }

    async hoverOnMetricTemperatureTooltip() {
        await this.hover({ elem: this.getMetricTemperatureTooltip() });
        await this.waitForTooltipDisplayed();
    }

    async hoverOnSpeakerTemperatureTooltip() {
        await this.hover({ elem: this.getSpeakerTemperatureTooltip() });
        await this.waitForTooltipDisplayed();
    }

    // Action helper for temperature sliders
    async resetAttributeFormTemperature() {
        await this.click({ elem: this.getAttributeFormDefaultValueButton() });
    }

    async resetMetricTemperature() {
        await this.click({ elem: this.getMetricDefaultValueButton() });
    }

    async resetSpeakerTemperature() {
        await this.click({ elem: this.getSpeakerDefaultValueButton() });
    }

    async turnOnWebManagement() {
        const isChecked = (await this.getWebManagementSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getWebManagementSwitch().click();
        }
    }

    // -- Action helper for web management
    async turnOffWebManagement() {
        const isChecked = (await this.getWebManagementSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getWebManagementSwitch().click();
        }
    }

    async getAllowlistItemCount() {
        const items = await this.getWebManagementItems('Allowlist');
        return items.length || 0;
    }

    async getBlocklistItemCount() {
        const items = await this.getWebManagementItems('Blocklist');
        return items.length || 0;
    }

    async inputDomain(tag, domain) {
        const count = tag === 'Allowlist' ? await this.getAllowlistItemCount() : await this.getBlocklistItemCount();
        const el = await this.getWebManagementInputBoxes(tag)[count - 1];
        await this.click({ elem: el });
        await el.clearValue();
        await el.setValue(domain);
        await this.enter();
    }

    async inputAllowlistDomain(domain) {
        await this.inputDomain('Allowlist', domain);
    }

    async inputBlocklistDomain(domain) {
        await this.inputDomain('Blocklist', domain);
    }

    async addAllowlistDomain(domain) {
        await this.click({ elem: this.getAddBtnOnAllowlist('Allowlist') });
        await this.inputDomain('Allowlist', domain);
    }

    async addBlocklistDomain(domain) {
        await this.click({ elem: this.getAddBtnOnAllowlist('Blocklist') });
        await this.inputDomain('Blocklist', domain);
    }

    async getAllowlistLatestErrorMessage() {
        const count = await this.getAllowlistItemCount();
        const el = await this.getWebManagementErrorMessage('Allowlist')[count - 1];
        return el.getText();
    }

    async getAllowlistErrorMessageCount() {
        const messages = await this.getWebManagementErrorMessage('Allowlist');
        return messages.length || 0;
    }

    async getBlocklistLatestErrorMessage() {
        const count = await this.getBlocklistItemCount();
        const el = await this.getWebManagementErrorMessage('Blocklist')[count - 1];
        return el.getText();
    }

    async getBlocklistErrorMessageCount() {
        const messages = await this.getWebManagementErrorMessage('Blocklist');
        return messages.length || 0;
    }

    async deleteLatestAllowlistDomain() {
        const count = await this.getAllowlistItemCount();
        const el = await this.getWebManagementDeleteIcons('Allowlist')[count - 1];
        await this.click({ elem: el });
    }

    async deleteLatestBlocklistDomain() {
        const count = await this.getBlocklistItemCount();
        const el = await this.getWebManagementDeleteIcons('Blocklist')[count - 1];
        await this.click({ elem: el });
    }

    async deleteAllAllowlistDomains() {
        let els = await this.getWebManagementDeleteIcons('Allowlist');
        for (let i = 0; i < els.length; i++) {
            await this.click({ elem: els[i] });
        }
    }

    async deleteAllBlocklistDomains() {
        let els = await this.getWebManagementDeleteIcons('Blocklist');
        for (let i = 0; i < els.length; i++) {
            await this.click({ elem: els[i] });
        }
    }

    async deleteAllDomains() {
        await this.deleteAllAllowlistDomains();
        await this.deleteAllBlocklistDomains();
    }

    // Assertion helper

    async isCustomInstructionsEnabled() {
        const isChecked = await this.getCustomInstructionsSwitch().getAttribute('data-state');
        return isChecked === 'checked';
    }

    async isInputBoxEnabled() {
        const isBackgroundInputBoxEnabled = await this.getEnabledInputBox(0).isDisplayed();
        const isFormatInputBoxEnabled = await this.getEnabledInputBox(1).isDisplayed();
        return isBackgroundInputBoxEnabled && isFormatInputBoxEnabled;
    }

    async isDownloadLearningButtonEnabled() {
        return this.getDownloadLearningButton().isClickable();
    }

    async isInputBoxDisabled() {
        const isBackgroundInputBoxDisabled = await this.getDisabledInputBox(0)?.isDisplayed();
        const isFormatInputBoxDisabled = await this.getDisabledInputBox(1)?.isDisplayed();
        return !!isBackgroundInputBoxDisabled && !!isFormatInputBoxDisabled;
    }

    async isLastDownloadedTimeVisible() {
        return await this.getLastDownloadedTime().isDisplayed();
    }

    async isLearningSectionVisible() {
        return await this.getDownloadLearningSection().isDisplayed();
    }

    async isSendObjectDescriptionEnabled() {
        return (await this.getSendObjectDescriptionSwitch().getAttribute('data-state')) === 'checked';
    }

    async isApplyTimeFilterEnabled() {
        return (await this.getApplyTimeFilterSwitch().getAttribute('data-state')) === 'checked';
    }

    async isWebManagementDisplayed() {
        return this.getWebManagementSetting().isDisplayed();
    }

    async isAddBtnOnAllowlistDisabled() {
        return (await this.getAddBtnOnAllowlist('Allowlist').getAttribute('aria-disabled')) === 'true';
    }

    // Assertion helper for temperature sliders
    async getAttributeFormTemperatureValue() {
        return await this.getAttributeFormTemperatureValueElement().getText();
    }

    async getMetricTemperatureValue() {
        return await this.getMetricTemperatureValueElement().getText();
    }

    async getSpeakerTemperatureValue() {
        return await this.getSpeakerTemperatureValueElement().getText();
    }

    async isTemperatureDisplayed() {
        return this.getTemperatureSliderContainers().length > 0;
    }

    async isFiscalYearEnabled() {
        const isChecked = await this.getFiscalYearSwitch().getAttribute('data-state');
        return isChecked === 'checked';
    }

    async enableFiscalYear() {
        const isChecked = await this.isFiscalYearEnabled();
        if (!isChecked) {
            await this.click({ elem: this.getFiscalYearSwitch() });
        }
    }

    async disableFiscalYear() {
        const isChecked = await this.isFiscalYearEnabled();
        if (isChecked) {
            await this.click({ elem: this.getFiscalYearSwitch() });
        }
    }

    async selectDropdownOption(dropdownTrigger, optionText) {
        await this.click({ elem: dropdownTrigger });
        const dropdownPanel = await this.$('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        const items = await dropdownPanel.$$('.ant-select-item-option-content');

        let option = null;
        for (const item of items) {
            const text = await item.getText();
            if (text.trim() === optionText) {
                option = item;
                break;
            }
        }
        if (!option) throw new Error('Option not found: ' + optionText);
        await this.click({ elem: option });
    }

    async selectAdvancedCalendarDropdownOption(dropdownTrigger, datasetName, elementName) {
        await this.click({ elem: dropdownTrigger });
        const dropdownPanel = await $('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        await dropdownPanel.waitForDisplayed();
        // find dataset list
        const datasetOptions = await dropdownPanel.$$(
            '.ant-select-item-option-content .mstr-ai-chatbot-AdvancedCalendarSettings-option-item.dataset'
        );
        let datasetItem = null;
        for (let opt of datasetOptions) {
            const span = await opt.$('.mstr-ai-chatbot-AdvancedCalendarSettings-option-text');
            if (span && (await span.getText()) === datasetName) {
                datasetItem = opt;
                break;
            }
        }
        if (!datasetItem) throw new Error('Dataset not found: ' + datasetName);

        // expand datset and select item
        await datasetItem.click();
        await browser.pause(500);
        const elementOptions = await dropdownPanel.$$(
            '.ant-select-item-option-content .mstr-ai-chatbot-AdvancedCalendarSettings-option-item.attribute'
        );
        let elementItem = null;
        for (let elem of elementOptions) {
            const span = await elem.$('.mstr-ai-chatbot-AdvancedCalendarSettings-option-text');
            if (span && (await span.getText()) === elementName) {
                elementItem = elem;
                break;
            }
        }
        if (!elementItem) throw new Error('Element not found: ' + elementName);

        // click element
        await this.click({ elem: elementItem });
    }

    async selectRadioButtonByText(text) {
        const radioText = await this.$(`//*[text()="${text}"]`);
        let radioInput = null;
        if (await radioText.isExisting()) {
            radioInput = await radioText.parentElement().then((parent) => parent.$('input[type="radio"]'));
            if (!(await radioInput.isExisting())) {
                radioInput = await radioText
                    .parentElement()
                    .then((parent) => parent.parentElement().$('input[type="radio"]'));
            }
        }
        await this.click({ elem: radioInput });
    }

    // index=0 means basic calendar settings, index=1 means advanced calendar settings
    async isCalendarSettingsDisabled(index) {
        const FiscalYearSettingsContainer = await this.$$('.mstr-ai-chatbot-FiscalYearSettings-settings-container')[
            index
        ];
        const className = await FiscalYearSettingsContainer.getAttribute('class');
        return className.includes('mstr-ai-chatbot-FiscalYearSettings-settings-container--opaque');
    }

    async selectAdvancedCalendarDropdownBySearch(dropdownTrigger, input, elementName) {
        await this.click({ elem: dropdownTrigger });
        const dropdownPanel = await $('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        await dropdownPanel.waitForDisplayed();
        const searchInput = await dropdownTrigger.$('input[type="search"]');
        await searchInput.setValue(input);
        await browser.pause(500);
        // const option = await dropdownPanel.$(`//*[text()="${elementName}"]`);
        // await this.click({ elem: option });
        const elementOptions = await dropdownPanel.$$(
            '.ant-select-item-option-content .mstr-ai-chatbot-AdvancedCalendarSettings-option-item.attribute'
        );
        let elementItem = null;
        for (let elem of elementOptions) {
            const span = await elem.$('.mstr-ai-chatbot-AdvancedCalendarSettings-option-text');
            if (span && (await span.getText()) === elementName) {
                elementItem = elem;
                break;
            }
        }
        await this.click({ elem: elementItem });
    }
}
