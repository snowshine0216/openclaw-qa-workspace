import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - Pass Filter', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const passFilterDossier = {
        id: 'C1177BD84848BAC761C02583D0DE40A0',
        name: '(AUTO) DossierLinking_Pass Filter',
        project: tutorialProject,
    };
    const passFilterOnText = {
        id: 'E2673EFE44F4E85E694F8C8B17CB345F',
        name: '(AUTO) DossierLinking_Pass Filter_Text/Image',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, filterSummary, textbox, imageContainer, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC58907] Verify different filters can be passed to target dossier - Grid/Viz', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passFilterDossier,
        });
        await libraryPage.openDossier(passFilterDossier.name);

        //pass single filter
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass single filter, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.goBackFromDossierLink();

        //pass multiple filters
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: multi filters' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass multiple filters, passed filter [Category] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await since('Pass multiple filters, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.goBackFromDossierLink();

        // pass filter with exclude mode
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: exclude' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass filter exclude mode, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(exclude 2015)');
        await dossierPage.goBackFromDossierLink();

        // pass filter with multiple attribute forms
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: attribute form' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass filter with multiple attribute forms, passed filter [Category] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(exclude Books)');
        await since('Pass filter with multiple attribute forms, passed filter [Region] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        await since('Pass filter with multiple attribute forms, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2015 - 2016)');
        await dossierPage.goBackFromDossierLink();

        // pass filter in unset state
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: unset' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            "Pass filter with unset state, filter should be passed as 'select all' instead of 'select none', and filter count should be #{expected},while we got #{actural}"
        )
            .expect(await filterSummary.filterCount())
            .toBe('0');
        await dossierPage.goBackFromDossierLink();

        // NOT pass filter
        await toc.openPageFromTocMenu({ chapterName: 'NOT pass filter' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Not pass filter, target dossier filter should keep original ones and filter value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014)');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC66263] Verify different filters can be passed to target dossier - Text/Image', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passFilterOnText,
        });
        await libraryPage.openDossier(passFilterOnText.name);

        //pass single filter
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await textbox.navigateLink(0);
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass single filter, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.goBackFromDossierLink();

        //pass multiple filters
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: multi filters' });
        await textbox.navigateLink(0);
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass multiple filters, passed filter [Category] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await since('Pass multiple filters, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.goBackFromDossierLink();

        // pass filter with exclude mode
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: exclude' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass filter exclude mode, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(exclude 2015)');
        await dossierPage.goBackFromDossierLink();

        // pass filter with multiple attribute forms
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: attribute form' });
        await textbox.navigateLink(0);
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass filter with multiple attribute forms, passed filter [Category] and value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(exclude Books)');
        await since('Pass filter with multiple attribute forms, passed filter [Region] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        await since('Pass filter with multiple attribute forms, passed filter [Year] and value should be #{expected}')
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2015 - 2016)');
        await dossierPage.goBackFromDossierLink();

        // pass filter in unset state
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: unset' });
        await imageContainer.navigateLinkInCurrentPage(0);
        // await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            "Pass filter with unset state, filter should be passed as 'select all' instead of 'select none', and filter count should be #{expected},while we got #{actural}"
        )
            .expect(await filterSummary.filterCount())
            .toBe('0');
        await dossierPage.goBackFromDossierLink();

        // NOT pass filter
        await toc.openPageFromTocMenu({ chapterName: 'NOT pass filter' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Not pass filter, target dossier filter should keep original ones and filter value should be #{expected}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014)');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC67279] Verify different filters can be passed to itself ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passFilterOnText,
        });
        await libraryPage.openDossier(passFilterOnText.name);

        // pass filter to itself from Text/Image
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await textbox.navigateLink(1);
        await since('Link to itself, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass filter to itself from textbox, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014 - 2015)');
        await dossierPage.goBackFromDossierLink();

        // pass filter to itself from Grid/Viz
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking to itself', headerName: 'Category' });
        await since('Link to iteslf, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass filter to itself from grid, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014 - 2015)');
        await dossierPage.goBackFromDossierLink();
    });
});
export const config = specConfiguration;
