import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'HQ_Tree';

describe('HQ Prompt - Tree', () => {
    const HQPromptName1 = 'Hierarchies';
    const dossier1 = {
        id: '7D850ECF4530850C5513FF88DDBD9F88',
        name: 'All Hierarchies-Tree-SearchRequired',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const HQPromptName2 = 'Time Hierarchy';
    const dossier2 = {
        id: 'E5F0470311E8F2DA06540080EFF5D316',
        name: 'Time hierarchy-Tree-MultiplePersonalAnswer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const HQPromptName3 = 'Hierarchies';
    const dossier3 = {
        id: '526FFE724721495E1E81868DF589FDA9',
        name: 'All Hierarchies-Tree-FolderStructure',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;

    let { loginPage, rsdGrid, grid, dossierPage, libraryPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC65395]HQ with Tree style - Search required ', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName1);

        // check the default UI
        await since('The default hierarchies is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 1))
            .toBe(4);
        // Expand attributes and check search required
        await promptObject.tree.expandEle(prompt, 'Customers');
        await promptObject.tree.expandEle(prompt, 'Customer Age');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65395', 'SearchRequired');

        // Search in search reuired input
        // In Customer Age, search for a
        await promptObject.tree.searchInEle(prompt, 'Customer Age', 'a');
        // scroll to bottom to see search result
        await promptObject.tree.scrollTreeToBottom(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65395', 'NoSearchResult');

        // Clear search and search for 20
        await promptObject.tree.clearSearchInEle(prompt, 'Customer Age');
        await promptObject.tree.searchInEle(prompt, 'Customer Age', '20');
        await promptObject.tree.scrollTreeToBottom(prompt);
        await since('The Search Result For 20 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(1);
        // Clear search and search for nothing
        await promptObject.tree.clearSearchInEle(prompt, 'Customer Age');
        await promptObject.tree.searchInEle(prompt, 'Customer Age', '');
        await promptObject.tree.scrollTreeToBottom(prompt);
        await since('The Search Result For Blank is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(30);
        // Add search result
        await promptObject.tree.clickEleName(prompt, '48');
        await promptObject.shoppingCart.addSingle(prompt);
        // check prompt summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName1);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName1))
            .toBe('Customer AgeIn List48');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Abdullah', 'Candice', '48', '--']);
    });

    it('[TC65396]HQ with Tree style - Check tree view and answer prompt', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName2);

        // check the default UI
        // await since('The default hierarchies is supposed to be #{expected}, instead we get #{actual}')
        //     .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt)).toBe(6);
        // Check expand manipulations
        await promptObject.tree.expandEle(prompt, 'Month');
        await promptObject.tree.clickEleName(prompt, 'Jan 2014');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.tree.expandEle(prompt, 'Jan 2014');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65396', 'ExpandAttributeElement');

        // Switch page in tree node
        await promptObject.tree.goToNextPage(prompt, 'Month');
        // Check collapse manipulation
        await promptObject.tree.collapseEle(prompt, 'Time');
        await since('is Collapse Icon Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.tree.isCollapseIconPresent(prompt, 'Time'))
            .toBe(false);
        await since('is Expand Icon Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.tree.isExpandIconPresent(prompt, 'Time'))
            .toBe(true);
        // Check origin expand status
        await promptObject.tree.expandEle(prompt, 'Time');
        await since('is Collapse Icon Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.tree.isCollapseIconPresent(prompt, 'Time'))
            .toBe(true);
        // Add element in different pages
        await promptObject.tree.clickEleName(prompt, 'Aug 2016');
        await promptObject.shoppingCart.addSingle(prompt);
        // Check prompt answer
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await takeScreenshot('TC65396', 'ElementsInShoppingCart');

        await promptObject.shoppingCart.confirmValues(prompt);
        // Answer prompt using 'qualify'
        await promptObject.tree.clickEleName(prompt, 'Month');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '10');
        await promptObject.shoppingCart.confirmValues(prompt);

        // check prompt summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName2);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(HQPromptName2))
            .toEqual('MonthID Greater than10\nAND\nMonthIn ListJan 2014, Aug 2016');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Date' }))
            .toBe('1/1/2014 12:00:00 AM');
    });

    it('[TC65397]HQ with Tree style - Check date/year format in searching and answering prompt', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName2);

        // check year format
        // search valid value
        await promptObject.tree.clickEleName(prompt, 'Year');
        await promptObject.shoppingCart.searchFor(prompt, '2015');
        await promptObject.tree.scrollTreeToBottom(prompt);
        await since('The Search Result For 2015 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(1);
        // search invalid value
        await promptObject.shoppingCart.clearAndSearch(prompt, '1/1/2015');
        await promptObject.tree.scrollTreeToBottom(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65397', 'InvalidSearch', { tolerance: 0.4 });

        await promptObject.tree.openErrorDetails(prompt);
        await since('Number Value Required error message is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorMsg())
            .toEqual('Numerical values required.');
        await promptEditor.dismissError();

        // search for date format(server search)
        await promptObject.tree.clickEleName(prompt, 'Day');
        await promptObject.shoppingCart.clearAndSearch(prompt, '1/1/2015');
        await since('The Search Result For 1/1/2015 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(1);
        await promptObject.shoppingCart.clearAndSearch(prompt, '2015/1/1');
        await promptObject.tree.openErrorDetails(prompt);
        await since('Date Value Required error message is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorMsg())
            .toEqual('Date or time values required.');
        await promptEditor.dismissError();
        await promptObject.shoppingCart.clearAndSearch(prompt, '12:0:0');
        await since('The Search Result For 12:0:0 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(0);
        await promptObject.shoppingCart.clearAndSearch(prompt, '1/1/2015 12:0');
        await since('The Search Result For 1/1/2015 12:0 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.tree.countCSSByLevel(prompt, 3))
            .toBe(1);

        // check input in date format(client check)
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '12:00');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Input "12:00", prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\n12:00');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '1/1/2015');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Input "1/1/2015", prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\n1/1/2015');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearValues(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '2015/1/1');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Invalid Answer error message is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorMsg())
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');
        await promptEditor.dismissError();
        await since('Input "2015/1/1", prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\nValue');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '2015.1.1');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.dismissError();
        await since('Input "2015.1.1", prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\nValue');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '2015-01-01');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Input "2015-01-01", prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\n2015-01-01');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Date' }))
            .toBe('1/1/2015 12:00:00 AM');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$4,163');
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(HQPromptName2);
        await since('Reprompt, previous prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\n1/1/2015');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '1/1/2015 12:00:00 am');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since(
            'Input "1/1/2015 12:00:00 am", prompt answer is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nEquals\n1/1/2015 12:00:00 am');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName2))
            .toBe('DayID Equals1/1/2015 12:00:00 am');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Date' }))
            .toBe('1/1/2015 12:00:00 AM');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$4,163');
    });

    it('[TC65636]Check qualification prompt with multiple selections for day attribute', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName2);

        // answer prompt with multiple selections
        await promptObject.tree.clickEleName(prompt, 'Day');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 160);
        await promptObject.shoppingCart.selectCondition(prompt, 'In');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        // use shopping cart to select
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nIn\n1/1/2014; 1/2/2014');
        // use calendar to select
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.calendar.openCalendar(prompt);
        await promptObject.calendar.selectDay(prompt, '1');
        await promptObject.shoppingCart.clickValueInput(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        // TODO: DE165925: Can select duplicated dates
        await since('Add duplicated value, prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nIn\n1/1/2014; 1/2/2014');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName2))
            .toBe('DayID In1/1/2014; 1/2/2014');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Date' }))
            .toBe('1/1/2014 12:00:00 AM');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$2,324');

        // Delete previous selections
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(HQPromptName2);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearByKeyboard(prompt, 1);
        // Must wait for 3 seconds, otherwise the values are not deleted successfully
        await dossierPage.sleep(3000);
        await promptObject.calendar.openCalendar(prompt);
        await promptObject.calendar.clearAndInputYear(prompt, '2014');
        await promptObject.calendar.openMonthDropDownMenu(prompt);
        await promptObject.calendar.selectMonth(prompt, 'January');
        await promptObject.calendar.selectDay(prompt, '3');
        await promptObject.shoppingCart.confirmValues(prompt);
        // DE162735: fixed in 11.3
        await since(
            'Delete previous value and choose 1/3/2014, prompt answer is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toBe('Day\nQualify\nID\nIn\n1/3/2014');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName2))
            .toBe('DayID In1/3/2014');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Date' }))
            .toBe('1/3/2014 12:00:00 AM');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$3,145');
    });

    it('[TC65399]HQ with Tree style - Check search in folder structure', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName3);

        // check the default UI
        // search in folder structure
        await promptObject.tree.expandEle(prompt, 'Customers');
        await promptObject.tree.clickEleName(prompt, 'Customer Age');
        // search --- no result
        await promptObject.shoppingCart.searchFor(prompt, '2');
        // In folder structure, it will not automatically scroll to search result
        await promptObject.tree.collapseEle(prompt, 'Customers');
        await promptObject.tree.expandEle(prompt, 'Search for: 2');
        await promptObject.tree.setIsSearch(true);
        await promptObject.tree.expandEle(prompt, 'Customer Age');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65399', 'FolderStructureNoSearchReault');

        // search --- has match result
        await promptObject.shoppingCart.clearAndSearch(prompt, '20');
        await promptObject.tree.setIsSearch(false);
        await promptObject.tree.expandEle(prompt, 'Search for: 20');
        await promptObject.tree.setIsSearch(true);
        await promptObject.tree.expandEle(prompt, 'Customer Age');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65399', 'FolderStructureSearchReault');
        await promptObject.tree.setIsSearch(false);
        await promptObject.tree.clickEleName(prompt, '20');
        await promptObject.shoppingCart.addSingle(prompt);
        // search --- invalid value
        await promptObject.tree.setIsSearch(true);
        await promptObject.tree.clickEleName(prompt, 'Customer Age');
        await promptObject.shoppingCart.clearAndSearch(prompt, 'b');
        await promptObject.tree.setIsSearch(false);
        await promptObject.tree.expandEle(prompt, 'Search for: b');
        await promptObject.tree.setIsSearch(true);
        await promptObject.tree.expandEle(prompt, 'Customer Age');
        // await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65399', 'FolderStructureInvalidSearch'); // DE166183

        // check prompt summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName3);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName3))
            .toBe('Customer AgeIn List20');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Abriyelyan', 'Freddie', '20', '--']);
    });
});

export const config = specConfiguration;
