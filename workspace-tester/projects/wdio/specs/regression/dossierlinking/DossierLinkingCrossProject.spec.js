import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';


const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - CrossProject', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const sharedEnvProject = {
        id: '50DBC23A45219CFBFAD623A01E53EC74',
        name: 'MicroStrategy Tutorial Shared Env',
    };

    const sourceDossier = {
        id: 'FF7984274A528556B8D864AC4B2D40C3',
        name: 'DossierLinking_CrossProject_Source',
        project: tutorialProject,
    };

    const target_NotInLib = {
        id: '85D88474444612ACD72C9F9AB7F376E9',
        name: 'DossierLinking_CrossProject_Target2_NotInLibrary',
        project: sharedEnvProject,
    };
    
    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, promptEditor, bookmark, imageContainer, loginPage, mqSliderFilter, filterPanel, checkboxFilter } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceDossier,
        });
        await libraryPage.openDossier(sourceDossier.name);
        await dossierPage.waitForDossierLoading();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97336_01] Verify cross project dossier linking ', async () => {
        //pass filter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'PassFilter' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2016');
        await mqSliderFilter.updateSliderInput('Profit', '1300000', '1500000');
        await filterPanel.apply();
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.switchToTab(1);
        await filterPanel.openFilterPanel();
        since('link to target and open in new window, target MQ slider filter value should be #{expected}, instead we have #{actual}')
            .expect(await mqSliderFilter.lowerInput('Profit'))
            .toBe('1304141');
        since('link to target and open in new window, target MQ slider filter value should be #{expected}, instead we have #{actual}')
            .expect(await mqSliderFilter.upperInput('Profit'))
            .toBe('1500000');
        since('link to target and open in new window, target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014', '$1,304,141']);
        since('link to target and open in new window, target grid count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);
        await dossierPage.closeTab(1);
        
    });

    it('[TC97336_02] Verify cross project dossier linking ', async () => {
        //pass ics
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'PassIncanvasSelector' });
        const regionICS = InCanvasSelector.createByTitle('Region');
        await regionICS.multiSelect(['Northeast']);
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.switchToTab(1);
        since('link to target and open in new window, target ICS value should be #{expected}, instead we have #{actual}')
            .expect(await regionICS.getSelectedItemsText())
            .toEqual(['Northwest', 'South', 'Southeast']);
        since('link to target and open in new window, target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneColumnData('Visualization 1', 'Region'))
            .toEqual(['Northwest', 'South', 'Southeast']);
        since('link to target and open in new window, target grid count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
        await dossierPage.closeTab(1);
        
    });

    it('[TC97336_03] Verify cross project dossier linking ', async () => {
        //pass selection as view filter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'PassSelectionAsViewFilter' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Region',
            elementName: 'South',
        });
        await dossierPage.switchToTab(1);
        since('link to target and open in new window, target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneColumnData('Visualization 1', 'Region'))
            .toEqual(['South']);
        since('link to target and open in new window, target grid count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);
        await dossierPage.closeTab(1);
        
    });

    it('[TC97336_04] Verify cross project dossier linking ', async () => {
        // remove the target dossier from library
        await dossierPage.goToLibrary();
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, target_NotInLib);
        await libraryPage.openDossier(sourceDossier.name);
        // do bookmark linking
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 4', pageName: 'SupportBookmark' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2015',
        });
        await dossierPage.switchToTab(1);
        await since(
            'Link to target dossier, add to library button present should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        // create first bookmark
        await bookmark.openPanel();
        await since(
            'open bookmark panel on target dossier, NoBookmarks panel present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNoBookmarks().isDisplayed())
            .toBe(true);
        await bookmark.clickAddBtn();
        await since(
            'create first bookmark on target dossier, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(true);
        await bookmark.saveBookmark();
        await since(
            'create first bookmark on target dossier, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
        
        // back to source and do the linking again
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2015',
        });
        await dossierPage.switchToTab(1);
        await bookmark.openPanel();
        await bookmark.clickAddBtn();
        await since(
            'create first bookmark on target dossier, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(false);
        await bookmark.saveBookmark();
        await since(
            'create second bookmark on target dossier, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(2);
        await bookmark.closePanel();

        // check add to library status
        await dossierPage.closeTab(1);
        await dossierPage.goToLibrary();
        await since(
            'back to library page, target dossier in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(target_NotInLib))
            .toBe(true);
        
    });


    
});
export const config = specConfiguration;
