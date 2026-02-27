import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const dossier = {
    id: '66D19773420066D1E8B006ADD579D457',
    name: 'FirstN/LastN-DisableClearing-XFunc',
    project,
};

const customGroupDossier = {
    id: '57E3D1D94E034D85F0B56983E44C2A60',
    name: 'FirstN/LastN-DisableClearing-Custom groups, consolidations',
    project,
};

const browserWindow = {
    
    width: 1200,
    height: 1200,
};

describe('FirstNLastN-DisableClearing-XFunc', () => {
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

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85168_01] Validate x-func for prevent consumers from clearing (unsetting) filters - Global Filter - Reset', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check Reset All Filters when all the filters set to disable clearing
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await since(
            'Default summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await filterPanel.openFilterPanel();
        await since('ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Category'))
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'Global Filter', pageName: 'Page 1' });
        await since(
            'For global filter, Default summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await filterPanel.openFilterPanel();
        await since(
            'For global filter, ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Category'))
            .toBe(false);
        await since(
            'The Filter is in dynamic status, Reset All Filters button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Category');
        await since(
            'Reset button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(true);
        await since(
            'Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        //grey out select all button
        await since(
            'Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
    });

    it('[TC85168_02] Validate x-func for prevent consumers from clearing (unsetting) filters - Global Filter - reset to dynamic', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        await toc.openPageFromTocMenu({ chapterName: 'Global Filter - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2015');
        await since('filter selection for Quarter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(First 2)');
    });

    it('[TC85377_01] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - reset', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // mixed lock filter and non lock filter
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Reset All Filters button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);
        await since('Subcategory Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Subcategory'))
            .toBe(true);
        await radiobuttonFilter.openSecondaryPanel('Subcategory');
        await since(
            'Reset button in dynamic on status present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.fElement.selectAll();
        await filterPanel.resetAllFilters();
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(First 2)');
        await since('After reset, Subcategory selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');

        // lock filter only
        await toc.openPageFromTocMenu({ chapterName: 'Lock Filter only', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Reset All Filters button Disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);
        await since('Subcategory Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Subcategory'))
            .toBe(true);
        await radiobuttonFilter.openSecondaryPanel('Subcategory');
        await since(
            'Reset button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(true);
        await since(
            'Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
    });

    it('[TC85377_02] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - no warning message when no selection', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check warning message when all the filters set to disable clearing
        await toc.openPageFromTocMenu({ chapterName: 'Lock Filter - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'For Lock filter, Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Year'))
            .toBe(false);
        await since(
            'For Lock filter, Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(false);
    });

    it('[TC85377_03] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - not reset to dynamic when apply', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Global Filter - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Month');
        await checkboxFilter.selectContextMenuOption('Month', 'Reset');
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Music');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        // For lock filter, apply will not reset the filter when there is no selection
        await since('filter selection for Quarter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('');
        await since(
            'For Lock filter, Warning message shows for Quarter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(false);
        await since('filter selection for Quarter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('Month'))
            .toBe('(First 5)');
        await since(
            'For Lock filter, Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Month'))
            .toBe(false);
    });

    it('[TC87656] Validate x-func for prevent consumers from clearing (unsetting) filters - Custom Group and Consolidation', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: customGroupDossier,
        });
        await libraryPage.openDossier(customGroupDossier.name);

        // check warning message when when uncheck last selection
        await toc.openPageFromTocMenu({ chapterName: 'dynamic', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu arrow
        await since('Context Menu Arrow Age Groups Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Age Groups'))
            .toBe(false);
        await since('Context Menu Arrow Season Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Season'))
            .toBe(false);

        // check reset all filters button
        await since('Reset All Filters button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);

        await searchBoxFilter.removeCapsuleByName({ filterName: 'Age Groups', capsuleName: '< 25' });
        await since(
            'For custom groups, Warning message shows for Age Groups is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Age Groups'))
            .toBe(true);
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Season', capsuleName: 'Winter' });
        await since(
            'For consolidation, Warning message shows for Season is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Season'))
            .toBe(true);
        await filterPanel.resetAllFilters();
        await since('Selection info for Age Groups filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Age Groups'))
            .toBe('(First 1)');
        await since('Selection info for Season filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Season'))
            .toBe('(First 1)');

        // check warning message when initial rendering
        await toc.openPageFromTocMenu({ chapterName: 'clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'Initial rendering, For custom groups, Warning message shows for Age Groups is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Age Groups'))
            .toBe(true);
        await since(
            'Initial rendering, For consolidation, Warning message shows for Season is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Season'))
            .toBe(true);
    });
});

export const config = specConfiguration;
