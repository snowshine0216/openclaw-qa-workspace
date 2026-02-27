import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const browserWindow = {
    
    width: 1200,
    height: 1200,
};

let {
    loginPage,
    filterPanel,
    libraryPage,
    attributeSlider,
    searchBoxFilter,
    radiobuttonFilter,
    checkboxFilter,
    filterSummaryBar,
    grid,
    toc,
    bookmark,
    dossierPage,
    commentsPage,
} = browsers.pageObj1;

describe('FirstNLastN-slider', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC69656] Validate rendering and manipulations for attribute slider filter with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: 'C119D1F54990E3005C792FB44680175A',
            name: 'FirstN/LastN-Attribute slider Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for filters in dynamic on/off status
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69656', 'SliderInitialRender');

        // clear all filters
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69656', 'ClearAllFilters');

        // reset to dynamic
        await attributeSlider.openContextMenu('Customer');
        await attributeSlider.selectContextMenuOption('Customer', 'Reset');
        await attributeSlider.openContextMenu('Customer Address');
        await attributeSlider.selectContextMenuOption('Customer Address', 'Reset');
        await attributeSlider.openContextMenu('First Order Date');
        await attributeSlider.selectContextMenuOption('First Order Date', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69656', 'ResetToDynamic');
    });
});

export const config = specConfiguration;
