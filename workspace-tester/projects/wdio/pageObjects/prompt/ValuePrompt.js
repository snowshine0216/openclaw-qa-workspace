import BasePrompt from '../base/BasePrompt.js';
import TextboxStyle from './TextboxStyle.js';
import CalendarStyle from './CalendarStyle.js';

export default class ValuePrompt extends BasePrompt {
    constructor() {
        super();
        this.textbox = new TextboxStyle();
        this.calendar = new CalendarStyle();
    }
}
