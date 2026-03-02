import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Limit Element Source - Chapter Filter', () => {
    let {
        authoringFilters,
        datasetsPanel,
        dossierAuthoringPage,
        dossierPage,
        filterSummary,
        libraryAuthoringPage,
        libraryPage,
        limitElementSource,
        linkAttributes,
        loginPage,
        toc,
        tocMenu,
    } = browsers.pageObj1;

    const datasetName = "airline-sample-data.xls";
    const itemNameYear = "Year";
    const allCheckboxText = "(All)";

    beforeAll(async () => {
        await loginPage.login(consts.analystUser.credentials);
        await setWindowSize(browserWindowCustom);
        await browser.execute(() => {
            localStorage.setItem('dontShowAIAssistantTooltip', '{"ts":-1,"data":true}');
        });
    });

    afterAll(async () => {
        await dossierPage.goToLibrary();
        await browser.execute(() => {
            localStorage.removeItem('dontShowAIAssistantTooltip');
        });
    });

    it("[TC94205_0] Create Dashboard with two datasets", async () => {
        await libraryAuthoringPage.createDossierFromLibrary();
        await dossierAuthoringPage.addNewSampleData(0);
        await dossierAuthoringPage.addNewSampleData(7, [{ name: itemNameYear, type: 'Text' }]);
        await linkAttributes.linkToOtherDataset(datasetName, itemNameYear, itemNameYear);
    });

    it("fill grid, check Chapter 1, add an attribute to the filter panel", async () => {
        await datasetsPanel.addDatasetElementToVisualization(itemNameYear);
        await datasetsPanel.addDatasetElementToVisualization('Avg Delay (min)');
        await datasetsPanel.addDatasetElementToVisualization('From Coal');
        await authoringFilters.addFilterToFilterPanel(itemNameYear);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, allCheckboxText);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2011');
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2009');
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2000');
    });

    it("[TC94205_0.5] Check if default is set to 'All available datasets'", async () => {
        await limitElementSource.openLimitElementSourceMenu(itemNameYear);
        expect(await dossierAuthoringPage.getMenuItemParent('All available datasets').getAttribute('class')).toContain('on');
        await limitElementSource.clickOutside();
    });


    it("[TC94205_1] Select Dataset -> Cancel", async () => {
        // Throttling network is needed to have enough time to click cancel button
        await browser.throttleNetwork('Regular3G');
        await limitElementSource.selectElementSource(itemNameYear, datasetName);
        await dossierAuthoringPage.clickLoadingDataCancelButton();
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        await browser.throttleNetwork('online');
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Select Dataset -> Cancel');
    });

    it("[TC94205_2] Select Dataset -> Click outside", async () => {
        await limitElementSource.clickOutsideElementSourceSelection(itemNameYear);
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Select Dataset -> Click outside');
    });

    it("[TC94205_3] Select Dataset -> OK", async () => {
        await limitElementSource.selectElementSource(itemNameYear, datasetName);
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Select Dataset -> OK');
    });

    it("[TC94205_4] Undo/Redo", async () => {
        await toc.click({ elem: dossierAuthoringPage.getToolbarBtnByName('Undo') });
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Undo');
        await toc.click({ elem: dossierAuthoringPage.getToolbarBtnByName('Redo') });
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Redo');
    });

    it("[TC94205_5] Duplicate Chapter", async () => {
        await tocMenu.duplicateChapter('Chapter 1');
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(await authoringFilters.getFilterPanel(), 'TC94205', 'Filter: Duplicated Chapter');
    });

    it("[TC94205_6] Save the dashboard", async () => {
        await libraryAuthoringPage.saveDashboard('TC94205');
        await libraryAuthoringPage.goToHome();
    });

    it("[TC94205_7] Open saved dashboard in consumption mode and check that the data source is limited to the dataset 1 on Chapter 1", async () => {
        await libraryPage.openDossier('TC94205');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1' });
        await toc.waitForCurtainDisappear();
        since("Filter option should contain #{expected}, instead it is #{actual}")
            .expect(await filterSummary.getFilterByName('Year').getText())
            .toMatch(/\b2009\b/);
        since("Filter option should contain #{expected}, instead it is #{actual}")
            .expect(await filterSummary.getFilterByName('Year').getText())
            .toMatch(/\b2011\b/);
        since("Filter option should not contain #{expected}, instead it is #{actual}")
            .expect(await filterSummary.getFilterByName('Year').getText())
            .not.toMatch(/\b2000\b/);
    });
});
