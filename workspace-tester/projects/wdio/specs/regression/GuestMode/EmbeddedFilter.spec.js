import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import LoginPage from '../../../pageObjects/auth/LoginPage.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const dossier = {
    id: '18EA3B7D4A68232D0903CAB881F3281C',
    name: 'Dossier level filter - multiple filters - same style',
    project,
};

const dossierEmbedded = {
    id: '9C39F5AB4DE7978C00A4F8BFCD8EB899',
    name: 'Embedded filter in different status',
    project,
};

const browserWindow = {
    browserInstance: browsers.browser1,
    width: 1200,
    height: 1200,
};
let {
    filterPanel,
    libraryPage,
    loginPage,
    attributeSlider,
    radiobuttonFilter,
    searchBoxFilter,
    checkboxFilter,
    calendarFilter,
    mqSliderFilter,
    mqFilter,
    dynamicFilter,
    grid,
    filterSummaryBar,
    toc,
    bookmark,
    dossierPage,
    commentsPage,
} = browsers.pageObj1;

describe('Dossier level filter', () => {
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierEmbedded,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC69470] Validate dossier level filter can be added and applied in embedded filter', async () => {
        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        const keepOnlyExist = await commentsPage.isCommentPresentByName('keepOnly');
        if (!keepOnlyExist) {
            await toc.openPageFromTocMenu({ chapterName: 'Checkbox1' });
            await filterPanel.openFilterPanel();
            await checkboxFilter.openSecondaryPanel('Customer');
            await checkboxFilter.keepOnly('Aadland:Warner');
            await filterPanel.apply();
            await commentsPage.openCommentsPanel();
            await commentsPage.addCommentWithEmbeddedFilter('keepOnly');
            await commentsPage.postComment();
            await dossierPage.goToLibrary();

            await resetDossierState({
                credentials: specConfiguration.credentials,
                dossier: dossier,
            });
            await libraryPage.openDossier(dossier.name);
            await commentsPage.openCommentsPanel();
        }
        // apply embedded filter
        await commentsPage.applyEmbeddedFilterByName('keepOnly');
        await since(
            'Apply embedded filter, summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aadland:Warner)');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await since('Summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aadland:Warner)');
    });

    it('[TC69660] Validate embedded filter in dynamic/unset/select all status can be applied to filter in dynamic/unset/select all status in Library', async () => {
        await libraryPage.openDossier(dossierEmbedded.name);
        await commentsPage.openCommentsPanel();
        const clearAllExist = await commentsPage.isCommentPresentByName('clearAll');
        const selectAllExist = await commentsPage.isCommentPresentByName('selectAll');
        const staticExist = await commentsPage.isCommentPresentByName('static');
        if (!clearAllExist) {
            // clear all
            await filterPanel.openFilterPanel();
            await filterPanel.clearFilter();
            await filterPanel.apply();
            await commentsPage.openCommentsPanel();
            await commentsPage.addCommentWithEmbeddedFilter('clearAll');
            await commentsPage.postComment();
        }
        if (!selectAllExist) {
            // select all
            await filterPanel.openFilterPanel();
            await checkboxFilter.openSecondaryPanel('Brand');
            await checkboxFilter.selectAll();
            await filterPanel.apply();
            await commentsPage.openCommentsPanel();
            await commentsPage.addCommentWithEmbeddedFilter('selectAll');
            await commentsPage.postComment();
        }
        if (!staticExist) {
            // static
            await filterPanel.openFilterPanel();
            await checkboxFilter.openSecondaryPanel('Brand');
            await checkboxFilter.keepOnly('Al Hirschfeld');
            await filterPanel.apply();
            await commentsPage.openCommentsPanel();
            await commentsPage.addCommentWithEmbeddedFilter('static');
            await commentsPage.postComment();
        }

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierEmbedded,
        });
        await dossierPage.reload();

        // apply dynamic filter to dynamic filter
        await commentsPage.openCommentsPanel();
        await commentsPage.applyEmbeddedFilterByName('static');
        await filterPanel.openFilterPanel();
        await since(
            'Apply dynamic filter to dynamic filter, Filter selection info for Brand is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Brand'))
            .toBe('(1/275)');

        // apply select all to dynamic filter
        await checkboxFilter.openContextMenu('Brand');
        await checkboxFilter.selectContextMenuOption('Brand', 'Reset');
        await filterPanel.apply();
        await commentsPage.openCommentsPanel();
        await commentsPage.applyEmbeddedFilterByName('selectAll');
        await filterPanel.openFilterPanel();
        await since(
            'Apply select all to dynamic filter, Filter selection info for Brand is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Brand'))
            .toBe('(275/275)');

        // apply dynamic to select all
        await commentsPage.openCommentsPanel();
        await commentsPage.applyEmbeddedFilterByName('static');
        await filterPanel.openFilterPanel();
        await since(
            'Apply dynamic filter to select all, Filter selection info for Brand is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Brand'))
            .toBe('(1/275)');

        // apply unset to dynamic filter
        await checkboxFilter.openContextMenu('Brand');
        await checkboxFilter.selectContextMenuOption('Brand', 'Reset');
        await filterPanel.apply();
        await commentsPage.openCommentsPanel();
        await commentsPage.applyEmbeddedFilterByName('clearAll');
        await filterPanel.openFilterPanel();
        await since(
            'Apply unset to dynamic filter, the summary in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');

        // apply dynamic filter to unset
        await commentsPage.openCommentsPanel();
        await commentsPage.applyEmbeddedFilterByName('static');
        await filterPanel.openFilterPanel();
        await since(
            'Apply dynamic filter to select all, Filter selection info for Brand is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Brand'))
            .toBe('(1/275)');
    });
});

export const config = specConfiguration;
