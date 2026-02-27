import BasePage from '../base/BasePage.js';

export default class HTMLPage extends BasePage {
    // Element locator

    getHTMLNode(index) {
        let nodes = this.$$('.mstrmojo-HtmlBox');
        return nodes[index];
    }

    // Assertion

    textContent(index) {
        return this.getHTMLNode(index).$('.mstrmojo-UnitContainer-content').$('iframe').getAttribute('src');
    }

    async textBGC(index) {
        let text = await this.getHTMLNode(index).getCSSProperty('color');
        return text.value;
    }

    textText(index) {
        let text = this.getHTMLNode(index);
        return text.getText();
    }
}
