import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Limit Element Source - In Canvas Selector', () => {
    let {
        authoringFilters,
        datasetsPanel,
        dossierAuthoringPage,
        dossierPage,
        grid,
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

    const checkIfExpectedCheckboxesExist = async (shouldCheckbox2000Exist) => {
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2011").isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        if (shouldCheckbox2000Exist) {
            since("2000 checkbox should exist, instead it doesn't")
                .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
                .toBe(true);
        }
        else {
            since("2000 checkbox shouldn't exist, instead it does")
                .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
                .toBe(false);
        }
    }

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

    it("[TC94206_0] Create Dashboard with two datasets", async () => {
        await libraryAuthoringPage.createDossierFromLibrary();
        await dossierAuthoringPage.addNewSampleData(0);
        await dossierAuthoringPage.addNewSampleData(7, [{ name: itemNameYear, type: 'Text' }]);
        await linkAttributes.linkToOtherDataset(datasetName, itemNameYear, itemNameYear);
        await datasetsPanel.addDatasetElementToVisualization(itemNameYear);
        await datasetsPanel.addDatasetElementToVisualization('Avg Delay (min)');
        await datasetsPanel.addDatasetElementToVisualization('From Coal');
    });

    it("[TC94206_1] Add an attribute to the filter panel", async () => {
        await authoringFilters.addFilterToFilterPanel(itemNameYear);
    });

    it("[TC94206_2] Move to Canvas", async () => {
        await authoringFilters.moveFilterToCanvas(itemNameYear, 'Visualization 1');
    });

    it("[TC94206_3] Make sure that the default is set to 'All available datasets'", async () => {
        await limitElementSource.openLimitElementSourceMenuInCanvas(itemNameYear);
        since(
            '"All available datasets" context menu should be selected, instead it is not'
        )
            .expect(await authoringFilters.getContextMenuOptionChecked('All available datasets').isDisplayed())
            .toBe(true);
        await limitElementSource.clickOutside();
    });

    it("[TC94206_4] Select one Dataset", async () => {
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, allCheckboxText);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2011');
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2009');
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2000');
        await checkIfExpectedCheckboxesExist(true);
        await limitElementSource.selectElementSourceInFilterInCanvas(itemNameYear, datasetName);
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        await checkIfExpectedCheckboxesExist(false);
    });

    it("[TC94206_5] Undo/Redo", async () => {
        await toc.click({ elem: dossierAuthoringPage.getToolbarBtnByName('Undo') });
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        await checkIfExpectedCheckboxesExist(true);
        await toc.click({ elem: dossierAuthoringPage.getToolbarBtnByName('Redo') });
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        await checkIfExpectedCheckboxesExist(false);
    });

    it("[TC94206_6] Duplicate Page", async () => {
        await tocMenu.duplicatePage('Page 1');
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        await checkIfExpectedCheckboxesExist(false);
    });

    it("[TC94206_7] Save as and reopen the dashboard", async () => {
        await libraryAuthoringPage.saveDashboard('TC94206');
        await libraryAuthoringPage.goToHome();
        await libraryPage.openDossier('TC94206');
        await toc.waitForCurtainDisappear();
        await takeScreenshotByElement(await grid.getContainerByTitleInCurrentPage('Visualization 1'), 'TC94206', 'Month linked, filtered, consumption');
        since("2011 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getInCanvasItemCheckOption('Year', '2011').isDisplayed())
            .toBe(true);
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getInCanvasItemCheckOption('Year', '2009').isDisplayed())
            .toBe(true);
        since("2000 checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getInCanvasItemCheckOption('Year', '2000').isDisplayed())
            .toBe(false);
    });
});
