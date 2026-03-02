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
    promptEditor,
    grid,
    radiobuttonFilter,
    checkboxFilter,
    filterSummaryBar,
    promptObject,
    toc,
    bookmark,
    dossierPage,
} = browsers.pageObj1;

describe('FirstNLastN-dropdown', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC63736] Validate rendering and manipulations for dropdown filter with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: 'C487C2D34B551F13C42744B1C916CF72',
            name: 'FirstN/LastN-Dropdown Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for filters in dynamic on/off status
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63736', 'DropdownInitialRender');

        // check dropdown filter with FirstN, allow multiple selection
        await checkboxFilter.openSecondaryPanel('Customer');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC63736', 'DropdownDisplayAsCheckbox');

        // edit dynamic filter, select all
        await checkboxFilter.selectAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Select all elements, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(10000/10000)');

        // check dropdown filter with Not FirstN, single selection
        await radiobuttonFilter.openSecondaryPanel('Quarter');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC63736', 'DropdownDisplayAsRadiobutton');
    });

    it('[TC69662] Validate filter with FirstN/LastN can be filtered by same attribute prompt in Library', async () => {
        const dossier = {
            id: '93CF5F0543C87551B576D2B463939E15',
            name: 'FirstN/LastN-Dropdown Filter with prompt',
            project,
        };
        const promptName = 'Year';
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();

        // check filter elements are filtered by prompt answer
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Summary for Year in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(exclude 2015)');

        await promptEditor.reprompt();
        await promptObject.shoppingCart.clickElmInAvailableList(await promptObject.getPromptByName(promptName), '2016');
        await promptObject.shoppingCart.addSingle(await promptObject.getPromptByName(promptName));
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Summary for Year in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(exclude 2016)');
    });

    it('[TC63737] Validate filter with FirstN/LastN can be passed in dossier linking in Library', async () => {
        const dossier = {
            id: 'C487C2D34B551F13C42744B1C916CF72',
            name: 'FirstN/LastN-Dropdown Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Multi chapter filter-has linking', pageName: 'Page 1' });

        // check filter can be passed to same dossier
        await grid.linkToTargetByGridContextMenu({ title: 'Link to same dossier', headerName: 'Customer' });
        await filterPanel.openFilterPanel();
        await since(
            'Link to same dossier, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(10/10000)');
        await since(
            'Link to same dossier, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(2/3)');
        await since(
            'Link to same dossier, filter selection info for Quarter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(exclude 1/12)');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63737', 'FilterInSameDossier');

        // close filter panel
        await filterPanel.closeFilterPanel();
        await dossierPage.goBackFromDossierLink();

        // check filter can be passed to target dossier
        await dossierPage.clickTextfieldByTitle('Link to other dossier');
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await since(
            'Link to other dossier, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(10/10000)');
        await since(
            'Link to other dossier, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(2/3)');
        await since(
            'Link to other dossier, filter selection info for Quarter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(exclude 1/12)');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63737', 'FilterInTargetDossier');

        // Pass clear all
        await dossierPage.goBackFromDossierLink();
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await grid.linkToTargetByGridContextMenu({ title: 'Link to same dossier', headerName: 'Customer' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63737', 'PassClearAllInSameDossier');

        await filterPanel.closeFilterPanel();
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickTextfieldByTitle('Link to other dossier');
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63737', 'PassClearAllInTargetDossier');
    });
});

export const config = specConfiguration;
