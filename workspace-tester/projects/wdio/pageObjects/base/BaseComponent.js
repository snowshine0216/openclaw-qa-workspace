import BasePage from '../base/BasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class BaseComponent extends BasePage {
    /** The locator used to locate the element */
    constructor(container, locator, desc) {
        super();
        this.container = container;
        this._locator = locator;
        this._rawLocator = null;
        this._element = null;
        /** @type {string} */
        this.desc = desc;
    }

    initial() {
        const _container = this.container;
        this.container = typeof _container === 'string' ? this.$(_container) : _container || this.$('body');
        if (!this._locator) return;

        /** @type {Locator} The raw locator passed in constructor */
        if (typeof this._locator === 'string') {
            // Treat as CSS locator e.g., new Component('#menu');
            this._rawLocator = this._locator;
        } else {
            this._element = this._locator;
            //throw new Error('Invalid argument for locator, expected value of string, Locator and ElementFinder');
        }
    }

    /** @type {ElementFinder} The element locator */
    get locator() {
        this.initial();
        if (this._element) {
            return this._element;
        }

        return this.container.$$(this._rawLocator).filter((item) => item.isDisplayed())[0];
    }

    /**
     * Return the element locator of the component.
     * @returns {ElementFinder} The element locator
     */
    getElement() {
        this.initial();
        return this.locator;
    }

    setContainer(container) {
        this.initial();
        if (typeof container === 'string') {
            this.container = $(container);
        } else {
            this.container = container;
        }
    }

    async scrollIntoView(option) {
        await scrollIntoView(this.locator, option);
    }
}
