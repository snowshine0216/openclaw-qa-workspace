import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_incanvas_selector') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.2;
const browserWindow = {
    
    width: 1600,
    height: 1200,
};

describe('Incanvas Selector - Button Bar', () => {
    const dossier = {
        id: '8DC2217C4AD5FC5B59580A9422A629FE',
        name: '(AUTO) In-canvas selector - buttonbar',
        project: tutorialProject,
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

    it('[TC80605] Incanvas selector - button bar - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(await inCanvasSelector.getInstance(), 'TC80605', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(await forms1.getElement(), 'TC80605', 'text and form -1', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(await forms2.getElement(), 'TC80605', 'text and form -2', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(await forms3.getElement(), 'TC80605', 'text and form -3', {
            tolerance: tolerance,
        });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'selector options' });
        await since('Open selector options, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(await inCanvasSelector.getInstance(), 'TC80605', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await takeScreenshotByElement(await inCanvasSelector.getInstance(), 'TC80605', 'dynamic selection', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await takeScreenshotByElement(await inCanvasSelector.getInstance(), 'TC80605', 'sort and multi-form', {
            tolerance: tolerance,
        });

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const targets1 = InCanvasSelector.createByTitle('Category');
        await inCanvasSelector.initial();
        await since('source and target -1 , (All) selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('(All)'))
            .toBe(true);
        await since('source and target -2, (All) selected should be #{expected}, while we get #{actual}')
            .expect(await targets1.isItemSelected('(All)'))
            .toBe(false);
        await since('Open targets, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
    });

    it('[TC80606] Incanvas selector - button bar - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const selector = InCanvasSelector.createByTitle('Category');

        // select item
        await selector.selectItem('Movies');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector.isItemSelected('Movies'))
            .toBe(false);
        await since('Select item, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');

        // unset filter
        await selector.openContextMenu();
        await selector.selectOptionInMenu('Unset Filter');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector.isItemSelected('Movies'))
            .toBe(true);
        await since('After unset, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
    });
});
export const config = specConfiguration;
