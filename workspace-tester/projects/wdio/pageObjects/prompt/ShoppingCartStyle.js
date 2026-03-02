import BasePrompt from '../base/BasePrompt.js';
import PromptSearchbox from '../common/PromptSearchbox.js';

export default class ShoppingCartStyle extends BasePrompt {
    constructor() {
        super();
        this.searchbox = new PromptSearchbox();
    }

    /****************************************************************
     * Private helper methods
     ****************************************************************/

    getAnyAllButton(promptElement, content) {
        return this.getPromptContents(promptElement)
            .$$('.mstrRadioListItemName')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === content;
            })[0];
    }

    filterConditions(conditions, text) {
        return conditions.filter(async (elem) => {
            const textTmp = await elem.getText();
            return textTmp === text;
        });
    }

    getListContainer(promptElement) {
        return promptElement.$$('.mstrListBlockListContainer');
    }

    getSearchBoxContainer(promptElement) {
        return promptElement.$('.mstrTextBoxWithIconCellInput').$('input');
    }

    getListLocatorName() {
        return '.mstrListBlockListContainer>div';
    }

    getListLocatorNameLink() {
        return '.mstrListBlockListContainer>div a';
    }

    async clickOKCancel(promptElement, content) {
        return promptElement
            .$$('.mstrButton')
            .filter(async (elem) => {
                const text = await elem.getAttribute('value');
                return text === content;
            })[0]
            .click();
    }

    async clickOKinCustomization(Customization, promptElement) {
        return promptElement
            .$$(Customization)
            .filter(async (elem) => {
                const text = await elem.getAttribute('value');
                return text === 'OK';
            })[0]
            .click();
    }

    async getCartItemCount(cart) {
        const selectCount = await cart.$$('.mstrListBlockItemSelected').length;
        const noSelectCount = await cart.$$('.mstrListBlockItem').length;
        const hoverCount = await cart.$$('.mstrListBlockItemHover').length;
        const selectHoverCount = await cart.$$('.mstrListBlockItemSelectedHover').length;
        return selectCount + noSelectCount + hoverCount + selectHoverCount;
    }

    /****************************************************************
     * Element locator
     ****************************************************************/

    getPromptContents(promptElement, isInnerShoppingCart = false) {
        const shoppingCartlist = promptElement.$('.mstrPromptQuestionContents').$$('.mstrListCart');
        const index = isInnerShoppingCart ? 1 : 0;
        return shoppingCartlist[index];
    }

    getAvailableListLocator(promptElement, isInnerShoppingCart = false) {
        return this.getPromptContents(promptElement, isInnerShoppingCart).$('.mstrListCartCellAvailableView');
    }

    getSelectedListLocator(promptElement, isInnerShoppingCart = false) {
        return this.getPromptContents(promptElement, isInnerShoppingCart).$('.mstrListCartCellSelectedView');
    }

    getSelectedObjectList(promptElement, isInnerShoppingCart = false) {
        return this.getSelectedListLocator(promptElement, isInnerShoppingCart).$$('.mstrListBlockItemName');
    }

    getButtons(promptElement, isInnerShoppingCart = false) {
        return this.getPromptContents(promptElement, isInnerShoppingCart).$('.mstrListCartCellAddRemoveButtons');
    }

    getAddAllButton(promptElement, isInnerShoppingCart) {
        return this.getButtons(promptElement, isInnerShoppingCart).$('.mstrBGIcon_tbAddAll');
    }

    getAddButton(promptElement, isInnerShoppingCart = false) {
        return this.getButtons(promptElement, isInnerShoppingCart).$('.mstrBGIcon_tbAdd');
    }

    getRemoveAllButton(promptElement, isInnerShoppingCart) {
        return this.getButtons(promptElement, isInnerShoppingCart).$('.mstrBGIcon_tbRemoveAll');
    }

    getRemoveButton(promptElement, isInnerShoppingCart = false) {
        return this.getButtons(promptElement, isInnerShoppingCart).$('.mstrBGIcon_tbRemove');
    }

    getDeleteButton(promptElement, index, isBasedOnRoot = false) {
        return this.getNthSelectedItem(promptElement, index, isBasedOnRoot).$('.mstrBGIcon_tbDelete');
    }

    getMoveUpButton(promptElement) {
        return promptElement.$('.mstrBGIcon_tbUp');
    }

    getMoveDownButton(promptElement) {
        return promptElement.$('.mstrBGIcon_tbDown');
    }

    getGroupButton(promptElement) {
        return promptElement.$('.mstrBGIcon_tbGroupConditions');
    }

    getUngroupButton(promptElement) {
        return promptElement.$('.mstrBGIcon_tbUngroupConditions');
    }

    // Followings are used in qualify prompt
    // index is integer 1, 2, 3...
    getNthSelectedItem(promptElement, index, isBasedOnRoot = false) {
        return this.getSelectedListToEdit(promptElement, isBasedOnRoot)[index - 1];
    }

    getNthSelectedObj(promptElement, index, isBasedOnRoot = false) {
        return this.getSelectedObjToEdit(promptElement, isBasedOnRoot)[index - 1];
    }

    getItemValueInput(promptElement) {
        return promptElement.$('.mstrCalendarAndTimePickerCellTextBox').$('input');
    }

    getPopupButtons(promptElement) {
        return promptElement.$('.mstrPopupCellButtonBar');
    }

    getPopupButtonsItems(promptElement, content) {
        return this.getPopupButtons(promptElement).$(`input[value=${content}]`);
    }

    getAllSelectionsButton(promptElement) {
        return this.getAnyAllButton(promptElement, 'All selections');
    }

    getAnySelectionButton(promptElement) {
        return this.getAnyAllButton(promptElement, 'Any selection');
    }

    getAvailableList(promptElement, isInnerShoppingCart = false) {
        return this.getAvailableListLocator(promptElement, isInnerShoppingCart).$$(this.getListLocatorName());
    }

    getLinkInAvailableList(promptElement) {
        return this.getAvailableListLocator(promptElement).$$(this.getListLocatorNameLink());
    }

    // state: loading/error...
    getAvailableReadyState(promptElement) {
        return this.getAvailableListLocator(promptElement).$('.mstrListBlockReadyState');
    }

    getFetchView(promptElement) {
        return promptElement.$('.mstrListCartCellFetchView');
    }

    getFetchFirst(promptElement) {
        return this.getFetchView(promptElement).$('.mstrBGIcon_fetchFirst');
    }

    getFetchPrevious(promptElement) {
        return this.getFetchView(promptElement).$('.mstrBGIcon_fetchPrevious');
    }

    getFetchNext(promptElement) {
        return this.getFetchView(promptElement).$('.mstrBGIcon_fetchNext');
    }

    getFetchLast(promptElement) {
        return this.getFetchView(promptElement).$('.mstrBGIcon_fetchLast');
    }

    getNthExpr(promptElement, index) {
        return promptElement.$$('.mstrExprEditorANDORContainer>a')[index - 1];
    }

    getExprList(promptElement) {
        return promptElement.$('#ListBlockContents_ExpressionBranchQualPopup1').$$('.mstrListBlockListContainer>div');
    }

    // -------------------------
    // AQ Prompt specific
    // -------------------------

    getSelectedList(promptElement) {
        return this.getSelectedListLocator(promptElement).$$(this.getListLocatorName());
    }

    /**
     * An selected item can be divided into 5 parts: type, attribute form, qualification condition, value and item list
     * For example1: Month Qualify(type) ID(attribute form) Equals(qualification condition) 1(value)
     * For example2: Month Select(type) In list(qualification condition) Jan(item list)
     * This function is to get 3 parts, to get item list and value use getItemValuePart()
     */
    getItemQualPart(promptElement, index, part) {
        let expression;
        if (part === 'type') {
            expression = 'ExpressionTypePopup1';
        } else if (part === 'form') {
            expression = 'ExpressionFormPopup1';
        } else if (part === 'condition') {
            expression = 'ExpressionFunctionPopup1';
        }

        if (!this.isWeb()) {
            return this.getNthSelectedItem(promptElement, index)
                .$$('.mstrExprEditorFunc>a')
                .filter(async (elem) => {
                    const text = await elem.getAttribute('mstrpopupinfo');
                    return text === expression;
                })[0];
            } else {
            return this.getNthSelectedItem(promptElement, index)
                .$$('[class*="mstrExprEditorConditionContainer"] > a')
                .filter(async (elem) => {
                    const text = await elem.getAttribute('mstrpopupinfo');
                    return text === expression;
                })[0];
        }
    }

    getItemValuePart(promptElement, index, part) {
        let expression;
        if (part === 'list') {
            expression = 'ExpressionElementsPopup1';
        } else if (part === 'value1') {
            expression = 'ExpressionConstant1Popup1';
        } else if (part === 'value2') {
            expression = 'ExpressionConstant2Popup1';
        }

        if (!this.isWeb()) {
            return this.getNthSelectedItem(promptElement, index)
                .$$('.mstrExprEditorElements>a')
                .filter(async (elem) => {
                    const text = await elem.getAttribute('mstrpopupinfo');
                    return text === expression;
                })[0];
            } else {
            return this.getNthSelectedItem(promptElement, index)
                .$$('[class*="mstrExprEditorConditionContainer"] > a')
                .filter(async (elem) => {
                    const text = await elem.getAttribute('mstrpopupinfo');
                    return text === expression;
                })[0];
        }
    }

    // Shopping Cart: item with editors to trigger
    // isBasedOnRoot: the items root might be mstrExprEditorRootParent in some cases, especially when there are only one item
    getSelectedListToEdit(promptElement, isBasedOnRoot = false) {
        let listLocatorScript = '.mstrExprEditorBranchQualContent>div';
        if (isBasedOnRoot) {
            listLocatorScript = '.mstrExprEditorRootParent>div';
        }
        return this.getSelectedListLocator(promptElement)
            .$$(listLocatorScript)
            .filter(async (elem) => {
                const text = await elem.getAttribute('class');
                return (
                    text === 'mstrExprEditorConditionContainer' ||
                    text === 'mstrExprEditorConditionContainerHover' ||
                    text === 'mstrExprEditorConditionContainerSelected' ||
                    text === 'mstrExprEditorConditionContainerSelectedHover'
                );
            });
    }

    getSelectedObjToEdit(promptElement, isBasedOnRoot = false) {
        let listLocatorScript = '.mstrExprEditorBranchQualContent>div';
        if (isBasedOnRoot) {
            listLocatorScript = '.mstrExprEditorRootParent>div';
        }
        return this.getSelectedListLocator(promptElement)
            .$(listLocatorScript)
            .$$('.mstrExprEditorAttribute, .mstrExprEditorMetric');
    }

    getSelectedListToEditItemByTextList(promptElement, itemText, isBasedOnRoot = false) {
        return this.getSelectedListToEdit(promptElement, isBasedOnRoot).filter(async (elem) => {
            const text = await elem.getText();
            return text === itemText;
        });
    }

    // Shopping Cart: get the item by given text
    getSelectedListToEditItemByText(promptElement, itemText, isBasedOnRoot = false) {
        return this.getSelectedListToEditItemByTextList(promptElement, itemText, isBasedOnRoot)[0];
    }

    // Type list content: Qualify/Select
    getTypeList(promptElement) {
        return promptElement.$('#ListBlockContents_ExpressionTypePopup1').$$(this.getListLocatorName());
    }

    getFormList(promptElement) {
        return promptElement.$('#ListBlockContents_ExpressionFormPopup1').$$(this.getListLocatorName());
    }

    getConditionList(promptElement) {
        return this.getConditionListLocator(promptElement).$$(this.getListLocatorName());
    }

    getConditionListLocator(promptElement) {
        return promptElement.$('#ListBlockContents_ExpressionFunctionPopup1');
    }

    // Pop up another shopping cart
    getValueListEditor(promptElement) {
        return promptElement.$('#ExpressionElementsPopup1');
    }

    getValuePart1ListEditor(promptElement) {
        return promptElement.$('#ExpressionFormValues1Popup1');
    }

    getValuePart1Editor(promptElement) {
        return promptElement.$('#ExpressionConstant1Popup1');
    }

    getValuePart1Calendar(promptElement) {
        return this.getValuePart1Editor(promptElement).$('.mstrCalendarAndTimePickerCellCalendarButton span');
    }

    getValuePart2Editor(promptElement) {
        return promptElement.$('#ExpressionConstant2Popup1');
    }

    getValuePart2Calendar(promptElement) {
        return this.getValuePart2Editor(promptElement).$('.mstrCalendarAndTimePickerCellCalendarButton span');
    }

    getImportFileEditor(promptElement) {
        return promptElement.$$('.mstrPopup.mstrAsPopup')
            .filter(async (elem) => {
                return elem.isDisplayed();
            })[0];
    }

    getImportButtoninEditor(promptElement) {
        return this.getImportFileEditor(promptElement).$('.mstrTextAreaWithImportImport').$('input[value=Import]');
    }

    getOKButtoninEditor(promptElement) {
        return this.getImportFileEditor(promptElement).$('.mstrPopupCellButtonBar').$('input[value=OK]');
    }

    getCancelButtoninEditor(promptElement) {
        return this.getImportFileEditor(promptElement).$('.mstrPopupCellButtonBar').$('input[value=Cancel]');
    }

    getInputAreainImportFile(promptElement) {
        return this.getImportFileEditor(promptElement).$('.mstrTextAreaWithImportInput>textarea');
    }

    getLink(promptElement, linkText) {
        return promptElement.$$('.mstrTextLinkAnchor').filter(async (elem) => {
            const text = await elem.getText();
            return text === linkText;
        })[0];
    }

    // -------------------------
    // Hierarchy Prompt specific
    // -------------------------

    //Click the condition, the class name will be mstrExprEditorConditionContainerSelected
    getConditionSelectedItems(promptElement) {
        return promptElement.$$('.mstrExprEditorConditionContainerSelected');
    }

    //Normal condition class name mstrExprEditorConditionContainer
    getConditionNotSelectedItems(promptElement) {
        return promptElement.$$('.mstrExprEditorConditionContainer');
    }

    getAddRightButton(promptElement) {
        return this.getAvailableListLocator(promptElement).$('.mstrToolButtonRoundedRight');
    }

    // -------------------------
    // MQ Prompt specific
    // -------------------------

    //For condition part, reuse the method for AQ prompt
    getLevelPart(promptElement, index) {
        if (!this.isWeb()) {
            return this.getNthSelectedItem(promptElement, index).$('.mstrExprEditorLevel>a');
        } else {
            return this.getNthSelectedItem(promptElement, index)
                .$$('[class*="mstrExprEditorConditionContainer"] > a')
                .filter(async (elem) => {
                    const text = await elem.getAttribute('mstrpopupinfo');
                    return text === 'ExpressionLevelPopup1';
                })[0];
        }
    }

    getMQValuePart(promptElement, index) {
        return this.getNthSelectedItem(promptElement, index).$$('.mstrExprEditorConstants>a');
    }

    getLevelList(promptElement) {
        return promptElement.$('#ExpressionLevelPopup1').$$('.mstrListBlockListContainer>div');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async removeAll(promptElement, isInnerShoppingCart = false) {
        await this.sleep(3000); // wait for element list display
        return (
            await this.safeGetElement(
                this.getRemoveAllButton(promptElement, isInnerShoppingCart),
                '"Remove All" button is not displayed.'
            )
        ).click();
    }

    async addAll(promptElement, isInnerShoppingCart = false) {
        await this.sleep(3000); // wait for element list display
        return (
            await this.safeGetElement(
                this.getAddAllButton(promptElement, isInnerShoppingCart),
                '"Add All" button is not displayed.'
            )
        ).click();
    }

    async addSingle(promptElement, isInnerShoppingCart = false) {
        return (
            await this.safeGetElement(
                this.getAddButton(promptElement, isInnerShoppingCart),
                '"Add" button is not displayed.'
            )
        ).click();
    }
    
    async addSingleForWeb(promptElement, elementName) {
        await this.clickElmInAvailableList(promptElement, elementName);
        await this.addSingle(promptElement);
    }

    async removeSingle(promptElement, isInnerShoppingCart = false) {
        await this.sleep(3000); // wait for element list display
        return (
            await this.safeGetElement(this.getRemoveButton(promptElement, isInnerShoppingCart), '"Remove button is not displayed.')
        ).click();
    }

    async deleteSingle(promptElement, index, isBasedOnRoot = false) {
        await this.getDeleteButton(promptElement, index, isBasedOnRoot).click();
        return this.sleep(1000);
    }

    async clickElmInAvailableList(promptElement, elmName, isInnerShoppingCart = false) {
        await this.waitForElementVisible(this.getPromptContents(promptElement, isInnerShoppingCart));
        await this.waitForElementVisible(this.getAvailableListLocator(promptElement, isInnerShoppingCart));
        await this.waitForElementVisible(
            this.getItemByTextOfGivenItemList(this.getAvailableList(promptElement, isInnerShoppingCart), elmName),
            30000,
            'The item is not in available list'
        );
        return this.getItemByTextOfGivenItemList(this.getAvailableList(promptElement, isInnerShoppingCart), elmName).click();
    }

    // For hierarchy prompt, click the name can enter subfolder
    async clickElmLinkInAvailableList(promptElement, elmName) {
        await this.waitForElementVisible(this.getPromptContents(promptElement));
        await this.waitForElementVisible(this.getAvailableListLocator(promptElement));
        await this.waitForElementVisible(
            this.getItemByTextOfGivenItemList(this.getAvailableList(promptElement), elmName),
            30000,
            'The item is not in available list'
        );
        await this.getItemByTextOfGivenItemList(this.getLinkInAvailableList(promptElement), elmName).click();
        return this.sleep(3000); // wait for loading... to display
    }

    async searchFor(promptElement, text) {
        await this.searchbox.searchFor(promptElement, text);
        await this.sleep(3000); // wait for loading... to display
        await this.waitForElementInvisible(this.getAvailableReadyState(promptElement));
        return this.sleep(3000); // Wait for animation to complete
    }

    async clearSearch(promptElement) {
        return this.searchbox.clearSearch(promptElement);
    }

    async clearAndSearch(promptElement, text) {
        await this.clearSearch(promptElement);
        return this.searchFor(promptElement, text);
    }

    async clickMatchCase(promptElement) {
        return this.searchbox.clickMatchCase(promptElement);
    }

    async clickFetchFirst(promptElement) {
        return this.getFetchFirst(promptElement).click();
    }

    async clickFetchPrevious(promptElement) {
        await this.getFetchPrevious(promptElement).click();
        await this.waitForElementInvisible(this.getAvailableReadyState(promptElement));
        return this.sleep(1000); // Wait for animation to complete
    }

    async clickFetchNext(promptElement) {
        await this.getFetchNext(promptElement).click();
        await this.waitForElementInvisible(this.getAvailableReadyState(promptElement));
        return this.sleep(2000); // Wait for animation to complete
    }

    async clickFetchLast(promptElement) {
        return this.getFetchLast(promptElement).click();
    }

    async clickdeleteConditionIcon(promptElement) {
        return promptElement.$('.mstrToolButtonRounded>img[title="Delete conditions"]').click();
    }

    async addNewCondition(promptElement) {
        return promptElement.$('.mstrToolButtonRounded>img[title="New Condition"]').click();
    }

    async openImportbyIcon(promptElement) {
        return promptElement.$('.mstrToolButtonRounded>img[title="Import file..."]').click();
    }

    async upOneLevel(promptElement) {
        return promptElement.$('.mstrToolButtonRounded>img[title="Up One Level"]').click();
    }

    async importFile(promptElement) {
        return this.getImportButtoninEditor(promptElement).click();
    }

    async confirmFileEditor(promptElement) {
        return this.getOKButtoninEditor(promptElement).click();
    }

    async cancelFileEditor(promptElement) {
        return this.getCancelButtoninEditor(promptElement).click();
    }

    async deleteCondition(promptElement, index, isBasedOnRoot = false) {
        await this.clickNthSelectedItem(promptElement, index, isBasedOnRoot);
        return this.clickdeleteConditionIcon(promptElement);
    }

    async backToTop(promptElement) {
        return promptElement.$('.mstrPromptQuestionBackToTopImg').click();
    }

    // -------------------------
    // Qualify Prompt specific
    // -------------------------

    async clickNthSelectedItem(promptElement, index, isBasedOnRoot = false) {
        return this.getNthSelectedItem(promptElement, index, isBasedOnRoot).click();
    }

    async clickNthSelectedItemWithOffset(promptElement, index, isBasedOnRoot = false) {
        return this.clickByXYPosition({
            elem: this.getNthSelectedItem(promptElement, index, isBasedOnRoot),
            x: 0,
            y: 10
        });
    }

    async clickNthSelectedObj(promptElement, index, isBasedOnRoot = false) {
        return this.getNthSelectedObj(promptElement, index, isBasedOnRoot).click();
    }

    async openTypeDropdown(promptElement, index) {
        await this.getItemQualPart(promptElement, index, 'type').click();
        return this.waitForElementVisible(this.getTypeList(promptElement)[0], 3000, 'The type dorpdown is not open');
    }

    async openFormDropdown(promptElement, index) {
        await this.getItemQualPart(promptElement, index, 'form').click();
        return this.waitForElementVisible(this.getFormList(promptElement)[0], 3000, 'The form dorpdown is not open');
    }

    async scrollDownConditionList(promptElement, offset) {
        return this.scrollDown(this.getConditionListLocator(promptElement), offset);
    }

    async scrollAvailableList(promptElement, offset) {
        return this.scrollDown(this.getAvailableListLocator(promptElement).$('.mstrListBlockContents'), offset);
    }

    async openConditionDropdown(promptElement, index) {
        await this.getItemQualPart(promptElement, index, 'condition').click();
        return this.waitForElementVisible(
            this.getConditionList(promptElement)[0],
            3000,
            'The condition dorpdown is not open'
        );
    }

    async openLevelDropdown(promptElement, index) {
        await this.getLevelPart(promptElement, index).click();
        return this.waitForElementVisible(this.getLevelList(promptElement)[0], 3000, 'The level dorpdown is not open');
    }

    async openValueListEditor(promptElement, index) {
        await this.getItemValuePart(promptElement, index, 'list').click();
        await this.waitForElementVisible(
            this.getValueListEditor(promptElement),
            3000,
            'The value list editor is not open'
        );
        return this.sleep(1000);
    }

    async openValuePart1Editor(promptElement, index) {
        await this.getItemValuePart(promptElement, index, 'value1').click();
        return this.waitForElementVisible(
            this.getItemValueInput(promptElement),
            3000,
            'The value part 1 editor is not open'
        );
    }

    async openValuePart1Calendar(promptElement) {
        await this.getValuePart1Calendar(promptElement).click();
    }

    async openValuePart2Editor(promptElement, index) {
        await this.getItemValuePart(promptElement, index, 'value2').click();
        return this.waitForElementVisible(
            this.getValuePart2Editor(promptElement),
            3000,
            'The value part 2 editor is not open'
        );
    }

    async openValuePart2Calendar(promptElement) {
        await this.getValuePart2Calendar(promptElement).click();
    }

    async openBrowseValuesWindow(promptElement) {
        await this.getLink(promptElement, 'Browse values...').click();
        return this.waitForElementVisible(
            this.getValuePart1ListEditor(promptElement),
            3000,
            'The value part 1 list editor is not open'
        );
    }

    async openImportFileWindow(promptElement) {
        await this.getLink(promptElement, 'Import file...').click();
        return this.waitForElementVisible(
            this.getImportFileEditor(promptElement),
            3000,
            'The Import file editor is not open'
        );
    }

    async switchEnterValues(promptElement) {
        return this.getLink(promptElement, 'Enter values...').click();
    }

    async inputTextinImportFile(promptElement, value) {
        await this.getInputAreainImportFile(promptElement).setValue(value);
        return this.sleep(1000);
    }

    async selectType(promptElement, typeText) {
        return (
            await this.safeGetElement(
                this.getItemByTextOfGivenItemList(this.getTypeList(promptElement), typeText),
                'The type is not in the list.'
            )
        ).click();
    }

    async selectForm(promptElement, formText) {
        return (
            await this.safeGetElement(
                this.getItemByTextOfGivenItemList(this.getFormList(promptElement), formText),
                'The form is not in the list.'
            )
        ).click();
    }

    async selectCondition(promptElement, conditionText) {
        return (
            await this.safeGetElement(
                this.getItemByTextOfGivenItemList(this.getConditionList(promptElement), conditionText),
                'The condition is not in the list.'
            )
        ).click();
    }

    async selectLevel(promptElement, levelName) {
        return (
            await this.safeGetElement(
                this.getItemByTextOfGivenItemList(this.getLevelList(promptElement), levelName),
                'The level is not in the list.'
            )
        ).click();
    }

    async chooseAnySelection(promptElement) {
        return this.getAnySelectionButton(promptElement).click();
    }

    async chooseAllSelections(promptElement) {
        return this.getAllSelectionsButton(promptElement).click();
    }

    async openEditValueWindow(promptElement, index) {
        await this.sleep(500);
        await this.getItemValuePart(promptElement, index, 'value1').click();
        return this.waitForElementVisible(
            this.getPopupButtons(promptElement),
            3000,
            'Attribute values page was not displayed.'
        );
    }

    async inputValues(promptElement, value) {
        await this.getItemValueInput(promptElement).setValue(value);
        return this.sleep(1000);
    }

    async clickValueInput(promptElement) {
        return this.getItemValueInput(promptElement).click();
    }

    async confirmValues(promptElement) {
        await this.clickOKCancel(promptElement, 'OK');
        return this.sleep(1000);
    }

    async cancelValues(promptElement) {
        return this.clickOKCancel(promptElement, 'Cancel');
    }

    async clickButton(promptElement, content) {
        return this.click({ elem: this.getPopupButtonsItems(promptElement, content) });
    }

    async clearValues(promptElement) {
        await this.clear({ elem: this.getItemValueInput(promptElement) }, true);
    }

    async clearByKeyboard(promptElement) {
        await this.selectAll(this.getItemValueInput(promptElement));
        return this.delete();
    }

    async clearAndInputValues(promptElement, value) {
        await this.clearValues(promptElement);
        await this.inputValues(promptElement, value);
    }

    async openNthExprMenu(promptElement, index) {
        await this.getNthExpr(promptElement, index).click();
        return this.waitForElementVisible(
            this.getExprList(promptElement)[0],
            3000,
            'Expression menu was not displayed.'
        );
    }

    async chooseNthExpr(promptElement, index) {
        return this.getExprList(promptElement)[index - 1].click();
    }

    async moveUp(promptElement) {
        return this.getMoveUpButton(promptElement).click();
    }

    async moveDown(promptElement) {
        return this.getMoveDownButton(promptElement).click();
    }

    async groupItems(promptElement) {
        return this.getGroupButton(promptElement).click();
    }

    async ungroupItems(promptElement) {
        return this.getUngroupButton(promptElement).click();
    }

    // -------------------------
    // Shopping cart specific
    // -------------------------

    async clickElmInSelectedListToEdit(promptElement, itemText) {
        return this.getSelectedListToEditItemByText(promptElement, itemText).click();
    }

    // -------------------------
    // MQ Specific
    // -------------------------

    async openMQFirstValue(promptElement, index) {
        await this.getMQValuePart(promptElement, index)[0].click();
        await this.waitForElementVisible(this.getItemValueInput(promptElement), {
            timeout: 3000,
            msg: 'The value part 1 editor is not open',
        });
    }

    async openMQSecondValue(promptElement, index) {
        await this.getMQValuePart(promptElement, index)[1].click();
        await this.waitForElementVisible(this.getItemValueInput(promptElement), {
            timeout: 3000,
            msg: 'The value part 2 editor is not open',
        });
    }

    async getMQValuePartText(promptElement, index) {
        return this.getMQValuePart(promptElement, index)[0].getText();
    }

    // -------------------------
    // AQ Specific
    // -------------------------

    // For Pupup shopping cart in AQ Pull Down style
    async waitForShoppingCart(promptElement) {
        const el = this.getAvailableListLocator(promptElement).$$('.mstrBGIcon_ae.mstrListBlockItemName')[0];
        await this.waitForElementVisible(el, {
            timeout: 3000,
            msg: 'Attribute values page was not displayed.',
        });
    }

    // AQ: Shopping cart popup, no editors
    async clickElmInSelectedList(promptElement, elmName) {
        (
            await this.safeGetElement(
                this.getItemByTextOfGivenItemList(this.getSelectedList(promptElement), elmName),
                'The item is not in selected list.'
            )
        ).click();
        return this.sleep(1000);
    }

    // -------------------------
    // Hierarchy Prompt specific
    // -------------------------

    //To get the specific condition accodring to text and click
    async clickConditionItem(promptElement, text) {
        //The class name of condition will be changed if you click one of the condition
        //To iterate all the conditions, we have to handle selected conditions and not selected conditions
        let notSelected = this.filterConditions(this.getConditionNotSelectedItems(promptElement), text);
        let count = await notSelected.length;
        if (count > 0) {
            return notSelected[0].click();
        }

        let selected = await this.filterConditions(this.getConditionSelectedItems(promptElement), text);
        return selected[0].click();
    }

    async addRight(promptElement) {
        return this.getAddRightButton(promptElement).click();
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    // Get the count of given item in available list
    async getItemInAvailableListCount(promptElement, elmName) {
        return this.getItemByTextOfGivenItemList(this.getAvailableList(promptElement), elmName).length;
    }

    // Get the count of given item in selected list
    async getItemInSelectedCount(promptElement, elmName) {
        return this.getItemByTextOfGivenItemList(this.getSelectedList(promptElement), elmName).length;
    }

    async isButtonEnabled(promptElement, button) {
        const opacity = (await this[`get${button}Button`](promptElement).getCSSProperty('opacity')).value;
        return opacity !== 0.4;
    }

    async getNthSelectedItemText(promptElement, index) {
        return this.getNthSelectedItem(promptElement, index).getText();
    }

    async getItemCountText(promptElement) {
        return this.getPromptContents(promptElement).$('.mstrFetchControlText').getText();
    }

    async getAvailableCartItemCount(promptElement, isInnerShoppingCart = false) {
        return this.getCartItemCount(this.getAvailableListLocator(promptElement, isInnerShoppingCart));
    }

    async getSelectedCartItemCount(promptElement, isInnerShoppingCart = false) {
        return this.getCartItemCount(this.getSelectedListLocator(promptElement, isInnerShoppingCart));
    }

    async getSelectedConditionItemCount(promptElement) {
        const selected = await this.getConditionSelectedItems(promptElement).length;
        const deselected = await this.getConditionNotSelectedItems(promptElement).length;
        return selected + deselected;
    }

    async isItemInAvailableList(promptElement, itemText) {
        const el = this.getItemByTextOfGivenItemList(this.getAvailableList(promptElement), itemText);
        return el.isDisplayed();
    }

    async getNthExprText(promptElement, index) {
        return this.getNthExpr(promptElement, index).getText();
    }

    // ----------------------------------------
    // Shopping cart specific
    // ----------------------------------------

    async isItemInSelectedListToEdit(promptElement, itemText, isBasedOnRoot = false) {
        if ((await this.getSelectedListToEditItemByTextList(promptElement, itemText, isBasedOnRoot).length) < 1) {
            return false;
        }
        const el = this.getSelectedListToEditItemByText(promptElement, itemText, isBasedOnRoot);
        return el.isDisplayed();
    }

    // ----------------------------------------
    // Shopping cart triggered by other styles
    // ----------------------------------------

    // AQ: Shopping cart popup
    async isItemInSelectedList(promptElement, itemText) {
        return this.getItemByTextOfGivenItemList(this.getSelectedList(promptElement), itemText).isDisplayed();
    }

    async getSelectedListCount(promptElement) {
        return this.getSelectedList(promptElement).length;
    }

    async getSelectedObjectListText(promptElement) {
        const selectedList = await this.getSelectedObjectList(promptElement);
        const textList = [];

        for (const elem of selectedList) {
            const text = await elem.getText();
            textList.push(text);
        }

        return textList;
    }

    async isImportFileEditorDisplay(promptElement) {
        return this.getImportFileEditor(promptElement).isDisplayed();
    }

    async isValuePart1ListEditorDisplay(promptElement) {
        return this.getValuePart1ListEditor(promptElement).isDisplayed();
    }

}
