import {  customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';



const specConfiguration = { ...customCredentials('_authoring') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.3;

describe('MDX Filter - pause mode', () => {
    const dossier = {
        id: '0789F6F546686D717D46408B98E183F4',
        name: '(Auto) MDX RA_Pause Mode',
        project: tutorialProject,
    };


    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { 
        dossierPage, 
        selectorObject, 
        libraryPage, 
        loginPage, 
        authoringFilters,
        dossierAuthoringPage,
        inCanvasSelector_Authoring,
        agGridVisualization,
    } = browsers.pageObj1;

    let checkbox = selectorObject.checkbox;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDossierContextMenu(dossier.name);
        await libraryPage.clickDossierContextMenuItem('Edit without Data');
        await dossierPage.waitForItemLoading();
        await authoringFilters.switchToFilterPanel();
        // check filter on authoring mode
        await authoringFilters.expandFilter('Accounts(Group)');
        // clear all first
        await checkbox.clickClearAll();
    });

    afterEach(async () => {
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });

    
    it('[TC80663_06] RA filter in pause mode - checkbox with manipulations', async () => {
        // search and select elements
        await checkbox.search('a');
        await checkbox.selectSearchResults(['Receivables']);
        since('After selecting "Receivables" for Accounts(Group) filter, selected items in search results should be #{expected}, while we get #{actual}')
            .expect( await checkbox.getSelectedItemsInSearchResults())
            .toEqual(['Receivables', 'Trade Receivables', 'Other Receivables']);
        await checkbox.clearSearch();

        // expand group and do singe and branch selection
        await checkbox.expandItemByText('Group 2');
        since('Before selecting items under Group 2, selected status should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Group 2'))
            .toBe('Child Selected');
        await checkbox.singleSelectItemByText('Group 2');
        await checkbox.branchSelectItemByTexts(['Inventory']);
        await checkbox.expandItemByText('Inventory');
        since('After selecting "Group 2" and "Inventory", selected status should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Inventory'))
            .toBe('All Selected');
        await checkbox.clickClearAll();

        // search and select again to verify
        await checkbox.search('balance');
        await checkbox.selectSearchResults(['Balance Sheet']);
        await checkbox.clearSearch();

        // expand and select
        await checkbox.expandItemsByText(['Balance Sheet', 'Assets']);

        // search income and select
        await checkbox.search('Income');
        await checkbox.selectSearchResults(['Net Income']);
        await checkbox.clearSearch();
        await checkbox.expandItemsByText(['Net Income', 'Operating Profit', 'Gross Margin', 'Net Sales','Gross Sales']);

        // do selections for diffenerent levels
        await checkbox.singleSelectItemByText('Trade Sales');
        since('After multiple selections, selected status of "Sales" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Gross Sales'))
            .toBe('Child + Single Selected');
        await checkbox.branchSelectItemByTexts(['Balance Sheet', 'Assets']);
        since('After multiple selections, selected status of "Other Assets" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Other Assets'))
            .toBe('Single Selected');
        since('After multiple selections, selected status of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Balance Sheet'))
            .toBe('Child Selected');
        await checkbox.clickClearAll();
        
    });

    it('[TC80663_07] RA filter in pause mode - xfunc with normal mode ', async () => {
        // search in level and do selection
        await checkbox.selectLevelInSearchBar('Account Level 01');
        await checkbox.search('a');
        since('the search results under Level 1 should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getAllItemsInSearchResults())
            .toEqual(['Balance Sheet', 'Statistical Accounts']);
        await checkbox.selectSearchResults(['Balance Sheet']);
        await checkbox.clearSearch();
        // expand group and do singe and level selection
        await checkbox.expandItemsByText(['Balance Sheet', 'Assets']);
        await checkbox.levelSelectItemByText('Assets', 'Account Level 03');

        // run in normal mode to verify selections
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        since('After switching to normal mode, selected status of "Assets" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Assets'))
            .toBe('Child + Single Selected');
        since('After switching to normal mode, selected status of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Balance Sheet'))
            .toBe('Child + Single Selected');
        // do more selections in normal mode
        await checkbox.branchSelectItemByTexts(['Assets']);
        
        // go back to pause mode and check selections are kept
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await authoringFilters.expandFilter('Accounts(Group)');
        await checkbox.expandItemsByText(['Balance Sheet', 'Assets']);
        since('After switching back to pause mode, selected status of "Assets" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Assets'))
            .toBe('All Selected');
        since('After switching back to pause mode, selected status of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Balance Sheet'))
            .toBe('All Selected');
        

        // save the dossier
        await dossierAuthoringPage.clickSaveDossierButton(dossier.name);
        await dossierAuthoringPage.clickCloseDossierButton();

        // edit again to verify selections are kept after save
        await libraryPage.openDossierContextMenu(dossier.name);
        await libraryPage.clickDossierContextMenuItem('Edit without Data');
        await dossierPage.waitForItemLoading();
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.expandFilter('Accounts(Group)');
        await checkbox.expandItemsByText(['Balance Sheet', 'Assets']);
        since('After reopening the dossier, selected status of "Assets" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Assets'))
            .toBe('All Selected');
        since('After reopening the dossier, selected status of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Balance Sheet'))
            .toBe('All Selected');


        // chnage it to other style filter and verify selections are cleared
        await authoringFilters.changeDisplayStyle('Accounts(Group)', 'Search Box', false);
        const searchbox = authoringFilters.selectorObject.searchbox;
        since('After changing filter type, the items under Accounts(Group) should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual([]);
        await authoringFilters.changeDisplayStyle('Accounts(Group)', 'Check Boxes', false);
        await authoringFilters.expandFilter('Accounts(Group)');
        since('After reopening the dossier, selected status of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await checkbox.getItemSelectedStatus('Balance Sheet'))
            .toBe('Not Selected');
        
        
    });

    it('[TC80663_08] RA filter in pause mode - checkbox ICS ', async () => {
        // click edit button in pause mode and unset it first
        let accountsSelector = InCanvasSelector.createByAriaLable('Accounts(Group)');
        await accountsSelector.clickEditButtonInPauseMode();
        await inCanvasSelector_Authoring.unsetSelectorFilter('Accounts(Group)')

        // change selections for ics in pause mode
        await accountsSelector.selectItem('Account Level 02');
        await accountsSelector.selectDropdownItems(['Assets', 'Cash']);
        await accountsSelector.clickApplyButtonInPauseMode();

        // run in normal mode to verify selections
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        since('After switching to normal mode, the target grid cell display of "Assets" should be #{expected}, while we get #{actual}')
            .expect(await agGridVisualization.isCellInGridDisplayed('Assets', 'Visualization 1'))
            .toBe(false);
        since('After switching to normal mode, the target grid cell display of "Cash" should be #{expected}, while we get #{actual}')
            .expect(await agGridVisualization.isCellInGridDisplayed('Cash', 'Visualization 1'))
            .toBe(false);
        since('After switching to normal mode, the target grid cell display of "Balance Sheet" should be #{expected}, while we get #{actual}')
            .expect(await agGridVisualization.isCellInGridDisplayed('Balance Sheet', 'Visualization 1'))
            .toBe(true);
        // do more selections in normal mode
        await accountsSelector.selectItem('Account Level 02');
        await accountsSelector.selectDropdownItems(['(All)', '(All)', 'Cash']); 
        await accountsSelector.clickApplyButtonInPauseMode();
        
        // go back to pause mode and check selections are kept
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await accountsSelector.clickEditButtonInPauseMode();
        await accountsSelector.selectItem('Account Level 02');
        since('After switching back to pause mode, the selected items under Account Level 02 should be #{expected}, while we get #{actual}')
            .expect(await accountsSelector.getSelectedItemsInLevelDropdown())
            .toEqual(['Cash']); 
        await accountsSelector.clickApplyButtonInPauseMode();
        
    });

    
    
    
});
export const config = specConfiguration;
