import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_incanvas_selector') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('E2E Incanvas selector', () => {
    const dossier1 = {
        id: '822AABFC46730D3AABF30BBBC63DFF90',
        name: '(AUTO) In-canvas selector - E2E',
        project,
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, toc, grid, inCanvasSelector, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC81307] Verify In-canvas Selector in different styles and status in Library Web', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);

        // checkbox
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'check box' });
        await since(
            'Page check box , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Atlanta');
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingCheckbox');

        // searchbox
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'Search box' });
        await since(
            'Page Search box , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('San Francisco');
        if (!libraryPage.isSafari()) {
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingSearchbox');
        }
        await inCanvasSelector.searchSearchbox('Memphis');
        await inCanvasSelector.selectSearchBoxItem('Memphis');

        // linkbar
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'Link bar' });
        await since(
            'Page Link bar , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Miami');
        if (!libraryPage.isSafari()) {
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingLinkbar');
        }
        await inCanvasSelector.selectItem('Atlanta');
        await since('Select Atlanta on link bar, Atlanta selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Atlanta'))
            .toBe(true);

        // button bar
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'Button bar' });
        await since(
            'Page Button bar , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('San Francisco');
        if (!libraryPage.isSafari()) {
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingButtonbar');
        }
        await inCanvasSelector.selectItem('Atlanta');
        await since('Select Atlanta on button bar, Atlanta selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Atlanta'))
            .toBe(true);

        // dropdown
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'Drop down' });
        await inCanvasSelector.openDropdownMenu();
        await takeScreenshotByElement(inCanvasSelector.getDropdownWidget(), 'TC81307', 'RenderingDropdown');
        await inCanvasSelector.selectDropdownItems(['Atlanta']);
        await since('Select Atlanta on dropdown, selected item should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSelectedDrodownItem())
            .toBe('Atlanta');

        // list box
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'List box' });
        await since(
            'Page List box , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Washington, DC');
        if (!libraryPage.isSafari()) {
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingListbox');
        }
        await inCanvasSelector.selectItem('Atlanta');
        await since('Select Atlanta on list box, Atlanta selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Atlanta'))
            .toBe(true);

        // slider
        await toc.openPageFromTocMenu({ chapterName: 'InCanvasSelector', pageName: 'Slider' });
        await since(
            'Page slider , first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Milwaukee');
        if (!libraryPage.isSafari()) {
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC81307', 'RenderingSlider');
        }
    });
});

export const config = specConfiguration;
