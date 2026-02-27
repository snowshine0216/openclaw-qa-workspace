import CheckBox from './CheckBox.js';
import Slider from './Slider.js';
import Dropdown from './Dropdown.js';
import ListBox from './ListBox.js';
import ButtonBar from './ButtonBar.js';
import SearchBox from './SearchBox.js';
import MetricSlider from './MetricSlider.js';
import MetricQualification from './MetricQualification.js';
import Calendar from './Calendar.js';
import LinkBar from './LinkBar.js';
import RadioButton from './RadioButton.js';
import BaseComponent from '../base/BaseComponent.js';

export default class SelectorObject extends BaseComponent {
    static create(key) {
        const selector = new SelectorObject(`div[k="${key}"]`, true);
        selector.checkbox.setContainer(selector.getElement());
        selector.dropdown.setContainer(selector.getElement());
        selector.listbox.setContainer(selector.getElement());
        selector.buttonbar.setContainer(selector.getElement());
        selector.radiobutton.setContainer(selector.getElement());
        selector.linkbar.setContainer(selector.getElement());
        selector.slider.setContainer(selector.getElement());
        selector.metricSlider.setContainer(selector.getElement());
        selector.searchbox.setContainer(selector.getElement());
        selector.metricQualification.setContainer(selector.getElement());
        selector.calendar.setContainer(selector.getElement());
        return selector;
    }

    static createByName(name) {
        const selector = new SelectorObject(`div[nm="${name}"]`);
        selector.checkbox.setContainer(selector.getElement());
        selector.dropdown.setContainer(selector.getElement());
        selector.listbox.setContainer(selector.getElement());
        selector.buttonbar.setContainer(selector.getElement());
        selector.radiobutton.setContainer(selector.getElement());
        selector.linkbar.setContainer(selector.getElement());
        selector.slider.setContainer(selector.getElement());
        selector.metricSlider.setContainer(selector.getElement());
        selector.searchbox.setContainer(selector.getElement());
        selector.metricQualification.setContainer(selector.getElement());
        selector.calendar.setContainer(selector.getElement());
        return selector;
    }

    constructor(cssSelector = '.mstrmojo-DocSelector') {
        super(null, cssSelector, 'Rsd Selector component');

        this.checkbox = new CheckBox();
        this.dropdown = new Dropdown();
        this.listbox = new ListBox();
        this.buttonbar = new ButtonBar();
        this.radiobutton = new RadioButton();
        this.linkbar = new LinkBar();
        this.searchbox = new SearchBox();
        this.slider = new Slider();
        this.metricSlider = new MetricSlider();
        this.metricQualification = new MetricQualification();
        this.calendar = new Calendar();
    }

    getButtonbarByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new ButtonBar(container);
        super.initial();
        return el;
    }

    getSliderByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new Slider(container);
        super.initial();
        return el;
    }

    getSearchboxByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new SearchBox(container);
        super.initial();
        return el;
    }

    getDropDownById(id) {
        const container = this.$(`.mstrmojo-DocSelector[k="${id}"]`);
        const el = new Dropdown(container);
        super.initial();
        return el;
    }

    getCalendarByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new Calendar(container);
        super.initial();
        return el;
    }

    getMetricQualificationByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new MetricQualification(container);
        super.initial();
        return el;
    }

    getMetricSliderByName(name) {
        const container = this.$(`div[nm="${name}"]`);
        const el = new MetricSlider(container);
        super.initial();
        return el;
    }
}
