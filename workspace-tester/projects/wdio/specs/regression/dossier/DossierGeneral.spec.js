import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_general') };

describe('Dossier General', () => {
    const longDossierName = {
        id: 'B2A72B394FC48382D514518D0CA77B79',
        name: 'DE162384 Dossier Title',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const shortDossierName = {
        id: '5F090C614AC8AF28B76BBBA6567573F2',
        name: 'ITS',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { bookmark, dossierPage, loginPage, libraryPage, toc, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await resetBookmarks({
            credentials: specConfiguration.credentials,
            dossier: longDossierName,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: longDossierName,
        });

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: shortDossierName,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66305] Dossier General - Dossier Title - Check title of Dossier with long dossier name(F30379)', async () => {
        await libraryPage.openDossier(longDossierName.name);
        await since('For Single Page Chapter, Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['DE162384 Dossier Title', 'Single Page Chapter', 'Page 1']);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC66305', 'short chapter name - 1600px');

        // check dossier title with  Multiple Pages Chapter
        await toc.openPageFromTocMenu({ chapterName: 'Multiple Pages Chapter', pageName: 'Page 1' });
        await since('For multi Page Chapter, Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['DE162384 Dossier Title', 'Multiple Pages Chapter', 'Page 1']);

        // check dossier title with long chapter name
        await toc.openPageFromTocMenu({
            chapterName: 'Super looooooooooooong chapter name',
            pageName: 'Super looooooooooooooooooooooong page name',
        });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                'DE162384 Dossier Title',
                'Super looooooooooooong chapter name',
                'Super looooooooooooooooooooooong page name',
            ]);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC66305', 'Long chapter name - 1600px');

        // check 1000*1200
        await setWindowSize({
            
            width: 1000,
            height: 1200,
        });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['', 'Super looooooooooooong chapter name', 'Super looooooooooooooooooooooong page name']);
        await since('For 1000*1200, Tooltip should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getDossierChapterTooltip())
            .toEqual('Super looooooooooooong chapter name');
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC66305', 'Long chapter name - 1000px');

        // check 650*1200
        await setWindowSize({
            
            width: 600,
            height: 1200,
        });
        await since('For 650*1200, Tooltip should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getDossierPageTooltip())
            .toEqual('Super looooooooooooooooooooooong page name');
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['', 'Super looooooooooooong chapter name', 'Super looooooooooooooooooooooong page name']);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC66305', 'Long chapter name - 600px');

        // check 360*740
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 360,
            height: 740,
        });
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC66305', 'Long chapter name - 400px');

        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1600,
            height: 1200,
        });
    });

    it('[TC68122] Dossier General - Dossier Title - Check title of Dossier with short dossier name (F30379)', async () => {
        await libraryPage.openDossier(shortDossierName.name);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ITS', 'Single Page Chapter', 'Page 1']);

        // check dossier title with  Multiple Pages Chapter
        await toc.openPageFromTocMenu({ chapterName: 'Multiple Pages Chapter', pageName: 'Page 1' });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ITS', 'Multiple Pages Chapter', 'Page 1']);

        // check dossier title with long chapter name
        await toc.openPageFromTocMenu({
            chapterName: 'Super looooooooooooong chapter name',
            pageName: 'Super looooooooooooooooooooooong page name',
        });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ITS', 'Super looooooooooooong chapter name', 'Super looooooooooooooooooooooong page name']);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC68122', 'Long chapter name - 1600px');

        // check 1000*1200
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1000,
            height: 1200,
        });
        await since('For 1000*1200, Tooltip should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getDossierChapterTooltip())
            .toEqual('Super looooooooooooong chapter name');
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['', 'Super looooooooooooong chapter name', 'Super looooooooooooooooooooooong page name']);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC68122', 'Long chapter name - 1000px');

        // check 650*1200
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 650,
            height: 1200,
        });
        await since('For 650*1200, Tooltip should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getDossierPageTooltip())
            .toEqual('Super looooooooooooooooooooooong page name');
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['', 'Super looooooooooooong chapter name', 'Super looooooooooooooooooooooong page name']);

        // check 360*740
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 360,
            height: 740,
        });
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC68122', 'Long chapter name - 400px');

        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1600,
            height: 1200,
        });
    });

    // [TC66308] Dossier General - Dossier Title - Apply bookmark and check dossier title (F30379)
    // 1. Reset dossier state/bookmark state
    // 2. Open dossier 'DE162384 Dossier Title'
    // 3. Open bookmark panel
    // 4. Add a new bookmark 'Bookmark 1'
    // 5. Apply Bookmark 'Bookmark 1'
    // 6. Check the title to be 'DE162384 Dossier Title | Single Page Chapter'
    // 7. Check GUI of Bookmark label
    // 8. Go to library

    it('[TC66308] Dossier General - Dossier Title - Apply bookmark and check dossier title (F30379)', async () => {
        await libraryPage.openDossier(longDossierName.name);
        await toc.openPageFromTocMenu({ chapterName: 'Multiple Pages Chapter', pageName: 'Page 3' });
        await bookmark.openPanel();
        await bookmark.addNewBookmark('Bookmark 1');
        await toc.openPageFromTocMenu({
            chapterName: 'Super looooooooooooong chapter name',
            pageName: 'Super looooooooooooooooooooooong page name',
        });
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1');
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['DE162384 Dossier Title', 'Multiple Pages Chapter', 'Page 3']);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC63754_003', 'Apply bookmark');
    });
});

export const config = specConfiguration;
