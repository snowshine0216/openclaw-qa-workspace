import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { getStringOfDate, addMonthsAndDays, getToday,addDays } from '../../../utils/DateUtil.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_sp') };

describe('SelectorPanel', () => {
    const dossier = {
        id: '78282F934FD3342DA1F060A214306EC0',
        name: '(AUTO) SelectorPanel',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryPage, toc, dossierPage, libraryAuthoringPage, grid, loginPage, contentsPanel, selectorPanel, selector } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC68670_01] Verify attribute selector in selector panel with different styles', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Stand-Alone', pageName: 'Attribute' });
        const yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        const monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        const quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');
        const categoryICS = selectorPanel.getInCanvasSelectorByAriaLabel('Category');
        const dayICS = selectorPanel.getInCanvasSelectorByAriaLabel('From');
        const subcategoryICS = selectorPanel.getInCanvasSelectorByAriaLabel('Subcategory');

        // do changes for checkbox selector
        await yearICS.openAndSelectContextMenu('Reset');
        await selectorPanel.applySelection();

        await yearICS.selectItem('2014');
        await takeScreenshotByElement(selectorPanel.getButtonByName('Apply'), 'TC68670_01', 'SelectorPanel_ApplyButton');
        await takeScreenshotByElement(selectorPanel.getButtonByName('Cancel'), 'TC68670_01', 'SelectorPanel_CancelButton');
        await selectorPanel.cancelSelection();
        await yearICS.selectItem('2015');
        await selectorPanel.applySelection();
        since('current selections for year selector should be #{expected}, instead we have #{actual}')
            .expect(await yearICS.getSelectedItemsText())
            .toEqual(['2016']);

        // do changes for searchbox selector
        await monthICS.searchSearchbox('2016');
        await monthICS.selectSearchBoxItems(['Jan 2016', 'Feb 2016'], false);
        await monthICS.openAndSelectContextMenu('Exclude');
        await monthICS.openAndSelectContextMenu('Unset Filter');
        await selectorPanel.applySelection();
        since('current selections should be #{expected}, instead we have #{actual}')
            .expect(await monthICS.getSelectedItemsText())
            .toEqual([]);
        await monthICS.searchSearchbox('2016');
        await monthICS.selectSearchBoxItemsForPreload({ items: ['Jan 2016', 'Feb 2016'], isPreloaded: false, isSingleSelection: false });
        await selectorPanel.applySelection();
        since('Grid data after changing searchbox selector should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2016', 'Mar 2016', '2016 Q1', '3/1/2016 12:00:00 AM', 'Books', 'Literature', '$98', '$342', '$440']);
        await monthICS.deleteSearchboxItems(['Jan 2016']);
        await monthICS.openAndSelectContextMenu('Include');
        await selectorPanel.applySelection();
        since('current selections for month selector should be #{expected}, instead we have #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Feb 2016']);

        // do changes for dropdown selector
        await quarterICS.openAndSelectContextMenu('Exclude');
        await selectorPanel.cancelSelection();
        await quarterICS.openAndSelectContextMenu('Exclude');
        await selectorPanel.cancelSelection();
        since ('current selections for quarter selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('(All)');
        
        // do changes for radio button selector
        await categoryICS.openAndSelectContextMenu('Exclude');
        await categoryICS.openAndSelectContextMenu('Unset Filter');
        await categoryICS.openAndSelectContextMenu('Include');
        await selectorPanel.applySelection();
        since('current selections for category selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.radiobutton.isItemSelectedByText('(All)'))
            .toBe(true);

        // do changes for calendar selector
        await selector.calendar.openToCalendar();
        await selector.calendar.clickDynamicDateCheckBox();
        await selector.calendar.selectDynamicDayDropdownItem(1, 'plus'); // dynamic day +2
        await selector.calendar.clickDynamicDayStepperNext(2);
        // await selector.calendar.selectDynamicMonthDropdownItem(2, 'minus'); // dynamic month -(+2-1)=-1
        // await selector.calendar.clickDynamicMonthStepperNext(2);
        // await selector.calendar.clickDynamicMonthStepperPrev(1);
        await selector.calendar.clickDynamicCalendarButton('OK');
        const expectedDate = getStringOfDate(addDays(2, getToday())); // today +2 days
        await selectorPanel.applySelection();
        await since('Select dynamic date: To date should be #{expected}, while we get #{actual} ')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(expectedDate);
        await dayICS.openAndSelectContextMenu('Unset Filter');
        await selectorPanel.applySelection();
        since('current to selections for day selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.calendar.getToDate())
            .toEqual('12/31/2016 11:59:59 PM');
        since('current from selections for day selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.calendar.getFromDate())
            .toEqual('1/1/2014 12:00:00 AM');
        await selector.calendar.openToCalendar();
        since('Select dynamic date: To date should be #{expected}, while we get #{actual} ')
            .expect(await selector.calendar.isDynamicDateChecked())
            .toBe(false);
        await selector.calendar.clickOkButton();

        // do changes for listbox dynamic selector
        await selector.listbox.selectItemByText('Business', false);
        await subcategoryICS.openAndSelectContextMenu('Reset to First 2');
        await selectorPanel.cancelSelection();
        since ('current selections for subcategory selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.listbox.getSelectedItemText())
            .toEqual(['Literature']);
        await selector.listbox.selectItemByText('Business', false);
        await subcategoryICS.openAndSelectContextMenu('Reset to First 2');
        await selectorPanel.applySelection();
        since ('current selections for subcategory selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.listbox.getSelectedItemText())
            .toEqual(['Art & Architecture', 'Business']);
        since('Grid data after changing subcategory selector should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2016', 'Feb 2016', '2016 Q1', '2/1/2016 12:00:00 AM', 'Books', 'Art & Architecture', '$99', '$302', '$401']);

    });

    it('[TC68670_02] Verify value selector in selector panel with different styles', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Stand-Alone', pageName: 'Value' });
    
        // do changes for slider selector
        await dossierPage.clickTextfieldByTitle('Selector Window for metric selector');
        const costICS = selectorPanel.getInCanvasSelectorByAriaLabel('Cost');
        const profitICS = selectorPanel.getInCanvasSelectorByAriaLabel('Profit');
        await selector.metricSlider.dragSlider({ x: 150, y: 0 }, 'top', false); // drag to 13%
        await costICS.openAndSelectContextMenu('Exclude');
        await costICS.openAndSelectContextMenu('Unset Filter');
        await takeScreenshotByElement(selectorPanel.getButtonByName('Apply'), 'TC68670_02', 'SelectorPanel_ApplyButton');
        await takeScreenshotByElement(selectorPanel.getButtonByName('Cancel'), 'TC68670_02', 'SelectorPanel_CancelButton');
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector Window for metric selector');
        await since('Exclude mode: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderLabel())
            .toBe('All');
        await selector.metricSlider.dragSlider({ x: 150, y: 0 }, 'top', false); // drag to 13%
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector Window for metric selector');
        await since('Include mode: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderLabel())
            .toBe('< $5.2K');
        
        // do changes for qualification selector
        await selector.metricQualification.selectDropdownOperation('Does not equal');
        await selector.metricQualification.inputValueWithoutApply('45');
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector Window for metric selector');
        since('current pattern for metric qualification should be #{expected}, instead we have #{actual}')
            .expect(await selector.metricQualification.getMQExpression())
            .toBe('Does not equal 45');
        await profitICS.openAndSelectContextMenu('Unset Filter');
        await selectorPanel.applySelection();

        since('Grid data after changing metric qualification selector should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014', 'Jan 2014', '2014 Q1', '1/1/2014 12:00:00 AM', 'Books', 'Art & Architecture', '$56', '$165', '$221']);
    });

    it('[TC68670_03] x-func for selector panel', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->B' });

        // DE334028 && DE334026
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        await yearICS.openAndSelectContextMenu('Unset Filter');
        await selectorPanel.applySelection();
        await selector.checkbox.selectItemByText('(All)');
        await selectorPanel.applySelection();
        await selector.checkbox.selectItemByText('2014');
        await selectorPanel.cancelSelection();
        since('current selections for year selector should be #{expected}, instead we have #{actual}')
            .expect(await yearICS.getSelectedItemsText())
            .toEqual([]);
        await selector.checkbox.selectItemByText('2014');
        await selectorPanel.applySelection();
        since('current selections for year selector should be #{expected}, instead we have #{actual}')
            .expect(await yearICS.getSelectedItemsText())
            .toEqual(['2014']);

        // DE334017
        await selector.checkbox.selectItemByText('2015');
        await selectorPanel.cancelSelection();
        await yearICS.openAndSelectContextMenu('Exclude');
        await selectorPanel.applySelection();
        since('current selection mode for year selector should be #{expected}, instead we have #{actual}')
            .expect(await selector.checkbox.getItemMode('2014'))
            .toBe('exclude');

        // check apply button with inline error
       await toc.openPageFromTocMenu({ chapterName: 'Stand-Alone', pageName: 'Attribute' });
       yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
       await yearICS.selectItems(['2015', '2016']);
       since ('After empty selection, the warning message in category searchbox should be #{expected}, while we get #{actual}')
            .expect(await yearICS.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
       since('Apply button should be disabled when there is inline error should be #{expected}, while we get #{actual}')
           .expect(await selectorPanel.isApplyButtonDisabled()).toBe(true);

       await selector.radiobutton.selectItemByText('Music', false);
       const yearICS2 = InCanvasSelector.createByAriaLable('Year', 1);
       await yearICS2.selectItems(['2015', '2016']);
        since ('After empty selection, the warning message in category searchbox should be #{expected}, while we get #{actual}')
            .expect(await yearICS.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
       since('Apply button should be disabled when there is inline error should be #{expected}, while we get #{actual}')
           .expect(await selectorPanel.isApplyButtonDisabled()).toBe(true);
       
       // apply button tooltip
       await libraryAuthoringPage.editDossierFromLibrary();
       since('Apply button tooltip should be #{expected}, while we get #{actual}')
           .expect(await selectorPanel.getApplyButtonTooltip())
           .toBe("The Apply button is disabled in authoring mode. In consumption mode, click 'Apply' to confirm filter and selector choices.");
       await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();

    });

    it('[TC68670_04] GDDE selector panel (A->B)', async () => {
        // A->B
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->B' });
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        await yearICS.openAndSelectContextMenu('Exclude');
        await selectorPanel.applySelection();
        await yearICS.openAndSelectContextMenu('Unset Filter');
        since('apply button should be enabled after unset filter should be #{expected}, while we get #{actual}')
            .expect(await selectorPanel.isApplyButtonDisabled())
            .toBe(false);
        await yearICS.selectItems(['2015', '2016']);
        await selectorPanel.applySelection();
        since('current selection for target month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedDrodownItem())
            .toBe('Jan 2014');
        await monthICS.openDropdownMenu();
        since('current target month selector list item count should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getDropdownItemsCount())
            .toBe(13);
        await monthICS.closeDropdownMenu();
        await yearICS.selectItems(['2014']);
        await selectorPanel.applySelection();
        since('current selection for target month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedDrodownItem())
            .toBe('(All)');
        await monthICS.openDropdownMenu();
        since('current target month selector list item count should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getDropdownItemsCount())
            .toBe(1);
        await monthICS.closeDropdownMenu();

    });


    it('[TC68670_05] GDDE selector panel (A->B->C)', async () => {

        //A->B->C
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->B->C' });
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        let quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');

        await quarterICS.selectItems(['2014 Q1']);
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Jan 2014']);
        await selectorPanel.cancelSelection();
        await yearICS.selectItems(['2014', '2015']);
        since(' quarter element list should be #{expected}, while we get #{actual}')
            .expect(await quarterICS.getItemsText())
            .toEqual([ '2015 Q1', '2015 Q2', '2015 Q3', '2015 Q4']);
        await quarterICS.selectItems(['2015 Q1']);
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Jan 2015']);
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Jan 2015']);
        await quarterICS.openAndSelectContextMenu('Unset Filter');
        await yearICS.selectItems(['2015', '2016']);
        since(' quarter element list should be #{expected}, while we get #{actual}')
            .expect(await quarterICS.getItemsText())
            .toEqual([ '2016 Q1', '2016 Q2', '2016 Q3', '2016 Q4']);
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Jan 2016']);
        await monthICS.searchSearchbox('2014');
        await monthICS.selectSearchBoxItemsForPreload({ items: ['Jan 2014'], isPreloaded: false, isSingleSelection: false });
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Jan 2016', 'Jan 2014']);
        await monthICS.openAndSelectContextMenu('Reset to First 1');
        await yearICS.selectItems(['2016']);
        since('After empty selection, the warning message in month searchbox should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSearchBoxMandatoryWarningMessageText())
            .toEqual('Make at least one selection.');
        await yearICS.selectItems(['2014']);
        await selectorPanel.applySelection();
        since('grid data after changing year and quarter selector should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014', 'Jan 2014', '2014 Q1','$413,050', '$89,174']);
    });

    it('[TC68670_06] GDDE selector panel (A->B->C + A->C)', async () => {
        // A->B->C + A->C
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->B->C + A->C' });
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');
        let monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        await yearICS.openAndSelectContextMenu('Unset Filter');
        since('quarter selector element list should be #{expected}, while we get #{actual}')
            .expect(await quarterICS.getItemsNumber())
            .toEqual(13);
        since('month selector element list should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getItemsNumber())
            .toEqual(6);
        since('current selections for target month selector should be #{expected}, instead we have #{actual}')
            .expect(await monthICS.getSelectedItemsText())
            .toEqual(['Oct 2014']);
        await yearICS.selectItems(['2014']);
        await selectorPanel.applySelection();
        since('quarter selector element list should be #{expected}, while we get #{actual}')
            .expect(await quarterICS.getItemsNumber())
            .toEqual(9);
        since('month selector element list should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getItemsNumber())
            .toEqual(3);
        since('current selections for target month selector should be #{expected}, instead we have #{actual}')
            .expect(await monthICS.getSelectedItemsText())
            .toEqual(['Jan 2016']);
        await quarterICS.openAndSelectContextMenu('Exclude');
        await quarterICS.openAndSelectContextMenu('Unset Filter');
        await selectorPanel.applySelection();
        await monthICS.selectItems(['Jul 2015']);
        await yearICS.selectItems(['2015']);
        since('After empty selection, the warning message in month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getMandatoryWarningMessageText())
            .toEqual('Make at least one selection.');
        await monthICS.openAndSelectContextMenu('Reset to First 1');
        await selectorPanel.applySelection();
        since('grid data after changing year and quarter selector should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2016', 'Jan 2016', '2016 Q1','$811,644', '$173,463']);
    });

     it('[TC68670_07] GDDE selector panel (A->C + B->C)', async () => {

        //A->C + B->C
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->C + B->C' });
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        let quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');

        await monthICS.searchSearchbox('*');
        since ('month selector element list should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSearchSuggestItemsCount())
            .toEqual(4);
        await yearICS.selectItems(['2015']);
        await monthICS.searchSearchbox('*');
        since ('month selector element list should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSearchSuggestItemsCount())
            .toEqual(4);
        await quarterICS.selectItems(['2014 Q1']);
        await monthICS.searchSearchbox('*');
        since ('month selector element list should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSearchSuggestItemsCount())
            .toEqual(7);
        await monthICS.selectSearchBoxItemsForPreload({ items: ['Feb 2014'], isPreloaded: false, isSingleSelection: false });
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual(['Feb 2014']);
        await yearICS.openAndSelectContextMenu('Exclude');
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(true))
            .toEqual([]);
        await selectorPanel.applySelection();
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        await monthICS.searchSearchbox('2016');
        await monthICS.selectSearchBoxItemsForPreload({ items: ['Jan 2016'], isPreloaded: false, isSingleSelection: false });
        await monthICS.openAndSelectContextMenu('Exclude');
        await selectorPanel.cancelSelection();
        await monthICS.openAndSelectContextMenu('Exclude');
        await monthICS.searchSearchbox('2016');
        await monthICS.selectSearchBoxItemsForPreload({ items: ['Jan 2016'], isPreloaded: false, isSingleSelection: false });
        await selectorPanel.applySelection();
        since('grid data after changing year and quarter selector should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2016', 'Feb 2016', '2016 Q1','$835,734', '$178,894']);

    });

    it('[TC68670_08] GDDE selector panel (A->B + A->C)', async () => {
        // A->B + A->C
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A->B + A->C' });
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');
        let monthICS = selectorPanel.getInCanvasSelectorByAriaLabel('Month');
        
        await yearICS.openAndSelectContextMenu('Exclude');
        since('after empty selection, the warning message in year selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getMandatoryWarningMessageText())
            .toEqual('Make at least one selection.');
        since('current element list for quarter selector should be #{expected}, while we get #{actual}')
            .expect(await quarterICS.getItemsText())
            .toEqual(['(All)', '2015 Q1', '2015 Q2', '2015 Q3', '2015 Q4']);
        await monthICS.selectItems(['Mar 2015']);
        await quarterICS.selectItems(['2015 Q2']);
        since('current selection for target Month selector should be #{expected}, while we get #{actual}')
            .expect(await monthICS.getSelectedItemsText(false))
            .toEqual(['Mar 2015']);
        await selectorPanel.cancelSelection();
        await yearICS.openAndSelectContextMenu('Unset Filter');
        await yearICS.selectItems(['2014']);
        await quarterICS.selectItems(['2015 Q1']);
        await monthICS.openAndSelectContextMenu('Reset to First 1');
        await selectorPanel.applySelection();
        since('grid data after changing year and quarter selector should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2015', 'Jan 2015', '2015 Q1','$617,011', '$132,768']);

    });

    it('[TC68670_09] GDDE selector panel (A<->B)', async () => {

        //A<->B 
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'A<->B' });
        await dossierPage.clickTextfieldByTitle('Selector info-window for searchbox');
        let yearICS = selectorPanel.getInCanvasSelectorByAriaLabel('Year');
        let quarterICS = selectorPanel.getInCanvasSelectorByAriaLabel('Quarter');

        await yearICS.selectItems(['2014']);
        await quarterICS.openAndSelectContextMenu('Reset to First 2');
        since('apply button should be enabled after changing dependent selector should be #{expected}, while we get #{actual}')
            .expect(await selectorPanel.isApplyButtonDisabled())
            .toEqual(false);
        await selectorPanel.applySelection();
        since('grid data after changing year and quarter selector should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014', 'Jan 2014', '2014 Q1','$413,050', '$89,174']);

    });

});

export const config = specConfiguration;
