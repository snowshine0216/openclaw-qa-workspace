import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - Pass InCanvas Selector', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const passIncanvasSelectorOnText = {
        id: '7572B96C41D2E95240D31BAC4CEB4677',
        name: '(AUTO) DossierLinking_PassInCanvasSelector_Text/Image',
        project: tutorialProject,
    };
    const passIncanvasSelectorOnGrid = {
        id: 'E9E24A854159F39E5E3DFEAF7FB85B38',
        name: '(AUTO) DossierLinking_PassInCanvasSelector_Grid',
        project: tutorialProject,
    };
    const passIncanvasSelectorNewTab = {
        id: '7BF1FA4640C071E9A70572A3708D8F20',
        name: '(AUTO) DossierLinking_PassInCanvasSelector_NewTab',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, textbox, imageContainer, inCanvasSelector, loginPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85331] Verify different in-canvas selectors types and properties can be passed to target dossier', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passIncanvasSelectorOnGrid,
        });
        await libraryPage.openDossier(passIncanvasSelectorOnGrid.name);

        //pass single selector
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'single selector' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await inCanvasSelector.initial();
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass single selector, selector [Books] is passed should be #{expected}, while we got #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Books'))
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        //pass multiple selectors
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'multiple selectors' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        const selector1 = InCanvasSelector.createByTitle( 'Call Center');
        const selector2 = InCanvasSelector.createByTitle( 'Category');
        await since('Pass multiple selectors, passed selector value should be #{expected}, while we get #{actual}')
            .expect(await selector1.getSelectedDrodownItem())
            .toBe('Salt Lake City, Milwaukee, Seattle');
        await since(
            'Pass multiple selectors, passed selector value count should be #{expected}, while we get #{actual}'
        )
            .expect((await selector2.getSelectedSearchboxItem()).length)
            .toBe(1);
        await dossierPage.goBackFromDossierLink();

        // pass selector with exclude mode
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'exclude mode' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await inCanvasSelector.initial();
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass selector exclude mode, passed selector value should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Books'))
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // pass selector with multiple attribute forms
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'multiple forms' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await inCanvasSelector.initial();
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass selector with multiple attribute forms, passed selector value should be #{expected}, while we get #{actual}'
        )
            .expect(await inCanvasSelector.isItemSelected('1:Books'))
            .toBe(true);
        await since(
            'Pass selector with multiple attribute forms, passed selector [Electronics] and value should be #{expected}, while we get #{actual}'
        )
            .expect(await inCanvasSelector.isItemSelected('2:Electronics'))
            .toBe(true);
        await since(
            'Pass selector with multiple attribute forms, passed selector [Movies] and value should be #{expected}, while we get #{actual}'
        )
            .expect(await inCanvasSelector.isItemSelected('3:Movies'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // pass selector in unset state
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'unset selector' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await inCanvasSelector.initial();
        await since('link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            "Pass selector with unset state, selector should be passed as 'select all' instead of 'select none', and selector count should be #{expected},while we got #{actural}"
        )
            .expect(await inCanvasSelector.isItemSelected('(All)'))
            .toBe(true);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC85332] Verify different in-canvas selectors can be passed to target dossier by text/Image', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passIncanvasSelectorOnText,
        });
        await libraryPage.openDossier(passIncanvasSelectorOnText.name);

        // pass text
        await toc.openPageFromTocMenu({ chapterName: 'element value', pageName: 'Page 1' });
        await textbox.navigateLink(0);
        await inCanvasSelector.initial();
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass by text, selector [Book] is passed and value should be #{expected}, while we got #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Books'))
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        // pass image
        await toc.openPageFromTocMenu({ chapterName: 'metric selector', pageName: 'Page 1' });
        await imageContainer.navigateLink(0);
        await inCanvasSelector.initial();
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Pass by image, selector [Cost] is passed and value should be #{expected}, while we got #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Cost'))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC85333] Verify different in-canvas selectors can be passed when open in new tab ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passIncanvasSelectorOnGrid,
        });
        await libraryPage.openDossier(passIncanvasSelectorNewTab.name);

        // pass selector to itself from Text/Image
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'single selector' });
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await since('Pass single selector, selector [Books] is passed should be #{expected}, while we got #{actual}')
            .expect(await inCanvasSelector.getSliderText())
            .toBe('Electronics - Movies');
        await dossierPage.closeTab(1);

        // pass selector to itself from Grid/Viz
        await toc.openPageFromTocMenu({ chapterName: 'element selector', pageName: 'multiple selectors' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await dossierPage.switchToTab(1);
        const selector1 = InCanvasSelector.createByTitle( 'Call Center');
        const selector2 = InCanvasSelector.createByTitle( 'Category');
        await since('Pass multiple selectors, passed selector value should be #{expected}, while we get #{actual}')
            .expect(await selector1.getSelectedDrodownItem())
            .toBe('Salt Lake City, Milwaukee, Seattle');
        await since(
            'Pass multiple selectors, passed selector value count should be #{expected}, while we get #{actual}'
        )
            .expect((await selector2.getSelectedSearchboxItem()).length)
            .toBe(1);
        await dossierPage.closeTab(1);
    });
});
export const config = specConfiguration;
