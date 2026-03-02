import BasePage from '../base/BasePage.js';
import Alert from '../common/Alert.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LoadingDialog from './components/LoadingDialog.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class FormatPanel extends BasePage {
    constructor() {
        super();
        this.alert = new Alert();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
    }

    // Element Locator
    getThemePanel() {
        return this.$('.mstrmojo-themesPanel-content');
    }

    getTheme(theme) {
        return this.getThemePanel()
            .$$('.theme-card')
            .filter(async (elem) => {
                const elemText = await elem.$('.card-details__title').getText();
                return elemText === theme;
            })[0];
    }

    getThemeSearchInput() {
        return this.getThemePanel().$(`//input[contains(@class, 'mstr-rc-input')]`);
    }

    getThemeTooltip() {
        return this.$(`//div[contains(@class, 'undoApplyTheme mstrmojo-Tooltip')]`);
    }

    getCertifiedToggleButton() {
        return this.getThemePanel().$('.certified-only-container button.mstr-rc-switch');
    }

    getInfoIconByName(theme) {
        return this.getTheme(theme).$('.card-details__btns .theme-lib-info-icon');
    }

    getThemeInfoTooltipContainer() {
        return this.$('.mstr-rc-tooltip-popover');
    }

    getCurrentThemeContainer() {
        return this.getThemePanel().$('.theme-gallery__current');
    }

    getCurrentThemeTitle() {
        return this.getCurrentThemeContainer().$('.card-details__title');
    }

    getCurrentThemeCertifiedIcon() {
        return this.getCurrentThemeContainer().$('.card-details__btns .single-icon-common-certify-certified-orange');
    }

    getCurrentThemeInfoIcon() {
        return this.getCurrentThemeContainer().$('.card-details__btns .theme-lib-info-icon');
    }

    getCoverImageByName(theme) {
        return this.getTheme(theme).$('.theme-card__preview');
    }

    async getThemeApplyButton(theme) {
        const themeCard = await this.getTheme(theme);
        if (!themeCard) {
            throw new Error(`Theme "${theme}" not found`);
        }
        return await themeCard.$(`.card-preview__apply`);
    }

    async isThemeTooltipDisplayed() {
        return await this.getThemeTooltip().isDisplayed();
    }

    async getCurrentTheme() {
        const text = await this.getCurrentThemeTitle().getText();
        return text.trim();
    }

    async isCurrentThemeCertified() {
        return await this.getCurrentThemeCertifiedIcon().isDisplayed();
    }

    async isAutoStyle(theme) {
        const isAutoStyle = await this.getTheme(theme).$('.cover-image-default-autostyle').isDisplayed();
        return isAutoStyle;
    }

    async getCurrentThemeCardSize() {
        const result = {};
        await this.waitForElementVisible(this.getCurrentThemeContainer());
        const width = await this.getCurrentThemeContainer().getSize('width');
        const height = await this.getCurrentThemeContainer().getSize('height');
        result.x = width;
        result.y = height;
        return result;
    }

    async getCoverImageUrlByName(theme) {
        const coverImageElem = this.getCoverImageByName(theme);
        const isAutoStyle = await this.isAutoStyle(theme);
        if (isAutoStyle) {
            // get computed background-image url
            const bgImage = await coverImageElem.getCSSProperty('background-image');
            const urlMatch = bgImage.value.match(/url\(["']?(.*?)["']?\)/);
            return urlMatch ? urlMatch[1] : null;
        }
        const imgElem = coverImageElem.$('img');
        const url = await imgElem.getProperty('src');
        return url;
    }

    async getTooltipContent() {
        return this.getThemeInfoTooltipContainer().getText();
    }

    // Action Methods
    async searchTheme(theme) {
        await this.waitForElementVisible(this.getThemePanel());
        const searchInput = await this.getThemeSearchInput();
        await this.waitForElementVisible(searchInput);
        await searchInput.setValue(theme);
        await this.sleep(1000); //wait for search results to load
    }
    async applyTheme(theme) {
        await this.waitForElementVisible(this.getThemePanel());
        console.log(`select theme: ${theme}`);
        const themeElem = await this.getTheme(theme);
        await this.waitForElementVisible(themeElem);
        await this.hover({ elem: themeElem, time: 2000 });
        console.log(`click apply button`);
        const applyButton = await this.getThemeApplyButton(theme);
        await this.waitForElementVisible(applyButton);
        await this.click({ elem: applyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        const isTooltipDisplayed = await this.isThemeTooltipDisplayed();
        if (isTooltipDisplayed) {
            //click dismiss tooltip
            await this.click({ elem: this.getThemeTooltip().$(`//div[@aria-label='Dismiss']`) });
        }
    }

    async toggleCertifiedThemes() {
        await this.click({ elem: this.getCertifiedToggleButton() });
        await this.sleep(1000); //wait for themes to load
    }

    async hoverOnThemeInfoIcon(theme) {
        await this.hover({ elem: this.getInfoIconByName(theme) });
        await this.waitForElementVisible(this.getThemeInfoTooltipContainer());
    }
}
