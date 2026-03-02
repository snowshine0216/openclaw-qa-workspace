import { dashboardsAutoCredentials, ShadowProperty } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.11 shadow', () => {
    const dossier = {
        id: 'EED0D836794A24C67AA5BAB9CC4081E3',
        name: 'Auto_Radius',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let {
        libraryPage,
        loginPage,
        contentsPanel,
        dossierAuthoringPage,
        toolbar,
        formatPanel,
        newFormatPanelForGrid,
        baseFormatPanelReact,
        dossierCreator,
        dashboardFormattingPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await baseFormatPanelReact.dismissColorPicker();
        await dashboardFormattingPanel.close();
        await dossierAuthoringPage.goToLibrary();
        const notSave = dossierAuthoringPage.getDoNotSaveButton();
        if (await notSave.isExisting()) {
            await dossierAuthoringPage.notSaveDossier();
        }
    });

    it('[TC99538_6] shadow default value and manipulations in object level', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await formatPanel.openVizFormatPanel();
        const bgColor = await formatPanel.getShadowFillColor();
        await expect(bgColor).toBe('inherit');
        const shadowSection = await formatPanel.getShadowSection();
        const questionMark = await shadowSection.$('.question-mark');
        const exists = await questionMark.isExisting();
        await expect(exists).toBe(true);
        await takeScreenshotByElement(shadowSection, 'TC99538_6', 'Shadow component default value');

        // slide right for blur/Distance/Angle slider
        await formatPanel.slideShadowSliderByName(ShadowProperty.Blur, 40, 0);
        await browser.pause(1000);
        await formatPanel.slideShadowSliderByName(ShadowProperty.Distance, 50, 0);
        await browser.pause(1000);
        await formatPanel.slideShadowSliderByName(ShadowProperty.Angle, 60, 0);
        await browser.pause(1000);
        await takeScreenshotByElement(shadowSection, 'TC99538_6', 'Blur, Distance and Angle slider moved right');

        // set text color for Fill
        await formatPanel.setShadowInputboxByName(ShadowProperty.Fill, 60);
        await formatPanel.clickShadowFillColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#7E0F16');
        await baseFormatPanelReact.dismissColorPicker();
        // set to max value for blur
        await formatPanel.setShadowInputboxByName(ShadowProperty.Blur, 40);
        const blurValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Blur);
        await expect(blurValue).toBe('40');
        // slide rightmost for Distance/Angle slider
        await formatPanel.slideShadowSliderByName(ShadowProperty.Distance, 300, 0);
        await browser.pause(1000);
        await formatPanel.slideShadowSliderByName(ShadowProperty.Angle, 300, 0);
        await browser.pause(1000);
        // check distance value is 30, angle value is 359
        const distanceValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Distance);
        const angleValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Angle);
        await expect(distanceValue).toBe('30');
        await expect(angleValue).toBe('359°');
        await takeScreenshotByElement(shadowSection, 'TC99538_6', 'Blur, Distance and Angle slider moved rightmost');

        // slide left to min value for blur/Distance/Angle
        await formatPanel.setShadowInputboxByName(ShadowProperty.Blur, -1);
        const blurMinValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Blur);
        await expect(blurMinValue).toBe('0');

        await formatPanel.setShadowInputboxByName(ShadowProperty.Distance, -1);
        const distanceMinValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Distance);
        await expect(distanceMinValue).toBe('0');

        await formatPanel.setShadowInputboxByName(ShadowProperty.Angle, -1);
        const angleMinValue = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Angle);
        await expect(angleMinValue).toBe('0°');

        // undo and redo
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.clickButtonFromToolbar('Undo');
        const blurValueUndo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Blur);
        const distanceValueUndo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Distance);
        const angleValueUndo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Angle);
        await expect(blurValueUndo).toBe('40');
        await expect(distanceValueUndo).toBe('30');
        await expect(angleValueUndo).toBe('359°');

        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.clickButtonFromToolbar('Redo');
        const blurValueRedo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Blur);
        const distanceValueRedo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Distance);
        const angleValueRedo = await formatPanel.getShadowInputBoxValueByName(ShadowProperty.Angle);
        await expect(blurValueRedo).toBe('0');
        await expect(distanceValueRedo).toBe('0');
        await expect(angleValueRedo).toBe('0°');
    });

    it('[TC99538_7] shadow dashboard formating', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        await browser.pause(1000);

        const shadowFillSection = await dashboardFormattingPanel.getShadowFillSection();
        const blurSection = await dashboardFormattingPanel.getShadowBlurSection();
        const distanceSection = await dashboardFormattingPanel.getShadowDistanceSection();
        const angleSection = await dashboardFormattingPanel.getShadowAngleSection();
        await takeScreenshotByElement(
            shadowFillSection,
            'TC99538_7',
            'Fill default value in dashboard formatting panel'
        );
        await takeScreenshotByElement(blurSection, 'TC99538_7', 'Blur default value in dashboard formatting panel');
        await takeScreenshotByElement(
            distanceSection,
            'TC99538_7',
            'Distance default value in dashboard formatting panel'
        );
        await takeScreenshotByElement(angleSection, 'TC99538_7', 'Angle default value in dashboard formatting panel');

        // slide right for blur/Distance/Angle slider
        await dashboardFormattingPanel.slideShadowBlurSlider(10);
        await browser.pause(1000);
        await dashboardFormattingPanel.slideShadowDistanceSlider(20);
        await browser.pause(1000);
        await dashboardFormattingPanel.slideShadowAngleSlider(30);
        await browser.pause(1000);
        // set text color for Fill
        await dashboardFormattingPanel.setShadowFillCapacityValue(60);
        // set color to Red
        await dashboardFormattingPanel.selectShadowColorByName('Red');
        const dashboardFormatPanel = await dashboardFormattingPanel.getDashboardFormatPanel();
        await takeScreenshotByElement(dashboardFormatPanel, 'TC99538_7', 'Preview');

        // set to max value for blur
        await dashboardFormattingPanel.setShadowBlurValue(45);
        const blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('28');
        await dashboardFormattingPanel.setShadowBlurValue(40);
        const blurValue2 = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue2).toBe('40');
        // slide rightmost for Distance/Angle slider
        await dashboardFormattingPanel.setShadowDistanceValue(30);
        await browser.pause(1000);
        await dashboardFormattingPanel.setShadowAngleValue(359);
        await browser.pause(1000);
        // check distance value is 30, angle value is 359
        const distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        const angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(distanceValue).toBe('30');
        await expect(angleValue).toBe('359°');

        // slide left to min value for blur/Distance/Angle
        await dashboardFormattingPanel.setShadowBlurValue(0);
        const blurMinValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurMinValue).toBe('0');

        await dashboardFormattingPanel.setShadowDistanceValue(0);
        const distanceMinValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceMinValue).toBe('0');

        await dashboardFormattingPanel.setShadowAngleValue(0);
        const angleMinValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleMinValue).toBe('0°');
    });

    it('[TC99538_8] switch between card and flat when default', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();

        // Select Card layout
        await dashboardFormattingPanel.selectLayoutStyle('card');
        await expect(await dashboardFormattingPanel.isCardSelected()).toBe(true);
        let paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('16');

        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        let radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('10');
        let shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(191, 191, 191)');
        let shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('40%');
        let blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('10');
        let distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('0');
        let angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('0°');

        // Select Flat layout
        await dashboardFormattingPanel.scrollBackToTop();
        await dashboardFormattingPanel.selectLayoutStyle('flat');
        await expect(await dashboardFormattingPanel.isFlatSelected()).toBe(true);
        paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('12');

        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('2');

        shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(255, 255, 255)'); // No Fill
        shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('40%');
        blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('0');
        distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('0');
        angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('0°');

        // Select Card layout
        await dashboardFormattingPanel.scrollBackToTop();
        await dashboardFormattingPanel.selectLayoutStyle('card');
        await expect(await dashboardFormattingPanel.isCardSelected()).toBe(true);
        paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('16');
        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('10');
        shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(191, 191, 191)');
        shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('40%');
        blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('10');
        distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('0');
        angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('0°');
    });

    it('[TC99538_9] switch between card and flat when not default', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickBlankDossierBtn();
        await dashboardFormattingPanel.open();
        await dashboardFormattingPanel.setPaddingValue('20');
        await browser.pause(1000);
        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        await dashboardFormattingPanel.setShadowBlurValue(30);
        await browser.pause(1000);
        await dashboardFormattingPanel.setShadowDistanceValue(20);
        await browser.pause(1000);
        await dashboardFormattingPanel.setShadowAngleValue(270);
        await browser.pause(1000);
        // set text color for Fill
        await dashboardFormattingPanel.setShadowFillCapacityValue(60);
        await dashboardFormattingPanel.selectShadowColorByName('Red');

        // Select Card layout
        await dashboardFormattingPanel.scrollBackToTop();
        await dashboardFormattingPanel.selectLayoutStyle('card');
        await expect(await dashboardFormattingPanel.isCardSelected()).toBe(true);
        let paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('16');

        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        let radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('10');
        let shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(255, 0, 0)');
        let shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('60%');
        let blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('30');
        let distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('20');
        let angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('270°');

        // Select Flat layout
        await dashboardFormattingPanel.scrollBackToTop();
        await dashboardFormattingPanel.selectLayoutStyle('flat');
        await expect(await dashboardFormattingPanel.isFlatSelected()).toBe(true);
        paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('12');

        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('2');

        shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(255, 255, 255)'); // No Fill
        shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('60%');
        blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('0');
        distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('20');
        angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('270°');

        // Select Card layout
        await dashboardFormattingPanel.scrollBackToTop();
        await dashboardFormattingPanel.selectLayoutStyle('card');
        await expect(await dashboardFormattingPanel.isCardSelected()).toBe(true);
        paddingValue = await dashboardFormattingPanel.getPaddingValue();
        await expect(paddingValue).toBe('16');
        await dashboardFormattingPanel.scrollToShadowAngleSetting();
        radiusValue = await dashboardFormattingPanel.getRadiusValue();
        await expect(radiusValue).toBe('10');
        shadowFillColor = await dashboardFormattingPanel.getShadowFillColor();
        await expect(shadowFillColor).toContain('rgb(191, 191, 191)');
        shadowFillValue = await dashboardFormattingPanel.getShadowFillValue();
        await expect(shadowFillValue).toBe('60%');
        blurValue = await dashboardFormattingPanel.getShadowBlurValue();
        await expect(blurValue).toBe('10');
        distanceValue = await dashboardFormattingPanel.getShadowDistanceValue();
        await expect(distanceValue).toBe('20');
        angleValue = await dashboardFormattingPanel.getShadowAngleValue();
        await expect(angleValue).toBe('270°');
    });
});
