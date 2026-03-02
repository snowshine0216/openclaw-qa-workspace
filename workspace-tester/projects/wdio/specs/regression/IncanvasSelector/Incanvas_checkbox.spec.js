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
const browserWindow = {
    
    width: 1600,
    height: 1200,
};

describe('Incanvas Selector - checkbox', () => {
    const dossier = {
        id: '0263DFA94B6A8B14512C439E9D994708',
        name: '(AUTO) In-canvas selector - checkbox',
        project: tutorialProject,
    };

    let { libraryPage, toc, dossierPage, inCanvasSelector, grid, loginPage } = browsers.pageObj1;

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

    it('[TC80609] Incanvas selector - checkbox - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80609', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80609', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80609', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80609', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'selector options' });
        const options2 = InCanvasSelector.createByTitle('vertical');
        await takeScreenshotByElement(options2.getElement(), 'TC80609', 'selector options -2', {
            tolerance: tolerance,
        });
        await since('Open selector options, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80609', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await since('dynamic selection, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Books'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await inCanvasSelector.initial();
        await since('multi-form, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Music:4'))
            .toBe(true);
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const targets1 = InCanvasSelector.createByTitle('Category');
        const targets2 = InCanvasSelector.createByTitle('Subcategory');
        await since('source and target, item selected should be #{expected}, while we get #{actual}')
            .expect(await targets1.isItemSelected('Music'))
            .toBe(true);
        await since('Open targets, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
    });

    it('[TC80608] Incanvas selector - checkbox - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const selector1 = InCanvasSelector.createByTitle('Category');
        const selector2 = InCanvasSelector.createByTitle('Subcategory');

        // search
        await selector2.search('a');
        await libraryPage.sleep(500); // wait for GUI static rendering
        await takeScreenshotByElement(selector2.getElement(), 'TC80608', 'search item');

        // select item
        await selector1.selectItem('Movies');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Movies'))
            .toBe(false);

        // unset filter
        await selector1.openContextMenu();
        await selector1.selectOptionInMenu('Unset Filter');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Movies'))
            .toBe(true);
        await since('After unset, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
    });
});
export const config = specConfiguration;
