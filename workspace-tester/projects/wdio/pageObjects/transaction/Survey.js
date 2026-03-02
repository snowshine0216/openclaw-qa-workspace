import TransactionPage from './TransactionPage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class Survey extends TransactionPage {
    // element locator
    getSurveyContainer() {
        return this.$('.mstrmojo-SurveyVis');
    }

    getQuestion(name) {
        return this.getSurveyContainer().$$('.mstrmojo-SurveyVis-Question').filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getTextFieldDICByQuestionName(name) {
        return this.getQuestion(name).$('.mstrmojo-SurveyVis-Answers .mstrmojo-TextFieldDIC');
    }

    getTextAreaDICByQuestionName(name) {
        return this.getQuestion(name).$('.mstrmojo-SurveyVis-Answers .mstrmojo-TextArea');
    }

    getListDICByQuestionName(name) {
        return this.getQuestion(name).$('.mstrmojo-SurveyVis-Answers .mstrmojo-ListDIC ');
    }

    getListDICItem(name, title) {
        return this.getListDICByQuestionName(name).$(`.item[title="${title}"]`);
    }

    getDropdownList() {
        return this.$('.mstrmojo-Pulldown-Popup');
    }

    getDropdownListItem(item) {
        return this.getDropdownList().$(`.mstrmojo-text[title="${item}"]`);
    }

    getBackButton() {
        return this.getSurveyContainer().$('.prev .btn');
    }

    getNextButton() {
        return this.getSurveyContainer().$('.next .btn');
    }

    // action helper
    async inputTextField(name, text) {
        const el = this.getTextFieldDICByQuestionName(name);
        await scrollIntoView(el);
        await this.clear({elem:  el });
        await el.setValue(text);
        await this.enter();
        await this.waitForCurtainDisappear();
    }

    async inputTextArea(name, text) {
        const el = this.getTextAreaDICByQuestionName(name);
        await scrollIntoView(el);
        await this.clear({ elem: el });
        await el.setValue(text);
        await this.enter();
        await this.waitForCurtainDisappear();
    }

    async chooseList(name, item) {
        await this.waitForElementVisible(this.getQuestion(name));
        const el = this.getListDICByQuestionName(name);
        await this.waitForElementVisible(el);
        await scrollIntoView(el);
        await this.waitForElementVisible(this.getListDICItem(name, item));
        await this.click({ elem: this.getListDICItem(name, item) });
    }

    async chooseDropDownList(name, item) {
        const el = this.getListDICByQuestionName(name).$$('.mstrmojo-Pulldown-iconNode')[0];
        await this.click({ elem: el });
        await this.waitForElementVisible(this.getDropdownList());
        await this.click({ elem: this.getDropdownListItem(item) });
        await this.waitForElementInvisible(this.getDropdownList());
    }

    async goNext() {
        await this.click({ elem: this.getNextButton() });
        await this.scrollPageToTop();
    }

    // assertion helper
    async waitWidgetLoaded() {
        await this.waitForElementVisible(this.getSurveyContainer());
    }
}
