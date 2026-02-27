import BaseAuthoringFilter from './BaseAuthoringFilter.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class MetricFilter extends BaseAuthoringFilter {
    getMQDropdown(filterName) {
        return this.getFilterByName(filterName).$('.mstrmojo-ui-Pulldown-text');
    }

    getMQContainer() {
        return this.$$('.mstrmojo-PopupList.ctrl-popup-list').filter((elem) => elem.isDisplayed())[0];
    }

    getMQOption(filterName, optionName) {
        return this.getMQContainer(filterName)
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(optionName);
            })[0];
    }

    getMetricQualificationInputBox(filterName, index = 0) {
        return this.getFilterByName(filterName).$$('.mstrmojo-TextBox')[index];
    }

    getMetricSilderLowerHandle(filterName) {
        return this.getFilterByName(filterName).$('.t1');
    }

    getMetricSilderUpperHandle(filterName) {
        return this.getFilterByName(filterName).$('.t3');
    }

    getDisplayInputBox() {
        return this.$$('.mstrmojo-Popup.edvl.mstrmojo-Tooltip.mstrmojo-VISlider').filter(async (elem) => {
            const style = await elem.getAttribute('style');
            return style.includes('display: block');
        })[0];
    }

    getMetricSliderInputBox() {
        return this.getDisplayInputBox().$('.mstrmojo-TextBox');
    }

    async changeMQSelection({ filterName, optionName, value1 = null, value2 = null }) {
        // change operator
        await this.click({ elem: this.getMQDropdown(filterName) });
        await this.click({ elem: this.getMQOption(filterName, optionName) });
        // change value
        if (value1 !== null) {
            const inputBox = await this.getMetricQualificationInputBox(filterName);
            await this.clear({ elem: inputBox });
            await inputBox.setValue(value1);
            await this.enter();
        }
        if (value2 !== null) {
            const inputBox = await this.getMetricQualificationInputBox(filterName, 1);
            await this.clear({ elem: inputBox });
            await inputBox.setValue(value2);
            await this.enter();
        }
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getAuthoringWaitLoading());
    }

    async changeMetricSliderSelection({ filterName, optionName = null, lowerpos = null, upperpos = null }) {
        await scrollIntoView(this.getFilterByName(filterName));
        if (optionName !== null) {
            await this.click({ elem: this.getMQDropdown(filterName) });
            await this.waitForElementVisible(this.getMQContainer());
            await this.click({ elem: this.getMQOption(filterName, optionName) });
        }
        if (lowerpos !== null) {
            await this.dragAndDrop({
                fromElem: this.getMetricSilderLowerHandle(filterName),
                toElem: this.getMetricSilderLowerHandle(filterName),
                toOffset: { x: lowerpos, y: 0 },
            });
             await this.waitForCurtainDisappear();
            await this.waitForElementInvisible(this.getAuthoringWaitLoading());
        }
        if (upperpos !== null) {
            await this.dragAndDrop({
                fromElem: this.getMetricSilderUpperHandle(filterName),
                toElem: this.getMetricSilderUpperHandle(filterName),
                toOffset: { x: upperpos, y: 0 },
            });
            await this.waitForCurtainDisappear();
            await this.waitForElementInvisible(this.getAuthoringWaitLoading());
        }
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getAuthoringWaitLoading());
    }

    async clickHandle({ filterName, handle }) {
        if (handle === 'lower') {
            await this.click({ elem: this.getMetricSilderLowerHandle(filterName) });
        } else {
            await this.click({ elem: this.getMetricSilderUpperHandle(filterName) });
        }
    }

    async changeMetricSliderByInputBox({ filterName, handle, value }) {
        await scrollIntoView(this.getFilterByName(filterName));
        let inputBoxDisplayed = await this.getMetricSliderInputBox().isDisplayed();
        for (let i = 0; i < 3; i++) {
            if (!inputBoxDisplayed) {
                console.log('click handle for ' + i + ' times');
                await this.clickHandle({ filterName, handle });
                inputBoxDisplayed = await this.getMetricSliderInputBox().isDisplayed();
            }
        }
        await this.waitForElementInvisible(this.getAuthoringWaitLoading());
        const inputBox = await this.getMetricSliderInputBox();
        await this.clear({ elem: inputBox });
        await inputBox.setValue(value);
        await this.enter();
    }
}
