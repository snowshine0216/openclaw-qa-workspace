import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Page Linking', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: '24DB222846D123808FB15589E8275121',
        name: 'Page Linking',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1000,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, textbox, imageContainer, pieChart, loginPage, reset } = browsers.pageObj1;

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
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'source' });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC98700] Verify page linking in Library from different source - from text', async () => {
        // text - link to page in same chapter
        await textbox.navigateLinkByText('link to page in same chapter');
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'target in same chapter']);
        await grid.selectGridContextMenuOption({
                title: 'Visualization 1',
                headerName: 'Category',
                elementName: 'Music',
                firstOption: 'Keep Only'
        });
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');

        // text - link back to page in same chapter
        await textbox.navigateLinkByText('link back to page in same chapter');
        await since('Link to back Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
        
        // text - link to page in other chapter
        await textbox.navigateLinkByText('link to page in other chapter');
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 2', 'target in other chapter']);
        await grid.selectGridContextMenuOption({
                title: 'Visualization 1',
                headerName: 'Category',
                elementName: 'Movies',
                firstOption: 'Keep Only'
        });
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
        
        // text - link back to page in other chapter
        await textbox.navigateLinkByText('link back to page in other chapter');
        await since('Link to back Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
        
        // Undo
        await dossierPage.clickUndo();
        await since('After undo, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 2', 'target in other chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
        
        // Redo
        await dossierPage.clickRedo();
        await since('After redo, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
    });

    it('[TC98700_02] Verify page linking in Library from different source - from image', async () => {
        // A>B(same chapter)>C(other chapter)>A
        // image - link to page in same chapter A>B
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to page from Image, back icon should not be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Image, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'target in same chapter']);
        await grid.selectGridContextMenuOption({
                title: 'Visualization 1',
                headerName: 'Category',
                elementName: 'Music',
                firstOption: 'Keep Only'
        });
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');

        // image - link to page in other chapter B>C
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to back Page from image, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 2', 'target in other chapter']);
        await grid.selectGridContextMenuOption({
                title: 'Visualization 1',
                headerName: 'Category',
                elementName: 'Movies',
                firstOption: 'Keep Only'
        });
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
        
        // text - back to page in other chapter C>A check page A
        await textbox.navigateLinkByText('link back to page in other chapter');
        await since('After back, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
        
        // check page B
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Link to Page from Image, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'target in same chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');
    });

    it('[TC98700_03] Verify page linking in Library from different source - from grid', async () => {
        // grid - link to page in same chapter
        await grid.linkToTargetByGridContextMenu({
            title: 'source grid to same chapter',
            headerName: 'Category',
            elementName: 'Music',
        });
        await since('Link to this chapter from Grid, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to this chapter from Grid, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'target in same chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');
        await reset.selectReset();
        await reset.confirmReset();
        await since('After reset, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
        
        // grid - link to page in other chapter
        await grid.linkToTargetByGridContextMenu({
            title: 'source grid to other chapter',
            headerName: 'Category',
            elementName: 'Movies',
        });

        await since('Link to other chapter from Grid, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 2', 'target in other chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
        
        // back to source
        await textbox.navigateLinkByText('link back to page in other chapter');
        await since('After back, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
    });

    it('[TC98700_04] Verify page linking in Library from different source - from viz', async () => {
        // viz - link to page in same chapter
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'source viz to same chapter',
            slice: 'Electronics',
        });
        await since('Link to this chapter from viz, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to this chapter from viz, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'target in same chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        
        // text - link back to page in same chapter
        await textbox.navigateLinkByText('link back to page in same chapter');
        await since('Link to back Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');

        // viz - link to page in other chapter
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'source viz to other chapter',
            slice: 'Electronics',
        });
        await since('Link to this chapter from viz, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 2', 'target in other chapter']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 2', headerName: 'Subcategory' }))
            .toBe('Audio Equipment');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        
        // text - link back to page in other chapter
        await textbox.navigateLinkByText('link back to page in other chapter');
        await since('Link to back Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Page Linking', 'Chapter 1', 'source']);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'source grid to same chapter', headerName: 'Category' }))
            .toBe('Books');
    });
   
});
export const config = specConfiguration;
