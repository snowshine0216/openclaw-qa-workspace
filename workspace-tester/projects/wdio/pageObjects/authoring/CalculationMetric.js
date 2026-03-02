import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
/**
 * Class representing the Calculation Metric editor
 * @extends BasePage
 * @author Fang Suo <fsuo@microstrategy.com>
 */
export default class CalculationMetric extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    //#region Element Locators
    get CalculationEditor() {
        return this.$(`//div[contains(@class, 'Calculation-MenuEditor')]`);
    }

    getCalculationMetricDropDownContext(objectName, index) {
        return this.$(
            `(//div[contains(@class,'Calculation-PullDown')]//div[contains(@class, 'mstrmojo-PopupList')]//child::*[text()='${objectName}'])[${index}]`
        );
    }

    getCalculationMetricContext(objectName, index) {
        if (objectName === '') {
            return this.$(
                `(//div[contains(@class,'Calculation-PullDown')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')])[${index}]`
            );
        }
        return this.$(
            `(//div[contains(@class,'Calculation-PullDown')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')][text()='${objectName}'])[${index}]`
        );
    }

    getCalculationType(calculationType) {
        let className = 'operator-plus';
        switch (calculationType.toLowerCase()) {
            case 'subtract':
            case 'minus':
                className = 'operator-minus';
                break;
            case 'multiply':
            case 'multiply by':
                className = 'operator-multiply';
                break;
            case 'divide':
            case 'divide by':
                className = 'operator-divide';
                break;
            case 'percent':
            case 'percentage':
            case 'percent of':
            case 'percentage of':
                className = 'operator-percent-diff';
                break;
            case 'add':
            case 'plus':
            default:
                className = 'operator-plus';
        }
        return this.CalculationEditor.$(`//*[contains(@class,'${className}')]`);
    }

    get okButton() {
        return this.$(
            `//div[contains(@class,'mstrmojo-Button') and not(contains(@class,'disabled'))]//div[contains(@class, 'mstrmojo-Button-text') and text()='OK']`
        );
    }
    //#endregion

    //#region Action Helpers
    async createCalculation(secondObject, calculationType) {
        const cntxt = await this.common.getContextMenuItem('Calculation');
        await this.waitForElementVisible(cntxt);
        await this.click({ elem: cntxt });

        // Use loop and try catch handling to avoid the sub context menu element not attached to page error
        let breakIt = false;
        for (let i = 0; !breakIt && i < 5; i++) {
            try {
                const secCntxt = await this.getCalculationMetricContext('', 2);
                await this.click({ elem: secCntxt });
                breakIt = true;
            } catch (err) {
                // When the error message contains "StaleElementReferenceError", continue the loop
                console.log('Error type: ', typeof err);
                switch (typeof err) {
                    case 'object':
                        console.log('Check error content: ', JSON.stringify(err));
                        breakIt = JSON.stringify(err).indexOf('StaleElementReferenceError') === -1;
                        break;
                    case 'string':
                        console.log('Check error content: ', err);
                        breakIt = err.indexOf('StaleElementReferenceError') === -1;
                        break;
                    default:
                        breakIt = true;
                }
            }
        }

        // Use loop and try catch handling to avoid the dropdown element in sub menu not attached to page error
        breakIt = false;
        for (let i = 0; !breakIt && i < 5; i++) {
            try {
                const objDropDownCntxt2 = await this.getCalculationMetricDropDownContext(secondObject, 2);
                await this.waitForElementVisible(objDropDownCntxt2);
                await this.click({ elem: objDropDownCntxt2 });
                breakIt = true;
            } catch (err) {
                console.log('Error type: ', typeof err);
                switch (typeof err) {
                    case 'object':
                        console.log('Check error content: ', JSON.stringify(err));
                        breakIt = JSON.stringify(err).indexOf('StaleElementReferenceError') === -1;
                        break;
                    case 'string':
                        console.log('Check error content: ', err);
                        breakIt = err.indexOf('StaleElementReferenceError') === -1;
                        break;
                    default:
                        breakIt = true;
                }
            }
        }

        const calcAction = await this.getCalculationType(calculationType);
        await this.click({ elem: calcAction });
        const okBtn = await this.okButton;
        await this.waitForElementClickable(okBtn);
        await this.click({ elem: okBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    //#endregion
}
