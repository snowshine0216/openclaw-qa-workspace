import BasePrompt from '../base/BasePrompt.js';
import ShoppingCartStyle from './ShoppingCartStyle.js';
import CheckboxStyle from './CheckboxStyle.js';
import RadioButtonStyle from './RadioButtonStyle.js';

export default class AEPrompt extends BasePrompt {
    constructor() {
        super();
        this.shoppingCart = new ShoppingCartStyle();
        this.checkBox = new CheckboxStyle();
        this.radioButton = new RadioButtonStyle();
    }
}
