import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_incanvas_selector') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.3;

describe('Incanvas Selector - radio button', () => {
    const dossier = {
        id: 'FF7076CE4ABE3322A3C76BBA89E86A8B',
        name: '(AUTO) In-canvas selector - radio button',
        project: tutorialProject,
    };
    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { dossierPage, toc, libraryPage, inCanvasSelector, grid, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80616] Incanvas selector - radio button - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80616', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80616', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80616', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80616', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'selector options' });
        const options2 = InCanvasSelector.createByTitle('vertical');
        await takeScreenshotByElement(options2.getElement(), 'TC80616', 'selector options -2', {
            tolerance: tolerance,
        });
        await since('Open selector options, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80616', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await since('dynamic selection, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Music'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80616', 'sort and multi-form', {
            tolerance: tolerance,
        });
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80616', 'targets', { tolerance: tolerance });
        await since('Open targets, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
    });

    it('[TC80617] Incanvas selector - radio button - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });

        // select item - metric selector
        await inCanvasSelector.selectItem('Cost');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Cost'))
            .toBe(true);
        await dossierPage.clickPageTitle();

        // unset filter
        await inCanvasSelector.openContextMenu();
        await inCanvasSelector.selectOptionInMenu('Unset Selector');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Cost'))
            .toBe(false);
    });
});
export const config = specConfiguration;
