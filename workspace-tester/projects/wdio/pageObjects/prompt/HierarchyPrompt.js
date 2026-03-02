import BasePrompt from '../base/BasePrompt.js';
import ShoppingCartStyle from './ShoppingCartStyle.js';
import TreeStyle from './TreeStyle.js';

export default class HierarchyPrompt extends BasePrompt {
    constructor() {
        super();
        this.shoppingCart = new ShoppingCartStyle();
        this.tree = new TreeStyle();
    }
}
