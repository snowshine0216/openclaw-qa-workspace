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
describe('Incanvas Selector - listbox', () => {
    const dossier = {
        id: 'CF6AB18249BD929FA6AB89B32084A87D',
        name: '(AUTO) In-canvas selector - listbox',
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

    it('[TC80614] Incanvas selector - listbox - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80614', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80614', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80614', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80614', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80614', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await since('dynamic selection, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Music'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await inCanvasSelector.initial();
        await since('sort and multi-form, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Music:4'))
            .toBe(true);
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Music');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const targets = InCanvasSelector.createByTitle('Category');
        await takeScreenshotByElement(targets.getElement(), 'TC80614', 'targets-1', { tolerance: tolerance });
    });

    it('[TC80615] Incanvas selector - listbox - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const selector1 = InCanvasSelector.createByTitle('Category');

        // select item
        await selector1.selectItem('Movies');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Movies'))
            .toBe(true);

        // multi-select item
        await selector1.multiSelect(['Books', 'Electronics']);
        await since('Select item, item Movies selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Books'))
            .toBe(true);
        await since('Select item, item Electronics selected should be #{expected}, while we get #{actual}')
            .expect(await selector1.isItemSelected('Electronics'))
            .toBe(true);
        await since('Multi select item, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
    });
});
export const config = specConfiguration;
