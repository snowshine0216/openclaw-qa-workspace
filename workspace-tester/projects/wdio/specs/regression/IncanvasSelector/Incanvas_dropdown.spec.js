import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import { customCredentials } from '../../../constants/index.js';
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

describe('Incanvas Selector - dropdown', () => {
    const dossier = {
        id: '289F431245D8514ADB9876A2CF1C0515',
        name: '(AUTO) In-canvas selector - dropdown',
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

    it('[TC80657] Incanvas selector - dropdown - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80657', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80657', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80657', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80657', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80657', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await since('ynamic selection, selected item should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSelectedDrodownItem())
            .toBe('Books, Electronics, Movies');

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await inCanvasSelector.initial();
        await inCanvasSelector.openDropdownMenu();
        await takeScreenshotByElement(inCanvasSelector.getDropdownWidget(), 'TC80657', 'sort and multi-form', {
            tolerance: tolerance,
        });

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80657', 'targets', { tolerance: tolerance });
    });

    it('[TC80658] Incanvas selector - dropdown - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        const selector1 = InCanvasSelector.createByTitle('Category');
        const selector2 = InCanvasSelector.createByTitle('Panel Selector');

        // select item - multiple - panel selector
        await selector1.openDropdownMenu();
        await takeScreenshotByElement(selector1.getDropdownWidget(), 'TC80658', 'open dropdow - multiple', {
            tolerance: 1.2,
        });
        await selector1.selectDropdownItems(['Books', 'Movies']);
        await selector1.clickDropdownBtn('OK');
        await since('Multi select item, selected item should be #{expected}, while we get #{actual}')
            .expect(await selector1.getSelectedDrodownItem())
            .toBe('Electronics, Movies, Music');
        await since('Multi select item, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');

        // select item - single
        await selector2.openDropdownMenu();
        await selector2.selectDropdownItems(['Panel 2']);
        await since('Select item, selected item should be #{expected}, while we get #{actual}')
            .expect(await selector2.getSelectedDrodownItem())
            .toBe('Panel 2');
    });
});
export const config = specConfiguration;
