import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { getStringOfDate } from '../../../utils/timeHelper.js';

const specConfiguration = { ...customCredentials('_LD') };

describe('CarryOverDifferentPromptTypes', () => {
    const rsd = {
        id: '3B6439B444A71E98731C8E808D9F5983',
        name: 'Source_CarryOverSelector',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let dropdown, listbox, linkbar, radiobutton, checkbox, searchbox, metricSlider, metricQualification, calendar;

    let { loginPage, dossierPage, toc, libraryPage, selectorObject, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66643] validate single to single selector carry-over in linkdrill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;
        listbox = selectorObject.listbox;
        radiobutton = selectorObject.radiobutton;

        //carry over total selection to target disabled show total
        await dossierPage.clickTextfieldByTitle('To UC_All By Name');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await selectorObject.dropdown.getShownSelectedText())
            .toEqual('');

        //carry over all selection to target enabled show all
        await dossierPage.goBackFromDossierLink();
        await listbox.selectNthItem(1, '(All)');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Total By ID');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is all selected should be #{expected}, instead we have #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toEqual('(All)');

        //carry over normal selection
        await dossierPage.goBackFromDossierLink();
        await listbox.selectNthItem(3, 'Business');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Total By ID');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is normal selected should be #{expected}, instead we have #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toEqual('Business');
    });

    it('[TC66644] validate multiple to multiple selector carry-over in linkdrill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;
        listbox = selectorObject.listbox;
        radiobutton = selectorObject.radiobutton;
        checkbox = selectorObject.checkbox;
        searchbox = selectorObject.searchbox;

        //carry over empty selection to target
        await toc.openPageFromTocMenu({ chapterName: 'MultipleToMultiple' });
        await dossierPage.waitForDossierLoading();
        await checkbox.clickItemByText('Art & Architecture');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To UC By Name');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await checkbox.getSelectedItemsCount())
            .toBe(0);

        //carry over multiple normal selections
        await dossierPage.goBackFromDossierLink();
        await checkbox.clickItems(['Business', 'Art & Architecture']);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All By ID');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is multiple normal selected should be #{expected}, instead we have #{actual}')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual(['Art & Architecture', 'Business']);

        //carry over all selection to target with exclude mode
        await dossierPage.goBackFromDossierLink();
        await checkbox.clickItemByText('(All)');
        await dossierPage.waitForPageLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Exclude By ID');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is all selected should be #{expected}, instead we have #{actual}')
            .expect(await checkbox.getSelectedItemsCount())
            .toBe(0);

        //carry over all+total+normal selections to target disabled all&total
        await dossierPage.goBackFromDossierLink();
        await checkbox.clickItems(['(All)', 'Total', 'Art & Architecture']);
        await dossierPage.waitForPageLoading();
        await dossierPage.clickTextfieldByTitle('To UC By Name');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is all+total+normal selections should be #{expected}, instead we have #{actual}')
            .expect(await checkbox.getSelectedItemsText())
            .toEqual(['Art & Architecture']);
    });

    it('[TC66645] validate multiple to single selector carry-over in linkdrill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;
        radiobutton = selectorObject.radiobutton;
        checkbox = selectorObject.checkbox;

        //carry over normal+total selections to single target
        await toc.openPageFromTocMenu({ chapterName: 'MultipleToSingle' });
        await dossierPage.waitForDossierLoading();
        await checkbox.clickItems(['Business', 'Total']);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Total By ID');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await radiobutton.isEmptySelector())
            .toEqual(true);

        //carry over multiple+total selections to single target
        await dossierPage.goBackFromDossierLink();
        await checkbox.clickItems(['Business', 'Action', 'Total']);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To UC_All By Name');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toEqual('');

        //carry over all selection to target enabled all
        await dossierPage.goBackFromDossierLink();
        await checkbox.clickItemByText('(All)');
        await dossierPage.waitForPageLoading();
        await dossierPage.clickTextfieldByTitle('To UC_All By Name');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toEqual('(All)');
    });

    it('[TC66646] validate not matched selector carry-over in linkdrill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;
        radiobutton = selectorObject.radiobutton;
        checkbox = selectorObject.checkbox;

        await toc.openPageFromTocMenu({ chapterName: 'NotMatched' });
        await dossierPage.waitForDossierLoading();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Cameras');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Total By Name_Not Matched');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toEqual('Total');

        await dossierPage.goBackFromDossierLink();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('(All)');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To CGB_All_Total No CarryOver');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toEqual('Art & Architecture');
    });

    it('[TC66647] validate metric slider selector carry-over in linkdrill on Library RSD', async () => {
        metricSlider = selectorObject.metricSlider;

        await toc.openPageFromTocMenu({ chapterName: 'MetricSlider' });
        await dossierPage.waitForDossierLoading();
        await metricSlider.inputToStartPoint('3400000');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To Metric Slider By ID');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await metricSlider.getStartTooltipText())
            .toEqual('$3,400,000');
    });

    it('[TC66648] validate metric qualification selector carry-over in linkdrill on Library RSD', async () => {
        metricQualification = selectorObject.metricQualification;

        await toc.openPageFromTocMenu({ chapterName: 'MetricQualification' });
        await dossierPage.waitForDossierLoading();
        await metricQualification.inputValue('2000000');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To Metric Qualification By Name');
        await dossierPage.waitForPageLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await metricQualification.getInputValue())
            .toEqual('2000000');
    });

    it('[TC66659] validate selector carry-over to dossier for linkdrill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;

        await toc.openPageFromTocMenu({ chapterName: 'LinkToDossier' });
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To Dossier_By ID');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is empty selected should be #{expected}, instead we have #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toEqual('(All)');

        await dossierPage.goBackFromDossierLink();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Cameras');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('To Dossier_By ID');
        await dossierPage.waitForDossierLoading();
        since('The carryover of selector is empty selected')
            .expect(await dropdown.getShownSelectedText())
            .toEqual('Cameras');
    });

    it('[TC79795] validate carry over attribute selector in link-drill on Library RSD', async () => {
        dropdown = selectorObject.dropdown;
        linkbar = selectorObject.linkbar;

        await toc.openPageFromTocMenu({ chapterName: 'AttributeSelector' });
        const sourceGrid = rsdGrid.getRsdGridByKey('W4334F1C0257D4766A03F38E7153383A3');
        await sourceGrid.waitForGridLoaded();

        // change attribute selector and do link drill
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Subcategory');
        await dossierPage.clickTextfieldByTitle('To Attribute Selector_ByID');

        // check target selection
        const targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(await linkbar.getSelectedItemText()).toBe('Subcategory');
    });

    it('[TC79796] validate carry over metric selector in link-drill on Library RSD', async () => {
        listbox = selectorObject.listbox;
        radiobutton = selectorObject.radiobutton;

        await toc.openPageFromTocMenu({ chapterName: 'MetricSelector' });
        const sourceGrid = rsdGrid.getRsdGridByKey('W28964029F51E4FD2AEFA7F55CE0039F0');
        await sourceGrid.waitForGridLoaded();

        // change metric selector to all and do link drill
        await listbox.selectItemByText('(All)');
        await dossierPage.clickTextfieldByTitle('To Metric Selector_By Name');

        // check target selection
        let targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(await radiobutton.getSelectedItemText()).toBe('(All)');

        // back to source and change metric selector to cost and do link drill
        await dossierPage.goBackFromDossierLink();
        await listbox.selectItemByText('Cost');
        await dossierPage.clickTextfieldByTitle('To Metric Selector_By Name');

        // check target selection
        targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(await radiobutton.getSelectedItemText()).toBe('Cost');

        // back to source and do multi selection and do link drill
        await dossierPage.goBackFromDossierLink();
        await listbox.multiSelect(['Cost', 'Revenue']);
        await dossierPage.clickTextfieldByTitle('To Metric Selector_By Name');

        // check target selection
        targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(await radiobutton.getSelectedItemText()).toBe(null);
        expect(await targetGrid.getOneRowData(1)).toEqual(['Country', 'Category', 'Subcategory', 'Cost', 'Revenue']);
    });

    it('[TC79797] validate carry over calendar selector in link-drill on Library RSD', async () => {
        calendar = selectorObject.calendar;
        checkbox = selectorObject.checkbox;

        await toc.openPageFromTocMenu({ chapterName: 'Calendar' });
        const sourceGrid = rsdGrid.getRsdGridByKey('W861B5044CB374941968DCC0A430E5FB3');
        await sourceGrid.waitForGridLoaded();

        // change calendar selector to and do link drill to target with calendar
        await calendar.openFromCalendar();
        await calendar.selectDate('2014', 'Jan', '1');
        await calendar.openToCalendar();
        await calendar.selectDate('2014', 'Jan', '7');
        await dossierPage.clickTextfieldByTitle('To Calendar selector');

        // check target selection
        let targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(getStringOfDate(await calendar.getFromDate())).toBe(getStringOfDate('1/1/2014'));
        expect(getStringOfDate(await calendar.getToDate())).toBe(getStringOfDate('01/07/2014'));

        // back to source change calendar selector to and do link drill to target with checkbox
        await dossierPage.goBackFromDossierLink();
        await calendar.openFromCalendar();
        await calendar.selectDate('2014', 'Jan', '1');
        await calendar.openToCalendar();
        await calendar.selectDate('2014', 'Jan', '5');
        await dossierPage.clickTextfieldByTitle('To Checkbox selector');

        // check target selection
        targetGrid = rsdGrid.getRsdGridByKey('K44');
        await targetGrid.waitForGridLoaded();
        expect(await checkbox.getSelectedItemsText()).toEqual([
            '1/1/2014',
            '1/2/2014',
            '1/3/2014',
            '1/4/2014',
            '1/5/2014',
        ]);
    });
});

export const config = specConfiguration;
