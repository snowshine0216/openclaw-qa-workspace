import BasePage from '../base/BasePage.js';

export default class OnBoarding extends BasePage {
    // Element locator
    getCarousel() {
        return this.$('.slick-slide.slick-active.slick-current');
    }

    getIntroductionToLibrary() {
        return this.getCarousel().$('.mstrd-OnboardingCarousel-Item--1');
    }

    getIntroductionToLibraryTitle() {
        return this.getCarousel().$('.mstrd-OnboardingCarousel-Caption');
    }

    getIntroductionToLibraryFooter() {
        return this.getIntroductionToLibrary().$('.mstrd-OnboardingCarousel-Footer');
    }

    getIntroductionToLibrary2() {
        return this.getCarousel().$('.mstrd-OnboardingCarousel-Item--2');
    }

    getIntroductionToLibrary3() {
        return this.getCarousel().$('.mstrd-OnboardingCarousel-Item--3');
    }

    getMoveToRightItem() {
        return this.$('.slick-arrow.slick-next');
    }

    getMoveToLeftItem() {
        return this.$('.slick-arrow.slick-prev');
    }

    getIntroductionToLibraryDock() {
        return this.$$('.mstrd-OnboardingCarousel-Dots li');
    }

    getIntroToLibrarySkip() {
        return this.getIntroductionToLibraryFooter().$('.mstrd-OnboardingCarousel-Skip');
    }

    getIntroToLibraryGotIt() {
        return this.$('.mstrd-OnboardingCarousel-Button--got');
    }

    getContinueTour() {
        return this.$('.mstrd-OnboardingCarousel-Button--continue');
    }

    getDossierViewOnboardingTitle(area) {
        return this.getDossierOnboardingArea(area).$('.mstrd-DossierViewOnboarding-title');
    }

    getSkipButton() {
        return this.$$(
            '.mstrd-DossierViewOnboarding-skipBtn, .mstrd-DossierViewOnboarding-okBtn, .mstrd-LibraryOnboarding-skipBtn, .mstrd-OnboardingCarousel-Button--got, .mstrd-OnboardingCarousel-Skip, .mstrd-LibraryOnboarding-btnGot'
        ).filter((item) => item.isDisplayed())[0];
    }

    /**
     * Get onboarding tutorial area in Library home page
     * @param area Area can be one of following area: Sidebar/ Explore Your Library/ Right Corner
     * @returns {string}
     */
    getLibraryOnboardingArea(area) {
        let onboardingArea = '';
        switch (area) {
            case 'Sidebar':
                onboardingArea = this.$('.mstrd-LibraryOnboarding-group');
                break;
            case 'Explore Your Library':
                onboardingArea = this.$('.mstrd-LibraryOnboarding-dossierItem');
                break;
            case 'Right Corner':
                onboardingArea = this.$('.mstrd-LibraryOnboarding-tutorialLibrary');
                break;
            default:
                break;
        }
        return onboardingArea;
    }

    /**
     * Get onboarding tutorial button in Library home page
     * @param area Area can be one of following areas: Sidebar/ Explore Your Library/ Right Corner
     * @param option Option can be one of following options: Next/ Skip/ Got It
     * @returns {string}
     */
    getLibraryOnboardingButton(area, option) {
        const onboardingArea = this.getLibraryOnboardingArea(area);
        let button = '';
        switch (option) {
            case 'Next':
                button = onboardingArea.$('.mstrd-LibraryOnboarding-nextBtn');
                break;
            case 'Skip':
                button = onboardingArea.$('.mstrd-LibraryOnboarding-skipBtn');
                break;
            case 'Got It':
                button = onboardingArea.$('.mstrd-LibraryOnboarding-btnGot');
                break;
            default:
                break;
        }
        return button;
    }

    /**
     * Get onboarding tutorial area in Dossier page
     * @param area Area can be one of following areas: ToC/ Bookmark/ Filter/ Comment
     * @returns {string}
     */
    getDossierOnboardingArea(area) {
        let onboardingArea = '';
        switch (area) {
            case 'ToC':
                onboardingArea = this.$('.mstrd-DossierViewOnboarding-navigation').$(
                    '.mstrd-DossierViewOnboarding-content'
                );
                break;
            case 'Bookmark':
                onboardingArea = this.$('.mstrd-DossierViewOnboarding-bookmark').$(
                    '.mstrd-DossierViewOnboarding-content'
                );
                break;
            case 'Filter':
                onboardingArea = this.$('.mstrd-DossierViewOnboarding-filter').$(
                    '.mstrd-DossierViewOnboarding-content'
                );
                break;
            case 'Comment':
                onboardingArea = this.$('.mstrd-DossierViewOnboarding-collab').$(
                    '.mstrd-DossierViewOnboarding-content'
                );
                break;
            default:
                break;
        }
        return onboardingArea;
    }

    /**
     * Get onboarding tutorial area in Dossier page
     * @param area Area can be one of following areas: ToC/ Bookmark/ Filter/ Comment
     * @param option Option can be one of following options: Next/ Skip/ Got It
     * @returns {string}
     */
    getDossierOnboardingButton(area, option) {
        const onboardingArea = this.getDossierOnboardingArea(area);
        let button = '';
        switch (option) {
            case 'Next':
                button = onboardingArea.$('.mstrd-DossierViewOnboarding-nextBtn');
                break;
            case 'Skip':
                button = onboardingArea.$('.mstrd-DossierViewOnboarding-skipBtn');
                break;
            case 'Got It':
                button = onboardingArea.$('.mstrd-DossierViewOnboarding-okBtn');
                break;
            default:
                break;
        }
        return button;
    }

    // Action helper
    async clickMoveRightItem() {
        await this.waitForElementVisible(this.getMoveToRightItem(), {
            msg: 'Move to Right button in Library Introduction is not present',
        });
        await this.click({ elem: this.getMoveToRightItem() });
        await this.waitForDynamicElementLoading();
        return this.sleep(3000); // Wait for animation to complete
    }

    async clickMoveLeftItem() {
        await this.waitForElementVisible(this.getMoveToLeftItem(), {
            msg: 'Move to Left button in Library Introduction is not present',
        });
        await this.click({ elem: this.getMoveToLeftItem() });
        await this.waitForDynamicElementLoading();
        return this.sleep(1000);
    }

    async clickIntroToLibraryGotIt() {
        await this.waitForElementVisible(this.getIntroToLibraryGotIt(), {
            msg: 'Got it button in Library Introduction is not present',
        });
        await this.getIntroToLibraryGotIt().click();
        return this.sleep(1000);
    }

    async clickIntroToLibrarySkip() {
        await this.waitForElementVisible(this.getIntroToLibrarySkip(), {
            msg: 'Skip button in Library Introduction is not present',
        });
        await this.getIntroToLibrarySkip().click();
        return this.sleep(1000);
    }

    async clickContinueTour() {
        await this.waitForElementVisible(this.getContinueTour(), {
            msg: 'Continue Tour button in Library Introduction is not present',
        });
        await this.click({ elem: this.getContinueTour() });
        await this.waitForDynamicElementLoading();
        return this.sleep(2000);
    }

    async clickLibraryOnboardingButton(area, option) {
        await this.sleep(2000); // waiting for area present
        await this.waitForElementExsiting(this.getLibraryOnboardingArea(area), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Onboarding area is not present',
        });
        await this.click({ elem: this.getLibraryOnboardingButton(area, option) });
        return this.waitForElementInvisible(this.getLibraryOnboardingArea(area), { timeout: this.DEFAULT_TIMEOUT / 5 });
    }

    async clickDossierOnboardingButton(area, option) {
        await this.sleep(2000); // waiting for area presents
        await this.waitForElementVisible(this.getDossierOnboardingArea(area));
        await this.clickAndNoWait({ elem: this.getDossierOnboardingButton(area, option) });
        return this.waitForElementInvisible(this.getDossierOnboardingArea(area), { timeout: this.DEFAULT_TIMEOUT / 5 });
    }

    async clickSkipButton() {
        await this.waitForElementVisible(this.getSkipButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Skip button is not present',
        });
        await this.click({ elem: this.getSkipButton() });
        return this.sleep(1000);
    }

    async clickDock(text) {
        await this.waitForElementVisible(this.getCarousel());
        switch (text) {
            case 'first':
                await this.clickAndNoWait({ elem: this.getIntroductionToLibraryDock()[0] });
                return this.waitForElementVisible(this.getIntroductionToLibrary(), {
                    timeout: this.DEFAULT_TIMEOUT / 5,
                    msg: 'Introduction To Library 1 is not present',
                });
            case 'second':
                await this.clickAndNoWait({ elem: this.getIntroductionToLibraryDock()[1] });
                // await this.getIntroductionToLibraryDock()[1).click(];
                return this.waitForElementVisible(this.getIntroductionToLibrary2(), {
                    timeout: this.DEFAULT_TIMEOUT / 5,
                    msg: 'Introduction To Library 2 is not present',
                });
            case 'third':
                await this.clickAndNoWait({ elem: this.getIntroductionToLibraryDock()[2] });
                return this.waitForElementVisible(this.getIntroductionToLibrary3(), {
                    timeout: this.DEFAULT_TIMEOUT / 5,
                    msg: 'Introduction To Library 3 is not present',
                });
        }
    }

    // Assertion helper

    async hasLibraryIntroduction() {
        return this.getIntroductionToLibrary().isDisplayed();
    }

    async isLibraryIntroductionPresent() {
        await this.waitForElementVisible(this.getIntroductionToLibrary(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Introduction To Library is not present',
        });
        return this.getIntroductionToLibrary().isDisplayed();
    }

    async isLibraryIntroduction2Present() {
        await this.waitForElementVisible(this.getIntroductionToLibrary2(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Introduction To Library2 is not present',
        });
        return this.getIntroductionToLibrary2().isDisplayed();
    }

    async isLibraryIntroduction3Present() {
        await this.waitForElementVisible(this.getIntroductionToLibrary3(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Introduction To Library3 is not present',
        });
        return this.getIntroductionToLibrary3().isDisplayed();
    }

    async isLibraryOnboardingAreaPresent(area) {
        await this.sleep(1000); // waiting for area present
        return this.getLibraryOnboardingArea(area).isDisplayed();
    }

    async isDossierOnboardingAreaPresent(area) {
        await this.sleep(3000); // waiting for area present
        return this.getDossierOnboardingArea(area).isDisplayed();
    }

    async waitForToCOnboardingAreaPresent() {
        await this.sleep(2000); // waiting for area present
        await this.waitForElementExsiting(this.getDossierOnboardingArea('ToC'), {
            timeout: 5000,
            msg: 'Toc area is not present',
        });
        return this.sleep(2000);
    }

    async waitForLibraryAreaPresent(area) {
        await this.waitForDynamicElementLoading();
        return this.waitForElementVisible(this.getLibraryOnboardingArea(area), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: `Onboarding area is not present`,
        });
    }

    async waitForDossierAreaPresent(area) {
        return this.waitForElementVisible(this.getDossierOnboardingArea(area), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: `Onboarding area is not present`,
        });
    }

    async getIntroductionToLibraryTitleText() {
        await this.waitForElementExsiting(this.getIntroductionToLibraryTitle(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Introduction To Library title is not present',
        });
        return this.getIntroductionToLibraryTitle().getText();
    }

    async getDossierViewOnboardingTitleText(area) {
        await this.waitForElementVisible(this.getDossierOnboardingArea(area));
        await this.waitForElementExsiting(this.getDossierViewOnboardingTitle(area), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Dossier View Onboarding title is not present',
        });
        return this.getDossierViewOnboardingTitle(area).getText();
    }

    async hasSkipButton() {
        return this.getSkipButton().isDisplayed();
    }

    async skip() {
        await this.sleep(2000); // waiting for animation complete
        if (await this.hasSkipButton()) {
            console.log('INFO: Try to click Skip button');
            await this.clickSkipButton();
            return this.waitForElementInvisible(this.getSkipButton(), { timeout: this.DEFAULT_TIMEOUT / 5 });
        }
    }
}
