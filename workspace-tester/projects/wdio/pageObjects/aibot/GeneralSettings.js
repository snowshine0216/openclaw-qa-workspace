import BaseBotConfigTab from '../base/BaseBotConfigTab.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';
export default class GeneralSettings extends BaseBotConfigTab {
    constructor() {
        super();
    }

    // Element locator

    getGenerlSettingsContainer() {
        return this.$('.mstr-ai-chatbot-GeneralPanel-container');
    }

    getBotInfoSection() {
        return this.$('.mstr-ai-chatbot-GeneralPanel-botInfo');
    }

    getBotNameInput() {
        return this.$('.mstr-ai-chatbot-BotName-input');
    }

    getBotNameInvalidInputWarningIcon() {
        return this.$('.mstr-ai-chatbot-BotName-nameError');
    }

    getActiveToggle() {
        return this.$('#active_switch');
    }

    getCoverImageContainer() {
        return this.$('.mstr-ai-chatbot-CoverImage');
    }

    getCoverImage() {
        return this.getCoverImageContainer().$('img');
    }

    getEditCoverImagePenIcon() {
        return this.$('.mstr-ai-chatbot-GalleryDialog-trigger-icon');
    }

    getCoverImageUrlInputBox() {
        return this.getEditCoverImageDialog().$('input.mstr-ai-chatbot-LogoInput-cover-logo-input');
    }

    getCoverImageUrlWarningMessage() {
        return this.getEditCoverImageDialog().$('.mstr-ai-chatbot-LogoInput-cover-logo-url-errmessage');
    }

    getCoverImageInGalleryByIndex(index = 0) {
        return this.getEditCoverImageDialog().$$('.mstr-ai-chatbot-CoverImage-image')[index];
    }

    getImageCategoryButtonsContainer() {
        return this.getEditCoverImageDialog().$$('.mstr-ai-chatbot-CoverGallery-btns button');
    }

    getAllButtonInCoverImageDialog() {
        return this.getImageCategoryButtonsContainer()[0];
    }

    getIndustryButtonInCoverImageDialog() {
        return this.getImageCategoryButtonsContainer()[1];
    }

    getColorButtonInCoverImageDialog() {
        return this.getImageCategoryButtonsContainer()[2];
    }

    getSaveButtonInCoverImageDialog() {
        return this.getEditCoverImageDialog().$('.mstr-ai-chatbot-Dialog-buttonArea button');
    }

    getCloseButtonInCoverImageDialog() {
        return this.getEditCoverImageDialog().$('.mstr-ai-chatbot-Dialog-closeButton');
    }

    getEditCoverImageDialog() {
        return this.$('.mstr-ai-chatbot-GalleryDialog-container');
    }

    getCoverImageNotFoundIndicator() {
        return this.getBotInfoSection().$('.mstr-ai-chatbot-CoverImage-error-icon');
    }

    getBotLogoSettingContainer() {
        return this.getGenerlSettingsContainer().$('.mstr-ai-chatbot-BotLogoSetting');
    }

    getDisplayBotLogoCheckBox() {
        return this.getBotLogoSettingContainer().$('.mstr-ai-chatbot-Checkbox button');
    }

    getBotLogoSettingInfoIcon() {
        return this.getBotLogoSettingContainer().$('span.mstr-ai-chatbot-BotLogoSetting-info-icon');
    }

    getGreetingInputBox() {
        return this.$('textarea[name=greetingText]');
    }

    getGreetingSection() {
        return this.$('.mstr-ai-chatbot-BotGreeting');
    }

    getGreetingCount() {
        return this.$('.mstr-ai-chatbot-Textarea-word-count.mstr-ai-chatbot-BotGreeting-count');
    }
    // ---- topics section below-----

    getTopicSection() {
        return this.$('.mstr-ai-chatbot-Topics');
    }

    getTopicSwitch() {
        return this.getTopicSection().$('button.mstr-ai-chatbot-Switch-root');
    }

    getTopicSuggestionsButtonStatus() {
        return this.getTopicSwitch().getAttribute('aria-checked');
    }

    getAddCustomTopicButton() {
        return this.$$('.mstr-ai-chatbot-Topics-footerButton')[0];
    }

    getAutoGenerateTopicsButton() {
        return this.$$('.mstr-ai-chatbot-Topics-footerButton')[1];
    }

    getTopicItemByIndex(index) {
        return this.$$('.mstr-ai-chatbot-TopicItem')[index];
    }

    getTopicsTitleByIndex(index) {
        return this.$$('input.mstr-ai-chatbot-TopicItem-title')[index];
    }

    async getTopicsTitleTextByIndex(index) {
        return this.getTopicsTitleByIndex(index).getAttribute('value');
    }

    getTopicsDescriptionByIndex(index) {
        return this.$$('textarea.mstr-ai-chatbot-TopicItem-description')[index];
    }

    async getTopicsDescriptionTextByIndex(index) {
        return (await this.getTopicsDescriptionByIndex(index)).getText();
    }

    getTopicsDeleteButtonByIndex(index) {
        return this.$$('.mstr-ai-chatbot-TopicItem-deleteTopicButton')[index];
    }

    getTopicsRefreshButtonByIndex(index) {
        return this.$$('.mstr-ai-chatbot-TopicItem-refreshTopicIcon')[index];
    }

    async getTopicsCount() {
        return this.$$('.mstr-ai-chatbot-TopicItem-title-section').length;
    }

    getTopicsPanelSwtich() {
        return this.getOptionalFeaturesSection().$$('button.mstr-ai-chatbot-Switch-root')[1];
    }

    // ---- topics section above ----
    getOptionalFeaturesSection() {
        return this.$('.mstr-ai-chatbot-OptionalFeatures');
    }

    getAllowSnapshotSwitch() {
        return this.getOptionalFeaturesSection().$('button.mstr-ai-chatbot-Switch-root');
    }

    getEnableInterpretationSwitch() {
        return this.getOptionalFeaturesSection().$$('button.mstr-ai-chatbot-Switch-root')[2];
    }

    getEnableInterpretationInfo() {
        return this.getOptionalFeaturesSection().$('.mstr-ai-chatbot-OptionalFeatures-infoIcon');
    }

    getQuestionInputSection() {
        return this.$('.mstr-ai-chatbot-QuestionInput');
    }

    getQuestionInputHintInputBox() {
        return this.$('.mstr-ai-chatbot-QuestionInput-hint input');
    }

    getEnableSuggestionSwitch() {
        return this.getQuestionInputSection().$('button.mstr-ai-chatbot-Switch-root');
    }

    getTotalAutoGenerateSuggestionLimit() {
        return this.$('.mstr-ai-chatbot-Select-container span:not(.mstr-ai-chatbot-Select-selectIcon)');
    }

    getAutoGeneratedSuggestionLimitDropDownTrigger() {
        return this.$('.mstr-ai-chatbot-Select-container button');
    }

    getPopupContainer() {
        return this.$('.rc-virtual-list,.mstr-ai-chatbot-Select-viewport');
    }

    getPopupItemByText(text) {
        const elements = this.getPopupContainer()
            .$$('.mstr-ai-chatbot-Select-item')
            .filter(async (elem) => {
                // Try getting text from span first
                const spanElem = await elem.$('span');
                if (await spanElem.isExisting()) {
                    const spanText = await spanElem.getText();
                    if (spanText === text) {
                        return true;
                    }
                }
                // If span doesn't exist or doesn't match, try getting text from elem directly
                const elemText = await elem.getText();
                return elemText === text;
            });
        return elements[0];
    }

    getEditorCoverImage() {
        return this.$('.mstr-ai-chatbot-Clickable.mstr-ai-chatbot-CoverImage').$('.mstr-ai-chatbot-CoverImage-image');
    }

    getCoverImageEditButton() {
        return this.$('.mstr-ai-chatbot-GalleryDialog-trigger-icon');
    }

    getCoverImages() {
        return this.$$('div[data-testid="coverImage"]');
    }

    getCoverImageSaveButton() {
        return this.$('button[data-feature-id="aibot-edit-cover-image-dialog-save-v2"]');
    }

    getBotNameInputV2() {
        return this.$('input[data-feature-id="aibot-edit-name-input-v2"]');
    }

    getPanelThemeSelect() {
        return this.$('.mstr-ai-chatbot-AppearancePanel-theme-section .mstr-ai-chatbot-Select-item');
    }

    getVizPaletteSelect() {
        return this.$('div[data-feature-id="aibot-edit-appearance-viz-palette-select-v2"]');
    }

    getSnapshotSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-my-snapshots-toggle-v2"] button');
    }

    getInterpretationSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-interpretation-toggle-v2"] button');
    }

    getQuestionHint() {
        return this.$('input[data-feature-id="aibot-edit-question-hint-input-v2"]');
    }

    getSuggestionsSwitch() {
        return this.$('div[data-feature-id="aibot-edit-question-suggestions-toggle-v2"] button');
    }

    getSuggestionNumberSelect() {
        return this.$('div[data-feature-id="aibot-edit-question-autogenerate-suggestions-select-v2"]');
    }

    getSuggestionAddButton() {
        return this.$('button[data-testid="addCustomSuggestion"]');
    }

    getLinkAddButton() {
        return this.$('button[data-feature-id="aibot-edit-links-add-v2"]');
    }

    getSaveButton() {
        return this.$('div[data-feature-id="navbar-ai-bot-save-v2"]');
    }

    getCustomSuggestionInputs() {
        return this.$$('input[data-feature-id="aibot-edit-question-custom-suggestion-input-v2"]');
    }

    getLinkNameInputs() {
        return this.$$('input[data-feature-id="aibot-edit-link-name-input-v2"]');
    }

    getLinkUrlInputs() {
        return this.$$('input[data-feature-id="aibot-edit-link-url-input-v2"]');
    }

    getLinkFormatSelect() {
        return this.$('button[data-feature-id="aibot-edit-links-display-format-select-v2"]');
    }

    getInsightsSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-insights-toggle-v2"] button');
    }

    getAutoCompleteSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-auto-complete-toggle-v2"] button');
    }

    getAskAboutSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-ask-about-toggle-v2"] button');
    }

    getResearchSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-research-toggle-v2"] button');
    }

    getSqlTemplateSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-sql-template-toggle-v2"] button');
    }

    getExportSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-export-toggle-v2"] button');
    }

    getExportFullDataSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-export-full-data-info-icon-v2"] button');
    }

    getTheme(theme) {
        return this.$$('.mstr-ai-chatbot-Select-item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === theme;
        })[0];
    }

    getWebSearchSwitch() {
        return this.$('div[data-feature-id="aibot-edit-opt-features-web-search-toggle-v2"] button');
    }

    // --- topics below-----
    async enableTopicSuggestion() {
        if (!(await this.isTopicsSuggestionEnabled())) {
            await this.getTopicSwitch().click();
            await this.waitForElementVisible(this.getTopicItemByIndex(0));
        }
    }

    async disableTopicSuggestion() {
        if (await this.isTopicsSuggestionEnabled()) {
            await this.getTopicSwitch().click();
        }
    }

    async hoverTopicSwitch() {
        await this.getTopicSwitch().moveTo();
    }

    async clickAddCustomTopicButton() {
        await this.click({ elem: this.getAddCustomTopicButton() });
    }

    async editCustomTopicByIndex(index, { title, description }) {
        await this.inputTopicTitleByIndex(index, title);
        await this.inputTopicsDescriptionByIndex(index, description);
    }

    async autoGenerateTopics() {
        await this.click({ elem: this.getAutoGenerateTopicsButton() });
        await this.waitForElementClickable(this.getTopicsRefreshButtonByIndex(0));
    }

    async enableTopicPanel() {
        if (!(await this.isTopcisPanelEnabled())) {
            await this.getTopicsPanelSwtich().click();
        }
    }

    async disableTopicPanel() {
        if (await this.isTopcisPanelEnabled()) {
            await this.getTopicsPanelSwtich().click();
        }
    }

    async removeTopicByIndex(index) {
        await this.click({ elem: this.getTopicsDeleteButtonByIndex(index) });
    }

    async refreshTopics(index) {
        await this.click({ elem: this.getTopicsRefreshButtonByIndex(index) });
        await this.waitForElementEnabled(this.getTopicsRefreshButtonByIndex(index));
    }

    async inputTopicTitleByIndex(index, title) {
        await (await this.getTopicsTitleByIndex(index)).setValue(title);
    }

    async inputTopicsDescriptionByIndex(index, description) {
        await (await this.getTopicsDescriptionByIndex(index)).setValue(description);
    }

    async addCustomTopic({ title, description }) {
        await this.clickAddCustomTopicButton();
        const index = (await this.getTopicsCount()) - 1;
        await this.inputTopicTitleByIndex(index, title);
        await this.inputTopicsDescriptionByIndex(index, description);
    }

    // ----topics above ----

    getQuestionSugestionsSection() {
        return this.$('.mstr-ai-chatbot-QuestionSuggestions');
    }

    getAddNewCustomSuggestionButton() {
        return this.$('.mstr-ai-chatbot-QuestionSuggestions-customAddNew');
    }

    getNewCustomSuggestionInputBoxByIndex(index = 0) {
        return this.$$('.mstr-ai-chatbot-QuestionSuggestions-customSuggestionItem input')[index];
    }

    getDeleteCustomSuggestionButtonByIndex(index) {
        return this.$$('.mstr-ai-chatbot-QuestionSuggestions-customClearButton')[index];
    }

    getCustomSuggestions() {
        return this.$$('.mstr-ai-chatbot-QuestionSuggestions-customSuggestionItem');
    }

    getLimitsSection() {
        return this.$('.mstr-ai-chatbot-Limits');
    }

    getQuestionLimitInputBox() {
        return this.getLimitsSection().$('input');
    }

    getQuestionLimitPlaceHolder() {
        return this.getQuestionLimitInputBox().getAttribute('placeholder');
    }

    getLinkSection() {
        return this.$('.mstr-ai-chatbot-Links');
    }

    getLinkSectionTooltop() {
        return this.getLinkSection().$('.mstr-ai-chatbot-Links-tooltip');
    }

    getLinkIndicator() {
        return this.$('.mstr-ai-chatbot-Links-tooltip');
    }

    getLinkItems() {
        return this.getLinkSection().$$('.mstr-ai-chatbot-LinkItem');
    }

    getLinkItemByIndex(index) {
        return this.getLinkItems()[index];
    }

    getLinkItemIconSelectorByIndex(index) {
        return this.getLinkItemByIndex(index).$('.mstr-ai-chatbot-LinkItem-iconSelector');
    }

    getLinkItemIconsInPopupByIndex(index, iconIndex) {
        return this.$$('.mstr-ai-chatbot-LinkItem-iconsContainer button')[iconIndex];
    }

    getLinkItemNameByIndex(index) {
        return this.getLinkItemByIndex(index).$('input#linkName');
    }

    getLinkItemInvalidUrlWarningIconByIndex(index) {
        return this.getLinkItemByIndex(index).$('.mstr-ai-chatbot-LinkItem-urlError');
    }

    getLinkItemUrlByIndex(index) {
        return this.getLinkItemByIndex(index).$('.mstr-ai-chatbot-LinkItem-content input');
    }

    getLinkItemDeleteButtonByIndex(index) {
        return this.getLinkItemByIndex(index).$('.mstr-ai-chatbot-Links-delete-button');
    }

    getAddLinkButton() {
        return this.getLinkSection().$('.mstr-ai-chatbot-Links-addLink');
    }

    getDeleteLinkButton(index) {
        return this.getLinkSection().$$('.mstr-ai-chatbot-Links-delete-button')[index];
    }

    getUrlErrorIndicator(index) {
        return this.getLinkSection().$$('.mstr-ai-chatbot-LinkItem-urlError')[index];
    }

    getLinkDisplayFormatDropDownTrigger() {
        return this.getLinkSection().$('.mstr-ai-chatbot-Links-linkDisplayFormatSelect');
    }

    getLinkDisplayFormatSelection() {
        return this.$(
            'button.mstr-ai-chatbot-Links-linkDisplayFormatSelect span:not(.mstr-ai-chatbot-Select-selectIcon)'
        );
    }

    // Action helper
    async updateBotName(name) {
        await this.waitForElementVisible(this.getBotNameInput());
        await this.getBotNameInput().clearValue();
        //wait for bot name input is cleared
        await this.waitForTextPresentInElementValue(this.getBotNameInput(), '');
        await this.enter();
        await this.getBotNameInput().setValue(name);
        await this.enter();
    }

    async resetBotName() {
        await this.resetInput({ elem: this.getBotNameInput() });
    }

    async resetGreeting() {
        await this.resetInput({ elem: this.getGreetingInputBox() });
    }

    async resetQuestionInputHint() {
        await this.resetInput({ elem: this.getQuestionInputHintInputBox() });
    }

    async hoverOnBotNameInvalidInputWarningIcon() {
        await this.hover({ elem: this.getBotNameInvalidInputWarningIcon() });
        await this.waitForElementVisible(this.getTooltip());
    }

    async activeBot() {
        const isChecked = await this.isActiveBotSwitchOn();
        if (!isChecked) {
            await this.toggleActiveSwitch();
        }
    }

    async deactiveBot() {
        const isChecked = await this.isActiveBotSwitchOn();
        if (isChecked) {
            await this.toggleActiveSwitch();
        }
    }

    async toggleActiveSwitch() {
        await this.getActiveToggle().click();
    }

    async openCoverImageEditDialog() {
        await this.getEditCoverImagePenIcon().click();
        await this.waitForElementVisible(this.getEditCoverImageDialog());
    }

    async closeCoverImageEditDialog() {
        await this.getSaveButtonInCoverImageDialog().click();
        await this.waitForElementStaleness(this.getEditCoverImageDialog());
    }

    async updateCoverImageUrl(url) {
        await this.getCoverImageUrlInputBox().setValue(url);
        await this.enter();
    }

    async switchBetweenImageCategory(category) {
        if (category === 'All') {
            await this.getAllButtonInCoverImageDialog().click();
        } else if (category === 'Industry') {
            await this.getIndustryButtonInCoverImageDialog().click();
        } else if (category === 'Color') {
            await this.getColorButtonInCoverImageDialog().click();
        }
    }

    async selectImageInGalleryByIndex(index = 0) {
        const imageToSelect = await this.getCoverImageInGalleryByIndex(index);
        await this.waitForElementClickable(imageToSelect);
        await imageToSelect.scrollIntoView();
        await this.click({ elem: imageToSelect });
    }

    async updateBotCoverImage({ url = '', category = 'All', index = 0 }) {
        await this.openCoverImageEditDialog();
        if (url) {
            await this.updateCoverImageUrl(url);
        } else {
            await this.switchBetweenImageCategory(category);
            await this.selectImageInGalleryByIndex(index);
        }
        await this.getSaveButtonInCoverImageDialog().click();
        await this.waitForElementStaleness(this.getEditCoverImageDialog());
        await this.waitForImageLoaded(this.getCoverImage());
    }

    async triggerCloseTooltip() {
        await this.hover({ elem: this.getCloseButtonInCoverImageDialog(), time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async saveAndCloseEditCoverImageDialog() {
        await this.getSaveButtonInCoverImageDialog().click();
    }

    async updateGreetings(greeting) {
        await this.getGreetingInputBox().setValue(greeting);
    }

    async toggleTopicSwitch() {
        await this.getTopicSwitch().click();
    }

    async toggleAllowSnapshotSwitch() {
        await this.getAllowSnapshotSwitch().click();
    }

    async toggleEnableInterpretationSwitch() {
        await this.getEnableInterpretationSwitch().click();
    }

    async openInterpretationTooltip() {
        await this.hover({ elem: this.getEnableInterpretationInfo(), time: 1500 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async turnOnAllowSnapshot() {
        const isChecked = await this.isAllowSnapshotSwitchOn();
        if (!isChecked) {
            await this.toggleAllowSnapshotSwitch();
        }
    }

    async turnOffAllowSnapshot() {
        const isChecked = await this.isAllowSnapshotSwitchOn();
        if (isChecked) {
            await this.toggleAllowSnapshotSwitch();
        }
    }

    async turnOnEnableInterpretation() {
        const isChecked = await this.isEnableInterpretationSwitchOn();
        if (!isChecked) {
            await this.toggleEnableInterpretationSwitch();
        }
    }

    async turnOffEnableInterpretation() {
        const isChecked = await this.isEnableInterpretationSwitchOn();
        if (isChecked) {
            await this.toggleEnableInterpretationSwitch();
        }
    }

    async updateQuestionInputHint(hint) {
        await this.replaceText({ elem: this.getQuestionInputHintInputBox(), text: hint });
    }

    async turnOnEnableSuggestion() {
        const isChecked = await this.isEnableSuggestionSwitchOn();
        if (!isChecked) {
            await this.toggleEnableSuggestionSwitch();
        }
    }

    async turnOffEnableSuggestion() {
        const isChecked = await this.isEnableSuggestionSwitchOn();
        if (isChecked) {
            await this.toggleEnableSuggestionSwitch();
        }
    }

    async toggleEnableSuggestionSwitch() {
        await this.getEnableSuggestionSwitch().click();
    }

    async openAutoSuggestionLimitSelectionDropdown() {
        await this.click({ elem: this.getAutoGeneratedSuggestionLimitDropDownTrigger() });
    }

    async setAutoSuggestionLimit(limit) {
        await this.openAutoSuggestionLimitSelectionDropdown();
        await this.waitForElementVisible(this.getPopupContainer());
        await this.waitForElementClickable(this.getPopupItemByText(limit));
        await this.click({ elem: this.getPopupItemByText(limit) });
    }

    async addCustomSuggestion(text) {
        await this.getAddNewCustomSuggestionButton().click();
        const elems = await this.getCustomSuggestions();
        await this.setCustomSuggestionByIndex(elems.length - 1, text);
        return this.sleep(500); // wait to sync to chat panel
    }

    async deleteCustomSuggestionByIndex(index = 0) {
        await this.getDeleteCustomSuggestionButtonByIndex(index).click();
    }

    async setCustomSuggestionByIndex(index = 0, text) {
        await this.getNewCustomSuggestionInputBoxByIndex(index).setValue(text);
    }

    async setQuestionLimit(limit) {
        await this.getQuestionLimitInputBox().setValue(limit);
        await this.enter();
    }

    async scrollToBottom() {
        await scrollElementToBottom(this.getGenerlSettingsContainer());
    }

    async scrollToTop() {
        await scrollElementToTop(this.getGenerlSettingsContainer());
    }

    async clickAddLinkButton() {
        await this.getAddLinkButton().click();
    }

    async openLinkSettingsTooltip() {
        await this.hover({ elem: this.getLinkSectionTooltop() });
        await this.waitForElementVisible(this.getTooltip());
    }

    async addExternalLink({ iconIndex = 0, title, url }) {
        await this.getAddLinkButton().scrollIntoView();
        await this.clickAddLinkButton();
        const elems = await this.getLinkItems();
        await this.setExternalLinkByIndex({ index: elems.length - 1, iconIndex, title, url });
    }

    async triggerInvalidUrlTooltip(index) {
        await this.hover({ elem: this.getUrlErrorIndicator(index), time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async replaceText({ elem, text }) {
        await this.click({ elem });
        await this.ctrlA();
        await this.delete();
        await elem.setValue(text);
        await this.sleep(500);
        await this.enter();
    }

    async hoverOnInvalidUrlIconByIndex(index = 0) {
        await this.hover({ elem: this.getLinkItemInvalidUrlWarningIconByIndex(index) });
        await this.waitForElementVisible(this.getTooltip());
    }

    async setExternalLinkByIndex({ index = 0, iconIndex = 0, title, url }) {
        await this.scrollToBottom();
        await this.replaceText({ elem: this.getLinkItemNameByIndex(index), text: title });
        await this.replaceText({ elem: this.getLinkItemUrlByIndex(index), text: url });
        await this.getLinkItemIconSelectorByIndex(index).click();
        await this.getLinkItemIconsInPopupByIndex(index, iconIndex).click();
        // if (iconIndex !== 0) {
        //     await this.getLinkItemIconsInPopupByIndex(index, iconIndex).click();
        // }
    }

    async deleteExternalLinkByIndex(index = 0) {
        await this.getLinkItemDeleteButtonByIndex(index).click();
    }

    async triggerDeleteLinkTooltip(index) {
        await this.hover({ elem: this.getDeleteLinkButton(index), time: 2000 });
        await this.waitForElementVisible(this.getTooltip());
    }

    async selectLinkDisplayFormat(format) {
        await scrollElementToBottom(this.getGenerlSettingsContainer());
        await this.click({ elem: this.getLinkDisplayFormatDropDownTrigger() });
        await this.waitForElementVisible(this.getPopupContainer());
        await this.waitForElementClickable(this.getPopupItemByText(format));
        await this.click({ elem: this.getPopupItemByText(format) });
    }

    async waitForImageLoaded(elem) {
        await this.waitForElementVisible(elem);
        let curSize,
            preSize = {
                width: 0,
                height: 0,
            };
        for (let i = 0; i < 10; i++) {
            curSize = await elem.getSize();
            if (curSize.width == preSize.width && curSize.height == preSize.height) {
                break;
            } else {
                preSize.width = curSize.width;
                preSize.height = curSize.height;
            }
            await this.sleep(1000);
        }
    }

    async hoverOnActiveToggleButton() {
        await this.hover({ elem: this.getActiveToggle() });
        await this.waitForTooltipDisplayed();
    }

    async tickBotLogoSetting() {
        await this.click({ elem: this.getDisplayBotLogoCheckBox() });
    }

    async toggleDisplayBotLogo(flag = true) {
        const isChecked = await this.isDisplayBotLogoSettingOn();
        if (flag !== isChecked) {
            await this.tickBotLogoSetting();
        }
    }

    async hoverOnBotLogoInfoIcon() {
        await this.hover({ elem: this.getBotLogoSettingInfoIcon() });
        await this.waitForTooltipDisplayed();
    }

    // Assertion helper

    async isActiveBotSwitchOn() {
        const isChecked = await this.getActiveToggle().getAttribute('aria-checked');
        return isChecked === 'true';
    }

    async isAllowSnapshotSwitchOn() {
        const isChecked = await this.getAllowSnapshotSwitch().getAttribute('data-state');
        return isChecked === 'checked';
    }

    async getBotAliasName() {
        return this.getBotNameInput().getValue();
    }

    async getBotGreetingText() {
        return this.getGreetingInputBox().getValue();
    }

    // --- topics below -----
    async isTopicsSuggestionEnabled() {
        const isChecked = await this.getTopicSuggestionsButtonStatus();
        return isChecked === 'true';
    }

    async isAddCustomTopicButtonPresent() {
        return await this.getAddCustomTopicButton().isDisplayed();
    }

    async isAutoGenerateTopicsButtonPresent() {
        return await this.getAutoGenerateTopicsButton().isDisplayed();
    }

    async isTopcisPanelEnabled() {
        if ((await this.getTopicsPanelSwtich().getAttribute('aria-checked')) === 'true') {
            return true;
        }
        return false;
    }

    async isDeleteTopicButtonPresent(index) {
        return await this.getTopicsDeleteButtonByIndex(index).isDisplayed();
    }

    async isRefreshTopicButtonEnabled(index) {
        return await this.getTopicsRefreshButtonByIndex(index).isEnabled();
    }
    // --- topics above ----
    async isEnableInterpretationSwitchOn() {
        const isChecked = await this.getEnableInterpretationSwitch().getAttribute('data-state');
        return isChecked === 'checked';
    }

    async isEnableSuggestionSwitchOn() {
        const isChecked = await this.getEnableSuggestionSwitch().getAttribute('data-state');
        return isChecked === 'checked';
    }

    async isAutoSuggestionLimitOptionEnabled(option) {
        const elem = await this.getPopupItemByText(option);
        const className = await elem.getAttribute('class');
        return !className.includes('--disabled');
    }

    async isAutoSuggestionLimitOptionSelected(option) {
        const elem = await this.getPopupItemByText(option);
        const isSelected = await elem.getAttribute('aria-selected');
        return isSelected === 'true';
    }

    async isDisplayBotLogoSettingOn() {
        const isChecked = await this.getDisplayBotLogoCheckBox().getAttribute('aria-checked');
        return isChecked === 'true';
    }

    async selectCoverImage(index) {
        await this.getCoverImageEditButton().click();
        await this.getCoverImages()[index].click();
        await this.getCoverImageSaveButton().click();
    }

    async changeBotName(newName) {
        await this.getBotNameInput().clearValue();
        await this.getBotNameInput().setValue(newName);
        await this.dismissFocus();
    }

    async changeGreeting(newGreeting) {
        await this.getGreetingInputBox().clearValue();
        await this.getGreetingInputBox().setValue(newGreeting);
    }

    async getCoverImageSrc() {
        return await this.getEditorCoverImage().getAttribute('src');
    }

    async openPanelTheme() {
        await this.getPanelThemeSelect().click();
        await this.waitForElementVisible(this.getPopupContainer());
    }

    async changePanelTheme(theme = 'Dark') {
        await this.getPanelThemeSelect().click();
        await this.waitForElementVisible(this.getPopupContainer());
        await this.click({ elem: this.getTheme(theme) });
    }

    async resetPanelTheme() {
        await this.click({ elem: this.getPanelThemeSelect() });
        await this.waitForElementVisible(this.getPopupContainer());
        await this.click({ elem: this.getTheme('Light') });
    }

    async changeVizPalette() {
        await this.click({ elem: this.getVizPaletteSelect() });
        await this.$('div=Business').click();
    }

    async resetVizPalette() {
        await this.getPanelThemeSelect().waitForClickable();
        await this.getVizPaletteSelect().click();
        await this.$('div=Agave').click();
    }

    async turnOnSnapshot() {
        const isChecked = (await this.getSnapshotSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getSnapshotSwitch().click();
        }
    }

    async turnOffSnapshot() {
        const isChecked = (await this.getSnapshotSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getSnapshotSwitch().click();
        }
    }

    async turnOnInterpretation() {
        const isChecked = (await this.getInterpretationSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getInterpretationSwitch().click();
        }
    }

    async turnOffInterpretation() {
        const isChecked = (await this.getInterpretationSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getInterpretationSwitch().click();
        }
    }

    async changeQuestionHint(newHint) {
        await this.getQuestionHint().waitForEnabled();
        await this.getQuestionHint().clearValue();
        await this.getQuestionHint().setValue(newHint);
    }

    async turnOnSuggestions() {
        const isChecked = (await this.getSuggestionsSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getSuggestionsSwitch().click();
        }
    }

    async turnOffSuggestions() {
        const isChecked = (await this.getSuggestionsSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getSuggestionsSwitch().click();
        }
    }

    async changeSuggestionNumber(number) {
        await this.getSuggestionNumberSelect().click();
        await this.$(
            `//div[contains(@class, "mstr-ai-chatbot-Select-item") and contains(normalize-space(.), "${number}")]`
        ).click();
    }

    async turnOnInsights() {
        const isChecked = (await this.getInsightsSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getInsightsSwitch().click();
        }
    }

    async turnOffInsights() {
        const isChecked = (await this.getInsightsSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getInsightsSwitch().click();
        }
    }

    async turnOnAutoComplete() {
        const isChecked = (await this.getAutoCompleteSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getAutoCompleteSwitch().click();
        }
    }

    async turnOffAutoComplete() {
        const isChecked = (await this.getAutoCompleteSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getAutoCompleteSwitch().click();
        }
    }

    async turnOnWebSearch() {
        const isChecked = (await this.getWebSearchSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getWebSearchSwitch().click();
        }
    }

    async turnOffWebSearch() {
        const isChecked = (await this.getWebSearchSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getWebSearchSwitch().click();
        }
    }

    async turnOffResearch() {
        const isChecked = (await this.getResearchSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getResearchSwitch().click();
        }
    }

    async turnOnResearch() {
        const isChecked = (await this.getResearchSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getResearchSwitch().click();
        }
    }

    async turnOnAskAbout() {
        const isChecked = (await this.getAskAboutSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getAskAboutSwitch().click();
        }
    }

    async turnOffAskAbout() {
        const isChecked = (await this.getAskAboutSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getAskAboutSwitch().click();
        }
    }

    async turnOnSqlTemplate() {
        const isChecked = (await this.getSqlTemplateSwitch().getAttribute('aria-checked')) == 'true';
        if (!isChecked) {
            await this.getSqlTemplateSwitch().click();
        }
    }

    async turnOffSqlTemplate() {
        const isChecked = (await this.getSqlTemplateSwitch().getAttribute('aria-checked')) == 'true';
        if (isChecked) {
            await this.getSqlTemplateSwitch().click();
        }
    }

    async isExportSwitchOn() {
        const isChecked = (await this.getExportSwitch().getAttribute('aria-checked')) == 'true';
        return isChecked;
    }

    async isExportFullDataSwitchOn() {
        const isChecked = (await this.getExportFullDataSwitch().getAttribute('aria-checked')) == 'true';
        return isChecked;
    }

    async turnOnExport() {
        const isChecked = await this.isExportSwitchOn();
        if (!isChecked) {
            await this.getExportSwitch().click();
        }
    }

    async turnOffExport() {
        const isChecked = await this.isExportSwitchOn();
        if (isChecked) {
            await this.getExportSwitch().click();
        }
    }

    async turnOnExportFullData() {
        const isChecked = await this.isExportFullDataSwitchOn();
        if (!isChecked) {
            await this.getExportFullDataSwitch().click();
        }
    }

    async turnOffExportFullData() {
        const isChecked = await this.isExportFullDataSwitchOn();
        if (isChecked) {
            await this.getExportFullDataSwitch().click();
        }
    }

    async saveConfig() {
        await this.getSaveButton().click();
        await this.getPanelThemeSelect().waitForClickable({ timeout: 60000 });
    }

    async getPanelThemeColor() {
        return await browser.execute(() => {
            return window
                .getComputedStyle(document.documentElement)
                .getPropertyValue('--mstr-chatbot-theme-panel-bg')
                .trim();
        });
    }
}
