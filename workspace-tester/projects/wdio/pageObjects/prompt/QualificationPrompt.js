import BasePrompt from '../base/BasePrompt.js';
import ShoppingCartStyle from './ShoppingCartStyle.js';
import PullDownStyle from './PullDownStyle.js';

export default class QualificationPrompt extends BasePrompt {
    constructor() {
        super();
        this.shoppingCart = new ShoppingCartStyle();
        this.pullDown = new PullDownStyle();
        this.pullDown.shoppingCart = this.shoppingCart;
    }
}
