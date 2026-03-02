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

describe('Incanvas Selector - slider', () => {
    const dossier = {
        id: '5BBAE9B04A3A270A488F06B679CA10DB',
        name: '(AUTO) In-canvas selector - slider',
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

    it('[TC80684] Incanvas selector - slider - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80684', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80684', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80684', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80684', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        const exclude1 = InCanvasSelector.createByTitle('Exclude');
        const exclude2 = InCanvasSelector.createByTitle('Include');
        await takeScreenshotByElement(exclude1.getElement(), 'TC80684', 'include and exclude-1', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(exclude2.getElement(), 'TC80684', 'include and exclude-2', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await takeScreenshotByElement(await inCanvasSelector.getInstance(), 'TC80684', 'dynamic selection', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await inCanvasSelector.initial();
        await since('sort and multi-form: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSliderText())
            .toBe('Music:4 - Electronics:2');
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const targets1 = InCanvasSelector.createByTitle('Category');
        const targets2 = InCanvasSelector.createByTitle('Cost');
        await takeScreenshotByElement(targets1.getElement(), 'TC80684', 'targets-1', { tolerance: tolerance });
        await since('Exclude mode: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await targets2.getSliderText())
            .toBe('$3.2M - $18.5M');
        await since('Open targets, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
    });

    it('[TC80685] Incanvas selector - slider - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const selector1 = InCanvasSelector.createByTitle('Category');
        const selector2 = InCanvasSelector.createByTitle('Cost');

        // drag slider  - single
        await selector1.dragSlider({ x: 50, y: 0 });
        await since('Exclude mode: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector1.getSliderTooltipText())
            .toBe('Electronics');
        await since('Exclude mode: first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');

        // drag slider  - multiple
        await selector2.dragSlider({ x: 50, y: 0 }, 'start');
        await since('Exclude mode: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector2.getSliderTooltipText())
            .toBe('$18,518,898');
    });
});
export const config = specConfiguration;
