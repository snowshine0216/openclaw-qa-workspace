import BasePage from '../base/BasePage.js';

export default class HtmlContainer extends BasePage {
    // Element locator
    getHTMLNode(index) {
        let nodes = this.$$('.mstrmojo-HtmlBox');
        return nodes[index];
    }

    // Assertion
    textContent(index) {
        return this.getHTMLNode(index).$('.mstrmojo-UnitContainer-content').$('iframe').getAttribute('src');
    }
}
