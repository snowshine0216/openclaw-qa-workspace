import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_filter') };

describe('Lock Filter', () => {
    const dossier = {
        id: '2CB86C48473919E838E327AB51C9C9BF',
        name: '(AUTO) Lock Filter - XFunc',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        
        width: 1200,
        height: 1200,
    };

    let {
        loginPage,
        filterPanel,
        libraryPage,
        checkboxFilter,
        searchBoxFilter,
        radiobuttonFilter,
        bookmark,
        filterSummary,
        grid,
        userAccount,
        toc,
        dossierPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC83167] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - Bookmark', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(false);
        await since('Selected elements of Year filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Year'))
            .toBe('(1/3)');
        await since('Selected elements of Quarter filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Quarter'))
            .toBe('(1 selected)');

        // apply bookmark
        await bookmark.openPanel();
        await bookmark.applyBookmark('year2014&2015');
        await dossierPage.waitForPageLoading();
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(false);
        await since('Selected elements of Year filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Year'))
            .toBe('(2/3)');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await searchBoxFilter.search('Q1');
        await searchBoxFilter.selectAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Selected elements of Quarter filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Quarter'))
            .toBe('(2 selected)');
        await dossierPage.goToLibrary();
        await bookmark.ignoreSaveReminder();
    });

    it('[TC83165] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - GDDE', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        // lock target unlock
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC83165_GDDE',
            'Chapter1 Lock target Unlock'
        );
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(false);
        // modify unlock filter Quarter
        await checkboxFilter.openSecondaryPanel('Quarter');
        await searchBoxFilter.search('2014');
        await searchBoxFilter.selectAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Selected elements of Quarter filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Quarter'))
            .toBe('(4 selected)');

        // Unlock target lock
        //await toc.openMenu();
        //await toc.goToPage({chapterName:'Chapter 2',pageName:'Unlock target lock'});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC83165_GDDE',
            'Chapter2 Unlock target lock'
        );
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(false);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);
        // modify unlock filter Year
        await checkboxFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.selectElementByName('2015');
        await filterPanel.applyAndReopenPanel();
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);

        // lock target lock
        //await toc.openMenu();
        //await toc.goToPage({chapterName:'Chapter 3',pageName:'Lock target Lock'});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC83165_GDDE',
            'Chapter3 Lock target Lock'
        );
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);
    });

    it('[TC83166] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - Dossier Linking', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // Source - Year(lock), Quarter(unlock), target - Year(unlock), Quarter(unlock), pass filter - No, open new tab - No
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Year' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(false);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // Source - Year(unlock), Quarter(lock), target - Year(lock), Quarter(unlock), pass filter - Yes, open new tab - No
        // await toc.openMenu();
        // await toc.goToPage({chapterName:'Chapter 2',pageName:'Unlock target lock'});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Year' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(false);
        await since('Pass filter, filter Year is passed and value should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2016)');
        await since('Pass filter, filter Quarter is passed and value should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Quarter'))
            .toBe('(2016 Q2)');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2016 Q4');
        await filterPanel.apply();
        await since('Filter Quarter value changed and value should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Quarter'))
            .toBe('(2016 Q2, 2016 Q4)');
        await dossierPage.goBackFromDossierLink();
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(false);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);

        // Source - Year(lock), Quarter(lock), target - Year(lock), Quarter(lock), pass filter - Yes, open new tab - Yes
        // await toc.openMenu();
        // await toc.goToPage({chapterName:'Chapter 3',pageName:'Lock target Lock'});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        await dossierPage.sleep(3000);
        // check filter passed and target dossier filter locked
        await filterPanel.openFilterPanel();
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);
        await since('Filter_Category Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Category'))
            .toBe(true);
        await since('Pass filter, filter Year is passed and value should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014)');
        await since('Pass filter, filter Quarter is passed and value should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Quarter'))
            .toBe('(2014 Q2)');
        await checkboxFilter.openSecondaryPanel('Year');
        await since('Filter_Year Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Year'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Quarter');
        await since('Filter_Quarter Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Quarter'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Category');
        await since('Filter_Year Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Category'))
            .toBe(true);
        await dossierPage.closeTab(1);
    });
});
export const config = specConfiguration;
