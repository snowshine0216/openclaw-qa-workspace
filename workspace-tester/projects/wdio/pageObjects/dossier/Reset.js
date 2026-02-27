import BasePage from '../base/BasePage.js';
import DossierPage from './DossierPage.js';

export default class Reset extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
    }

    // Element locator

    getResetButton() {
        return this.$('.mstrd-NavItemWrapper.mstrd-ResetNavItem.mstr-navbar-item');
    }

    getConfirmDialog() {
        return this.$('.mstrd-SliderConfirmDialog-content');
    }

    getconfirmResetButton() {
        return this.getConfirmDialog().$('.mstrd-Button--round');
    }

    getcancelResetButton() {
        return this.getConfirmDialog().$('.mstrd-Button--clear');
    }

    getPageLoadingIcon() {
        return this.$('.mstrd-LoadingIcon-content--visible');
    }

    // Action method

    async selectReset() {
        await this.click({ elem: this.getResetButton() });
        await this.waitForElementVisible(this.getconfirmResetButton(), { msg: 'Reset dialog was not open.' });
        return this.sleep(300);
    }

    async confirmReset(isPrompted) {
        await this.waitForElementVisible(this.getconfirmResetButton(), { msg: 'Reset dialog was not open.' });
        await this.getconfirmResetButton().click();
        if (isPrompted) {
            await this.promptEditor.waitForEditor();
        } else {
            await this.dossierPage.waitForDossierLoading();
        }
        return this.sleep(1000);
    }

    async confirmResetNoWait() {
        // await this.wait(this.EC.presenceOf(this.getconfirmResetButton()), 5000, 'Reset dialog was not open.');
        // await this.getconfirmResetButton().click();
        await this.click({ elem: this.getconfirmResetButton() });
        return this.sleep(1000);
    }

    async cancelReset() {
        await this.waitForElementVisible(this.getcancelResetButton(), {
            timeout: 5000,
            msg: 'Reset dialog was not open.',
        });
        await this.getcancelResetButton().click();
        await this.waitForElementStaleness(this.getcancelResetButton(), {
            timeout: 5000,
            msg: 'Reset dialog was not closed.',
        });
    }

    async resetIfEnabled() {
        const isResetButtonDisabled = await this.isResetDisabled();
        if (!isResetButtonDisabled) {
            await this.selectReset();
            await this.confirmReset();
        }
    }

    // Assertion helper

    async isResetPresent() {
        await this.waitForCurtainDisappear();
        await this.dossierPage.waitForDossierLoading();
        return this.getResetButton().isDisplayed();
    }

    async isResetDisabled() {
        await this.waitForCurtainDisappear();
        const isDialogPresent = await this.getResetButton().$('.mstrd-SliderConfirmDialog[disabled]');
        const isDisabled = await isDialogPresent.isDisplayed();
        return isDisabled;
    }

    async hoverOnResetButton() {
        console.log('----- hoverOnResetButton -----');
        await this.waitForCurtainDisappear();
        await this.hover({ elem: this.getResetButton() });
        console.log('------------------------------');
    }
}
