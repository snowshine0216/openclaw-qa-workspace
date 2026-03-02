import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const dossier = {
    id: '686D500444785EE2FC0ABCAD06AA70BF',
    name: '(Auto) Mandatory Filter_XFunc',
    project,
};

const browserWindow = {
    width: 1200,
    height: 1200,
};

describe('Mandatory Filter - XFunc', () => {
    let { loginPage, filterPanel, libraryPage, searchBoxFilter, checkboxFilter, filterSummaryBar, toc, dossierPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97406_01] Validate x-func for mandatory filter - Global Filter', async () => {
        // check Reset All Filters when all the filters set to disable clearing
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('ContextMenuDots Present for day is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Day'))
            .toBe(false);
        await since('ContextMenuDots Present for quarter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Quarter'))
            .toBe(false);
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Day'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Global Filter', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'For global filter, Warning message shows for category should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isWarningMessagePresent('Day'))
            .toBe(true);

        await checkboxFilter.openSecondaryPanel('Day');
        await checkboxFilter.selectElementByName('4/10/2014');
        await filterPanel.apply();

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Day');
        await since(
            'Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        //grey out select all button
        await since(
            'Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
    });

    it('[TC97406_02] Validate x-func for mandatory filter - Lock Filter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Lock Filter', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Category Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Category'))
            .toBe(true);
        await since('Subcategory Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Subcategory'))
            .toBe(true);
        //  no warning message when no selection
        await since('Warning message shows for Category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Category'))
            .toBe(false);
        await checkboxFilter.openSecondaryPanel('Category');
        await since('Reset button for Category is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await filterPanel.clearAllFilters();
        await filterPanel.apply();

        // not reset to dynamic when apply
        await since('Filter summaty is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Subcategory(Art & Architecture)');
        await filterPanel.openFilterPanel();
        await since('Category Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Category'))
            .toBe(true);
        await since('Subcategory Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Subcategory'))
            .toBe(true);
    });

    it('[TC97406_03] Validate x-func for mandatory filter - Custom Group and Consolidation', async () => {
        // check warning message when when uncheck last selection
        await toc.openPageFromTocMenu({ chapterName: 'Custom Group and Consolidation', pageName: 'Page 1' });
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
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Season', capsuleName: 'Spring' });
        await since(
            'For consolidation, Warning message shows is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Season'))
            .toBe(true);
        await filterPanel.resetAllFilters();
        await filterPanel.apply();
        await since('Filter summaty is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Age Groups(< 25)Season(Winter, Spring)');

        // check warning message when initial rendering
        await toc.openPageFromTocMenu({
            chapterName: 'Custom Group and Consolidation - clear all',
            pageName: 'Page 1',
        });
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
