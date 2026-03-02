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
const tolerance = 0.2;

describe('Incanvas Selector - linkbar', () => {
    const dossier = {
        id: 'D6D82E394C57DF2ABDC729B4E22380B9',
        name: '(AUTO) In-canvas selector - linkbar',
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

    it('[TC80610] Incanvas selector - linkbar - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80610', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80610', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80610', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80610', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'selector options' });
        const options1 = InCanvasSelector.createByTitle('orientation - horizontal');
        const options2 = InCanvasSelector.createByTitle('vertical');
        await takeScreenshotByElement(options2.getElement(), 'TC80610', 'selector options -2', {
            tolerance: tolerance,
        });
        await since('Selector option, item selected should be #{expected}, while we get #{actual}')
            .expect(await options1.isItemSelected('Books'))
            .toBe(true);
        await since('Open selector options, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        const exclude = InCanvasSelector.createByTitle('Category');
        await takeScreenshotByElement(exclude.getElement(), 'TC80610', 'include and exclude', { tolerance: tolerance });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await since('dynamic selection, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Books'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await inCanvasSelector.initial();
        await since('sort and multi-form, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Music:4'))
            .toBe(true);
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80610', 'targets', { tolerance: tolerance });
    });

    it('[TC80611] Incanvas selector - linkbar - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        const selector1 = InCanvasSelector.createByTitle('Category');

        // select item
        await selector1.selectItem('Movies');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Movies'))
            .toBe(true);

        // unset filter
        await selector1.openContextMenu();
        await selector1.selectOptionInMenu('Unset Filter');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Movies'))
            .toBe(false);
    });
});
export const config = specConfiguration;
