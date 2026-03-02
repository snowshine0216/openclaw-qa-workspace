import BasePage from '../base/BasePage.js';

export default class ShareInTeamsDialog extends BasePage {
    constructor() {
        super();
    }

    get TEAMS_DEFAULT_LOADING_TIMEOUT() {
        if (browsers.params.timeout && browsers.params.timeout.defaultLoadingTimeOut) {
            return browsers.params.timeout.defaultLoadingTimeOut;
        } else {
            return 120 * 1000;
        }
    }

    getPinToTeamsNameAndTime() {
        return this.$('div.mstrd-PinToTeamsTabDialog-nameAndTime');
    }

    getTeamInputInPinToTeamDialog() {
        return this.$('input#rc_select_0');
    }

    getSelectArrayLoadingIcon() {
        return this.$('div.ant-select-arrow-loading');
    }

    getChannelInputInPinToTeamDialog() {
        return this.$('input#rc_select_1');
    }

    getWhiteSpinner() {
        return this.$('div.mstrd-Spinner--white');
    }

    getElement(tag, { attribute = undefined, value = undefined, need_all = false, ele = undefined } = {}) {
        // ingore atrribute and value if they are undefined
        if (attribute === undefined) {
            console.log(`looking for a ${tag}`);
            if (ele) {
                return need_all ? ele.$$(tag) : ele.$(tag);
            } else {
                return need_all ? this.$$(`${tag}`) : this.$(`${tag}`);
            }
        }
        console.log(`looking for a ${tag} with ${attribute} as ${value}`);
        if (attribute === 'text') {
            if (ele) {
                return need_all
                    ? ele.$$(`//${tag}[contains(text(), '${value}')]`)
                    : ele.$(`//${tag}[contains(text(), '${value}')]`);
            } else {
                return need_all
                    ? this.$$(`//${tag}[contains(text(), '${value}')]`)
                    : this.$(`//${tag}[contains(text(), '${value}')]`);
            }
        }
        if (ele) {
            return need_all ? ele.$$(`${tag}[${attribute}="${value}"]`) : ele.$(`${tag}[${attribute}="${value}"]`);
        } else {
            return need_all ? this.$$(`${tag}[${attribute}="${value}"]`) : this.$(`${tag}[${attribute}="${value}"]`);
        }
    }

    async hideNameAndTimeInPinToTeamsDialog() {
        await this.hideElement(this.getPinToTeamsNameAndTime());
    }

    async selectTeamWithKeyWord(keyword = 'Test') {
        // find input selector of team
        const teamInput = await this.getTeamInputInPinToTeamDialog();
        await this.waitForElementVisible(teamInput, { timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT });
        await this.waitForElementStaleness(await this.getSelectArrayLoadingIcon());
        // input keyword
        await teamInput.setValue(keyword);
        const teamEle = await this.getElement('div', { attribute: 'text', value: keyword });
        await teamEle.click();
    }

    async selectChannelWithKeyWord(keyword = 'General') {
        // find input selector of channel
        const channelInput = await this.getChannelInputInPinToTeamDialog();
        await this.waitForElementClickable(channelInput, { timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT });
        await this.waitForElementInvisible(await this.getSelectArrayLoadingIcon());
        // input keyword
        await channelInput.setValue(keyword);
        const channelEle = await this.getElement('div', { attribute: 'text', value: keyword });
        await channelEle.click();
    }
}
