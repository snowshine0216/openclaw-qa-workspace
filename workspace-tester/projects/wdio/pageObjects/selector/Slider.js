import BaseComponent from '../base/BaseComponent.js';
import BasePage from '../base/BasePage.js';
import DossierPage from '../dossier/DossierPage.js';
import InsertData from '../transactionSQL/InsertData.js';

export default class Slider extends BaseComponent {
    constructor(container, locator = '.mstrmojo-Slider', des = 'Slider Selector') {
        super(container, locator, des);
        this.dossierPage = new DossierPage();
    }

    getContent() {
        return this.getParent(this.getElement());
    }

    // element locator
    getStartButton() {
        return this.getElement().$$('.t1')[0];
    }

    getMiddleButton() {
        return this.getElement().$$('.t2')[0];
    }

    getEndButton() {
        return this.getElement().$$('.t3')[0];
    }

    // Click the slider button, there will a input box popup
    getInputPopup() {
        return this.$('.mstrmojo-Popup.edvl');
    }

    getInputBox() {
        return this.getInputPopup().$('.mstrmojo-TextBox');
    }

    getInputConfirm() {
        return this.getInputPopup().$('.mstrmojo-Button.icn.apply');
    }

    getTooltip() {
        return this.$('.mstrmojo-Tooltip');
    }

    getSliderButton(sliderByClass = 't2') {
        return this.getElement().$(`.${sliderByClass}`);
    }

    getSliderBar() {
        return this.getElement().$$('.bk')[0];
    }

    async getSliderWidth() {
        const sliderBar = await this.getSliderBar();
        const parent = await sliderBar.$('./ancestor::div[2]');
        const width = await parent.getCSSProperty('width');
        return width.value;
    }

    // action helper
    async dragSlider(toOffset, sliderByClass = 'middle', wait = true) {
        let sliderMark;
        switch (sliderByClass) {
            case 'top':
                sliderMark = this.getStartButton();
                break;
            case 'middle':
                sliderMark = this.getMiddleButton();
                break;
            case 'bottom':
                sliderMark = this.getEndButton();
                break;
            default:
                throw new Error(`Please make sure you have correct input when drag slider`);
        }

        await this.dragAndDrop({
            fromElem: sliderMark,
            toElem: this.getSliderBar(),
            toOffset: toOffset,
        });
        if (wait) {
            await this.dossierPage.waitForPageLoading();
            return this.waitDocumentToBeLoaded();
        }
    }

    getInsertSliderForInsertData() {
        return $('.txn-insert-slider-dropdown:not(.ant-select-dropdown-hidden)');
    }

    async dragSliderForInsertData(toOffset) {
        await this.dragAndDrop({
            fromElem: (await this.getInsertSliderForInsertData()).$('.ant-slider-handle'),
            toElem: (await this.getInsertSliderForInsertData()).$('.ant-slider-rail'),
            toOffset: toOffset,
        });
    }

    /**
     * Click slider button, input and confirm the value
     * @param {Locator} buttonLocator the button locator
     * @param {String} text the text to input
     */
    async inputValue(buttonLocator, text) {
        await this.click({ elem: buttonLocator });
        await this.waitForElementVisible(this.getInputBox());
        await this.clear({ elem: this.getInputBox() });
        await this.getInputBox().setValue(text);
        await this.click({ elem: this.getInputConfirm() });
        return this.waitDocumentToBeLoaded();
    }

    /**
     * Click slider start point button, input and confirm the value
     * @param {String} text the text to input
     */
    async inputToStartPoint(text) {
        return this.inputValue(this.getStartButton(), text);
    }

    /**
     * Click slider middle point button(single), input and confirm the value
     * @param {String} text the text to input
     */
    async inputToPoint(text) {
        return this.inputValue(this.getMiddleButton(), text);
    }

    /**
     * Click slider end point button, input and confirm the value
     * @param {String} text the text to input
     */
    async inputToEndPoint(text) {
        return this.inputValue(this.getEndButton(), text);
    }

    async clickSliderBar(offset) {
        await this.click({ elem: this.getSliderBar(), offset, checkClickable: false });
        return this.waitDocumentToBeLoaded();
    }

    /**
     * Hover to appointed button and get the tooltip text
     * @param {Locator} buttonLocator the button locator we want to get the tooltip
     */
    async getTooltipText(buttonLocator) {
        let tlPresent = false;
        for (let i = 0; i < 3 && !tlPresent; i++) {
            console.log(`Try to hover to ${i} times`);
            await this.hover({ elem: buttonLocator });
            await this.sleep(500);
            tlPresent = await this.getTooltip().isDisplayed();
            console.log('tlPresent',tlPresent)
        }
        await this.waitForElementVisible(this.getTooltip());
        return this.getTooltip().getText();
    }

    async getStartTooltipText() {
        return this.getTooltipText(this.getStartButton());
    }

    async getEndTooltipText() {
        return this.getTooltipText(this.getEndButton());
    }

    async getSingleTooltipText() {
        return this.getTooltipText(this.getMiddleButton());
    }
}
