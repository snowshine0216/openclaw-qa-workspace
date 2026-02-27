import BasePage from '../base/BasePage.js';
// import PanelStack from './PanelStack.js';

// export default class RsdInfoWindow extends PanelStack {
export default class RsdInfoWindow extends BasePage {
    /**
     * Create infoWindow by searching for the id text contained
     * @example the id might like *lK36*kK33*x1*t1580241567454_ifw, you can use idContains='lK36*kK33' to locate the infoWindow
     * @param {String} idContains text and id contains which can
     * @returns {Promise<any>} The wait Promise
     */
    static createByIdContains(idContains) {
        return new RsdInfoWindow(`.mstrmojo-DocInfoWindow[id*="${idContains}"]`);
    }

    /**
     * Create info window by id
     * @param {String} id info window id
     * @returns {Promise<any>} The wait Promise
     */
    static createById(id) {
        const rsdInfoWindow = new RsdInfoWindow(`.mstrmojo-DocInfoWindow[id="${id}"]`);
        rsdInfoWindow._id = id;
        return rsdInfoWindow;
    }

    /**
     * Locate infowindow by panel stack name (in DOM, the children element's 'nm' attribute)
     * @param {String} name 'nm'
     * @returns {RsdInfoWindow} RsdInfoWindow object if presents in DOM, otherwise null
     */
    static async createByPanelStackName(name) {
        const infoWindow = await this.$$('.mstrmojo-DocInfoWindow').filter((elem) =>
            elem.$(`.mstrmojo-portlet[nm="${name}"]`).isDisplayed()
        )[0];
        const isPresent = await infoWindow.isDisplayed();
        if (isPresent) {
            const infoWindowId = await infoWindow.getAttribute('id');
            const rsdInfoWindow = this.createById(infoWindowId);
            rsdInfoWindow._panelStackName = name;
            return rsdInfoWindow;
        }
        return null;
    }

    /**
     * If there is only one infoWindow, we can create it using default locator
     * @param {String|Locator} locator element locator
     */
    constructor(locator = '.mstrmojo-DocInfoWindow') {
        super(locator, 'Rsd InfoWindow component');
    }

    getCloseBtn() {
        return this.$('.mstrmojo-DocInfoWindow').$('.mstrmojo-DocInfoWindow-close');
    }

    async closeInfoWindow(offset) {
        if (offset) {
            await this.click({ elem: this.getCloseBtn(), offset });
            return;
        }
        if (await this.isCloseBtnDisplayed()) {
            await this.click({ elem: this.getCloseBtn() });
        } else {
            await this.click({ elem: this.getCloseBtn(), offset: { x: -1, y: 0 } });
        }
    }

    async getInfoWindowLocation() {
        return this.getElement().getLocation();
    }

    async waitInfoWindowShown() {
        return this.waitForElementVisible(this.getElement());
    }

    async isDisplayed() {
        if (this._id) {
            return this.$(`.mstrmojo-DocInfoWindow[id="${this._id}"]`).isDisplayed();
        }
        return this.getElement().isDisplayed();
    }

    async isCloseBtnDisplayed() {
        return (await this.getCloseBtn().isDisplayed()) && (await this.getCloseBtn().isDisplayed());
    }
}
