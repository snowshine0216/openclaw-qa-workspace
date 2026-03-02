import CalendarDIC from './CalendarDIC.js';
import ListDIC from './ListDIC.js';
import Slider from './Slider.js';
import Stepper from './Stepper.js';
import LikertScale from './LikertScale.js';
import RadioList from './RadioList.js';
import StarRating from './StarRating.js';
import Switch from './Switch.js';
import TimePicker from './TimePicker.js';
import Toggle from './Toggle.js';
import DossierPage from '../dossier/DossierPage.js';
import GroupBy from '../document/GroupBy.js';
import RsdGrid from '../document/RsdGrid.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class TransactionPage extends DossierPage {
    constructor() {
        super();
        Object.assign(this, {
            calendar: new CalendarDIC(),
            list: new ListDIC(),
            slider: new Slider(),
            stepper: new Stepper(),
            likertScale: new LikertScale(),
            radioList: new RadioList(),
            starRating: new StarRating(),
            switch: new Switch(),
            timePicker: new TimePicker(),
            toggle: new Toggle(),
            grid: new RsdGrid(),
            groupBy: new GroupBy(),
        });
    }

    setListContainer(el) {
        if (el) {
            this.list.setContainer(el);
        } else {
            this.list.setContainer($('.dataInputControl'));
        }
    }

    setSliderContainer(el) {
        this.slider.setContainer(el);
    }

    setStepperContainer(el) {
        this.stepper.setContainer(el);
    }

    setStarRatingContainer(el) {
        this.starRating.setContainer(el);
    }

    setLikertScaleContainer(el) {
        this.likertScale.setContainer(el);
    }

    setToggleContainer(el) {
        this.toggle.setContainer(el);
    }

    setSwitchContainer(el) {
        this.switch.setContainer(el);
    }

    // element locator
    getActionSelectorButton(name) {
        return this.$$(`input[value="${name}"]:not([disabled]`).filter((el) => el.isDisplayed())[0];
    }

    getContainerByKey(key) {
        return this.$(`div[k="${key}"]`);
    }

    getTextFieldDIC() {
        return this.$('.dataInputControl .mstrmojo-TextBox.mstrmojo-TextFieldDIC');
    }

    getTextAreaDIC() {
        return this.$$('.mstrmojo-ElasticTextArea')
            .filter((item) => item.isDisplayed())[0]
            .$('.mstrmojo-TextArea.eta-text');
    }

    getTextAreaDICByName(name) {
        return this.getEditableFieldByName(name).$('.mstrmojo-TextArea');
    }

    getEditableField() {
        return this.$$('.mstrmojo-DocTextfield.editable-field')[0];
    }

    getEditableFieldByName(name) {
        return this.$$(`.mstrmojo-DocTextfield.editable-field[title="${name}"]`)[0];
    }

    getEditableFiledByValue(value) {
        return this.$$('.mstrmojo-DocTextfield.editable-field').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.trim() === value;
        })[0];
    }

    getWaitMask() {
        return this.$('.mstrmojo-Box.fullscreen-mask');
    }

    // submit TXN service
    async submitChanges() {
        await this.click({ elem: this.getActionSelectorButton('Submit') });
        await this.waitDataLoaded();
        /* document will be refreshed after submit, but blank page will be shown for a while without any indicator
        before document is fully loaded. To avoid this problem,  add sleep logic here ß
        */
        await this.sleep(5000);
    }

    async sumbitChangesWithNoWait() {
        const el = this.getActionSelectorButton('Submit');
        await this.waitForElementClickable(el);
        await el.click();
    }

    async submitChangesWithPageFreshed() {
        await this.sumbitChangesWithNoWait();
        await this.waitPageRefresh();
    }

    // recalculate TXN service
    async recalculateChanges() {
        await this.click({ elem: this.getActionSelectorButton('Recalculate') });
        await this.sleep(2000);
    }

    // discard TXN service
    async discardChanges() {
        await this.click({ elem: this.getActionSelectorButton('Discard Changes') });
        await this.waitForMaskDisappear();
        await this.sleep(2000);
    }

    // input value for text filed
    async inputTextFieldByKey(key, text) {
        // const { key, text } = option;
        await this.clickOnContainerByKey(key);
        const el = this.getTextFieldDIC();
        await this.clear({ elem: el });
        await el.setValue(text);
        if (this.isSafari()) {
            await this.enter();
        } else {
            await this.enter();
        }
        await this.waitDataLoaded();
    }

    // input value for text filed
    async inputTextField(text) {
        const el = this.getTextFieldDIC();
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.enter();
        // click blank area here since enter didn't take effect on some cases
        try {
            await this.$('.mstrmojo-DocLayoutViewer-layout').click();
        } catch (e) {
            // do nothing
        }
        await this.waitDataLoaded();
    }

    // input value for text area
    async inputTextArea(text) {
        const el = this.getTextAreaDIC();
        await this.waitForElementClickable(el);
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.clickWithOffset({ elem: el, offset: { x: 300, y: 0 } }, false);
        await this.waitDataLoaded();
        await this.sleep(500);
    }

    // input value for text area
    async inputTextAreaByName(name, text) {
        const el = this.getTextAreaDICByName(name);
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.clickWithOffset({ elem: el, offset: { x: 800, y: 0 } });
        await this.waitDataLoaded();
    }

    // input value for editable text in field
    async inputTextFieldByName(name, text, flag = true) {
        if (flag) {
            await this.click({ elem: this.getEditableFieldByName(name) });
        }
        const el = this.getTextFieldDIC();
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.enter();
        await this.waitForCurtainDisappear();
    }

    // input value for editable text in field
    async inputTextFieldByValue(value, text) {
        await this.click({ elem: this.getEditableFiledByValue(value) });
        const el = this.getTextFieldDIC();
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.enter();
        await this.waitForCurtainDisappear();
        await this.sleep(500);
    }

    // click on container by Key
    async clickOnContainerByKey(key) {
        const el = this.getContainerByKey(key);
        await this.click({ elem: el });
    }

    async fieldValueBy(key) {
        const value = await this.$(`[k="${key}"]`).getText();
        return value;
    }

    async waitForPageReload() {
        // add sleep here to wait for loading icon show if it shows
        await this.sleep(1000);
        return this.waitForCurtainDisappear();
    }

    async waitForMaskDisappear() {
        try {
            await this.waitForElementVisible(this.getWaitMask());
            await this.waitForElementInvisible(this.getWaitMask());
        } catch (err) {
            console.log('mask is not appeared' + err);
        }
    }

    async clickOnDocLayout() {
        await this.click({ elem: this.getDocView() });
        // wait for loading icon disappear
        await this.grid.waitForLoaddingDisappear();
    }

    async hasDirtyFlag(el) {
        await this.waitForElementVisible(el);
        const el2 = el.$$('.flag-container .dirty-cell')[0];
        try {
            await this.waitForElementVisible(el2);
            return true;
        } catch {
            return false;
        }
    }

    async isDirtyFlagDisappear(el) {
        await this.waitForElementVisible(el);
        const el2 = el.$$('.flag-container .dirty-cell')[0];
        try {
            await this.waitForElementInvisible(el2);
            return true;
        } catch {
            return false;
        }
    }

    async isPageRefreshed() {
        const el = this.$('.mstrd-LoadingIcon-content--visible');
        try {
            await this.waitForElementVisible(el);
            await this.waitForElementStaleness(el);
            return true;
        } catch (e) {
            console.log('page refresh error:', e);
            return false;
        }
    }

    async getTextFieldValue(name) {
        await this.waitForElementVisible(this.getEditableFieldByName(name));
        return this.getEditableFieldByName(name).getText();
    }

    async getTextAreaValue() {
        return getInputValue(this.getTextAreaDIC());
    }

    async getTextAreaValueByName(name) {
        return getInputValue(this.getTextAreaDICByName(name));
    }

    async isActionButtonDisplayed(name) {
        return this.getActionSelectorButton(name).isDisplayed();
    }
}
