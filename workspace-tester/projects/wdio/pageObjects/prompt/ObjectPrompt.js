import BasePrompt from '../base/BasePrompt.js';
import CheckboxStyle from './CheckboxStyle.js';

export default class ObjectPrompt extends BasePrompt {
    constructor() {
        super();
        this.checkbox = new CheckboxStyle();
    }
}
