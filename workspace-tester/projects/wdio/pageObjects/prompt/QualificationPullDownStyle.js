import BasePrompt from '../base/BasePrompt.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class QualificationPullDownStyle extends BasePrompt {
    /****************************************************************
     * Element locator
     ****************************************************************/

    // The dropdown of Attribute or Metric
    getDropDownLocator(promptElement) {
        return promptElement.$('.mstrQualifierContainerTargetView');
    }

    // The popup menu of pull down
    getDropDownMenu(promptElement) {
        return promptElement.$('.mstrListBlockListContainer');
    }

    // The popup list of pull down
    getDropDownList(promptElement) {
        return this.getDropDownLocator(promptElement).$$('.mstrListBlockListContainer>div');
    }

    // Get the value input
    getLowerValueInput(promptElement) {
        return promptElement
            .$('.mstrQualifierContainerConstant1View')
            .$('.mstrCalendarAndTimePicker')
            .$('.mstrCalendarAndTimePickerCellTextBox>input');
    }

    getLowerInputCalendarIcon(promptElement) {
        return promptElement.$('.mstrQualifierContainerConstant1View').$('.mstrCalendarAndTimePicker').$('.mstrCalendarAndTimePickerCellCalendarButton>span');
    }

    getUpperValueInput(promptElement) {
        return promptElement
            .$('.mstrQualifierContainerConstant2View')
            .$('.mstrCalendarAndTimePicker')
            .$('.mstrCalendarAndTimePickerCellTextBox>input');
    }

    getUpperInputCalendarIcon(promptElement) {
        return promptElement.$('.mstrQualifierContainerConstant2View').$('.mstrCalendarAndTimePicker').$('.mstrCalendarAndTimePickerCellCalendarButton>span');
    }

    getDynamicIcon(elem) {
        return elem.$$('.mstrCalendarAndTimePickerCellDynamicButton>span').filter(async (icon) => (await icon.isDisplayed()))[0];
    }
    // -------------------------
    // MQ specific locator
    // -------------------------

    getMQCondition(promptElement) {
        if (!this.isWeb()) {
            return promptElement.$('.mstrQualifierCellFunction');
        } else {
            return promptElement.$('.mstrQualifierContainerFunctionView').$('.mstrListPulldownTable');
        }
    }

    getMQConditionList(promptElement) {
        if (!this.isWeb()) {
            return this.getMQCondition(promptElement).$$('.mstrListBlockListContainer>div');
        } else {
            return promptElement.$('.mstrQualifierContainerFunctionView').$$('[class*="mstrListBlockItem"]');
        }
    }

    getMQLevel(promptElement) {
        return promptElement.$('.mstrQualifierContainerLevelView');
    }

    getMQLevelPullDown(promptElement) {
        if (!this.isWeb()) {
            return this.getMQLevel(promptElement).$('.mstrListPulldown');
        } else {
            return this.getMQLevel(promptElement).$('.mstrListPulldown').$('.mstrListPulldownTable');
        }
    }

    getMQLevelList(promptElement) {
        return this.getMQLevel(promptElement).$$('.mstrListBlockListContainer>div');
    }

    getChooseAttributesLink(promptElement) {
        return promptElement.$$('.mstrTextLink').filter(async (elem) => {
            const buttonText = await elem.getText();
            return buttonText === 'Choose attributes...';
        })[0];
    }

    getLowerValueInputValue(promptElement) {
        return getInputValue(this.getLowerValueInput(promptElement));
    }

    getAttibuteShoppingCart(promptElement) {
        return promptElement.$('.mstrFloatingEditor');
    }

    // -------------------------
    // AQ specific locator
    // -------------------------

    getQualType(promptElement) {
        return promptElement.$$('.mstrRadioListItemName');
    }

    getAttrForm(promptElement) {
        if (!this.isWeb()) {
            return promptElement.$('.mstrQualifierCellRight');
        } else {
            return promptElement.$('.mstrQualifierContainerFormView').$('.mstrListPulldownTable');
        }
    }

    getAttrFormList(promptElement) {
        if (!this.isWeb()) {
            return this.getAttrForm(promptElement).$$('.mstrListBlockListContainer>div');
        } else {
            return promptElement.$('.mstrQualifierContainerFormView').$$('.mstrListBlockListContainer>div');
        }
    }

    // Get condition
    getAQCondition(promptElement) {
        if (!this.isWeb()) {
            return promptElement.$('.mstrQualifierContainerFunctionView');
        } else {
            return promptElement.$('.mstrQualifierContainerFunctionView').$('.mstrListPulldownTable');
        }
    }

    getAQSelectCondition(promptElement) {
        return promptElement.$('.mstrQualifierContainerListFunctionView').$('.mstrListPulldownTable');
    }

    // Get condition list
    getAQConditionList(promptElement) {
        if (!this.isWeb()) {
            return this.getAQCondition(promptElement).$$('.mstrListBlockListContainer>div');
        } else {
            return promptElement.$('.mstrQualifierContainerFunctionView').$$('.mstrListBlockListContainer>div');
        }
    }

    getAQSelectConditionList(promptElement) {
        return promptElement.$('.mstrQualifierContainerListFunctionView').$$('.mstrListBlockListContainer>div');
    }

    getYourSelectionLocator(promptElement) {
        return promptElement.$('.mstrPromptQuestionSimpleAnswerViewTitleCellText>label');
    }

    getYourSelectionIcon(promptElement) {
        return promptElement.$('.mstrPromptQuestionSimpleAnswerViewTitleCellRadio');
    }

    getDefaultSelectionLocator(promptElement) {
        return promptElement.$('.mstrPromptQuestionComplexAnswerViewTitleCellText>label');
    }

    getDefaultAnswer(promptElement) {
        return promptElement.$('.mstrPromptQuestionComplexAnswerView');
    }

    // After click 'Edit...' and select values, the selections will be displayed here
    getValueSelectionList(promptElement) {
        return promptElement.$('.mstrQualifierContainerElementsView').$$('.mstrListBlockListContainer>div');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async clearInputLowerValue(promptElement) {
        return this.clear({ elem: this.getLowerValueInput(promptElement) }, true);
    }

    async clickInputValueInput(promptElement) {
        return this.getLowerValueInput(promptElement).click();
    }

    async openDropDownList(promptElement) {
        await this.getDropDownLocator(promptElement).click();
        return this.waitForElementVisible(
            this.getDropDownList(promptElement)[0],
            3000,
            'Drop down menu was not displayed.'
        );
    }

    async closeDropDownList(promptElement) {
        return this.getDropDownLocator(promptElement).click();
    }

    async selectDropDownItem(promptElement, text) {
        // Select AQ/MQ item
        await this.getItemByTextOfGivenItemList(this.getDropDownList(promptElement), text).click();
        return this.sleep(1000);
    }

    async currentDropdownSelection(promptElement) {
        return this.getDropDownLocator(promptElement).$('.mstrBGIcon_a.mstrListBlockItemName').getText();
    }

    async inputLowerValue(promptElement, value) {
        await this.getLowerValueInput(promptElement).setValue(value);
        return this.sleep(1000);
    }

    async clearAndInputLowserValue(promptElement, value) {
        await this.clear({ elem: this.getLowerValueInput(promptElement) }, true);
        await this.getLowerValueInput(promptElement).setValue(value);
        await this.enter();
        return this.sleep(1000);
    }

    async clearAndInputUpperValue(promptElement, value) {
        await this.clear({ elem: this.getUpperValueInput(promptElement) }, true);
        await this.getUpperValueInput(promptElement).setValue(value);
        return this.sleep(1000);
    }

    async clearUppperValue(promptElement) {
        await this.getUpperValueInput(promptElement).click();
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        return browser.keys('Delete');
    }

    async clickUpperValue(promptElement) {
        return this.getUpperValueInput(promptElement).click();
    }

    async inputUpperValue(promptElement, value) {
        await this.getUpperValueInput(promptElement).setValue(value);
        return this.sleep(1000);
    }

    async openBrowseValuesWindow(promptElement) {
        return this.getLink(promptElement, 'Browse values...').click();
    }

    async openImportFileWindow(promptElement) {
        return this.getLink(promptElement, 'Import file...').click();
    }

    async openChooseAttributesWindow(promptElement) {
        await this.getLink(promptElement, 'Choose attributes...').click();
        await this.sleep(5000);
        await this.waitForElementInvisible(
            this.$('.mstrListBlockContents').$('.mstrListBlockMessage'),
            this.DEFAULT_TIMEOUT,
            'Choose attribute was not displayed.'
        );
        return this.sleep(3000); // wait for search interactable
    }

    async confirmBrowserValues(promptElement) {
        await promptElement
            .$$('.mstrButton')
            .filter(async (elem) => {
                const text = await elem.getAttribute('value');
                return text === 'OK';
            })[0]
            .click();
        return this.sleep(1000);
    }

    async editAttrSelection(promptElement) {
        const editButton = this.getLink(promptElement, 'Edit...');
        await this.waitForElementVisible(editButton);
        await editButton.click();
        return this.sleep(1000);
    }

    // -------------------------
    // MQ specific actions
    // -------------------------

    async openMQConditionList(promptElement) {
        await this.getMQCondition(promptElement).click();
        return this.waitForElementVisible(
            this.getMQConditionList(promptElement)[0],
            3000,
            'Condition list was not displayed.'
        );
    }

    async closeMQConditionList(promptElement) {
        return this.getMQCondition(promptElement).click();
    }

    async openMQLevelList(promptElement) {
        await this.getMQLevelPullDown(promptElement).click();
        return this.waitForElementVisible(this.getMQLevelList(promptElement)[0], 3000, 'Level list was not displayed.');
    }

    async closeMQLevelList(promptElement) {
        return this.getMQLevelPullDown(promptElement).click();
    }

    async selectMQCondition(promptElement, conName) {
        return this.getItemByTextOfGivenItemList(this.getMQConditionList(promptElement), conName).click();
    }

    async selectMQLevel(promptElement, levelName) {
        return this.getItemByTextOfGivenItemList(this.getMQLevelList(promptElement), levelName).click();
    }

    // -------------------------
    // AQ specific action
    // -------------------------

    async openAttrFormList(promptElement) {
        await this.getAttrForm(promptElement).click();
        return this.waitForElementVisible(
            this.getAttrFormList(promptElement)[0],
            3000,
            'Attribute Form list was not displayed.'
        );
    }

    async openAQCondotion(promptElement) {
        await this.getAQCondition(promptElement).click();
        return this.waitForElementVisible(
            this.getAQConditionList(promptElement)[0],
            3000,
            'Condition list was not displayed.'
        );
    }

    async openAQSelectCondotion(promptElement) {
        await this.getAQSelectCondition(promptElement).click();
        return this.waitForElementVisible(
            this.getAQSelectConditionList(promptElement)[0],
            3000,
            'Condition list was not displayed.'
        );
    }

    async selectYourSelection(promptElement) {
        return this.getYourSelectionLocator(promptElement).click();
    }

    async selectYourSelectionIcon(promptElement) {
        return this.getYourSelectionIcon(promptElement).click();
    }

    async selectDefaultSelection(promptElement) {
        return this.getDefaultSelectionLocator(promptElement).click();
    }

    async getDefaultAnswerText(promptElement) {
        return this.getDefaultAnswer(promptElement).getText();
    }

    async selectAttrForm(promptElement, form) {
        await this.getItemByTextOfGivenItemList(this.getAttrFormList(promptElement), form).click();
        return this.sleep(1000);
    }

    async scrollDownConditionList(promptElement, offset) {
        return this.scrollDown(this.getAQCondition(promptElement).$('.mstrListBlockContents'), offset);
    }

    async selectAQCondition(promptElement, form) {
        await this.waitForElementVisible(
            this.getItemByTextOfGivenItemList(this.getAQConditionList(promptElement), form),
            3000,
            'Condition list was not displayed.'
        );
        await this.getItemByTextOfGivenItemList(this.getAQConditionList(promptElement), form).click();
        return this.sleep(1000);
    }

    async selectAQSelectCondition(promptElement, form) {
        await this.waitForElementVisible(
            this.getItemByTextOfGivenItemList(this.getAQSelectConditionList(promptElement), form),
            3000,
            'Condition list was not displayed.'
        );
        await this.getItemByTextOfGivenItemList(this.getAQSelectConditionList(promptElement), form).click();
        return this.sleep(1000);
    }

    async selectAQType(promptElement, type) {
        return this.getQualType(promptElement)
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === type;
            })[0]
            .click();
    }

    async openLowerInputCalendar(promptElement) {
        return this.getLowerInputCalendarIcon(promptElement).click();
    }

    async openUpperInputCalendar(promptElement) {
        return this.getUpperInputCalendarIcon(promptElement).click();
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async isLowerValueInputVisible(promptElement) {
        return this.getLowerValueInput(promptElement).isDisplayed();
    }

    async isUpperValueInputVisible(promptElement) {
        return this.getUpperValueInput(promptElement).isDisplayed();
    }

    async isBrowseValueVisible(promptElement) {
        const link = this.getLink(promptElement, 'Browse values...');
        return link.isDisplayed();
    }

    async isImportFileVisible(promptElement) {
        const link = this.getLink(promptElement, 'Import file...');
        return link.isDisplayed();
    }

    //------------------
    // AQ Specific
    //------------------

    // The condition locator is attribute form locator when there is no attribute form
    async getAQConditionTextNoAttr(promptElement) {
        return this.getAttrForm(promptElement).$('.mstrListPulldownContent').getText();
    }

    async getValueSelectionListCount(promptElement) {
        return this.getValueSelectionList(promptElement).length;
    }

    async isDynamicIconVisibleInLowerInput(promptElement) {
        const el = promptElement.$('.mstrQualifierContainerConstant1View');
        return this.getDynamicIcon(el).isDisplayed();
    }

    async isDynamicIconVisibleInUpperInput(promptElement) {
        const el = promptElement.$('.mstrQualifierContainerConstant2View');
        return this.getDynamicIcon(el).isDisplayed();
    }
}
