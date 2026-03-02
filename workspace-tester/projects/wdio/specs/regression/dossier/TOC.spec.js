import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_toc') };

describe('Table of Contents Menu', () => {
    const dossier = {
        id: '4FE219E011E8F328EB300080AF83FF1B',
        name: 'TOC',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '3C84BA0549994604D8D168A88B685BF2',
        name: 'Show data',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {

        width: 1600,
        height: 1200,
    };
    const { dossierPage, libraryPage, loginPage, toc, reset, userAccount, grid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC31543] Check TOC title & if TOC can be closed in 2 ways', async () => {
        await toc.openMenu();
        await since('TOC Menu should be open but it is closed')
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await since('TOC title should be #{expected, instead we have #{actual}}')
            .expect(await toc.tocTitleName())
            .toBe('TOC');
        await toc.closeMenu({ icon: 'toc menu' });
        await since('TOC Menu should be closed but it is open')
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);

        await toc.openMenu();
        await since('TOC Menu should be open but it is closed')
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });
        await since('TOC Menu should be closed but it is open')
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
    });

    it('[TC31544] Check if clicking on page name navigates to the correct page and chapter', async () => {
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'TOC Chapter 2', pageName: 'Page 1' });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['TOC', 'TOC Chapter 2', 'Page 1']);
    });

    it('[TC31545] Check if clicking on Chapter name navigates to the first page of the chapter', async () => {
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'TOC Chapter 5' });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['TOC', 'TOC Chapter 5', 'Page 1']);
    });

    it('[TC31546] Check if TOC is scrollable & correct page numbers are displayed', async () => {
        await since('Page number should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.currentPageIndicator())
            .toBe('Page 1 of 25');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'TOC Chapter 5', pageName: 'Page 10' });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['TOC', 'TOC Chapter 5', 'Page 10']);
        await since('Page number should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['TOC', 'TOC Chapter 5', 'Page 10']);
        await since('Current Page Indicator should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.currentPageIndicator())
            .toBe('Page 25 of 25');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'TOC Chapter 3' });
        await since('Page number should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.currentPageIndicator())
            .toBe('Page 5 of 25');
    });

    it('[TC31547] Tooltip for truncated chapter and page names', async () => {
        await toc.openMenu();
        await toc.hoverOnTocItem({
            chapterName: 'TOC Chapter 4 very long name to test tooltip functionality by automation',
        });
        await since('Tooltip should display #{expected}, instead we have #{actual}')
            .expect(await toc.tooltip())
            .toBe('TOC Chapter 4 very long name to test tooltip functionality by automation');
        await toc.closeMenu({ icon: 'close' });
        await toc.openMenu();
        await toc.hoverOnTocItem({
            chapterName: 'TOC Chapter 4 very long name to test tooltip functionality by automation',
            pageName: 'Page 3 very long name to test tooltip functionality by automation',
        });
        await since('Tooltip should display #{expected}, instead we have #{actual}')
            .expect(await toc.tooltip())
            .toBe('Page 3 very long name to test tooltip functionality by automation');
    });

    it('[TC77170] Verify TOC working as expected when there is only page in a chapter', async () => {
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'TOC Chapter 3', pageName: 'Page 1' });
        await since('Page number should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.currentPageIndicator())
            .toBe('Page 5 of 25');
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['TOC', 'TOC Chapter 3', 'Page 1']);
        await since('Browser title should be #{expected}, instead we have #{actual}')
            .expect(await browser.getTitle())
            .toEqual('TOC | TOC Chapter 3 | Page 1');
    });

    it('[TC73323] Verify Pin TOC end-to-end journey on Library web', async () => {
        await toc.openMenu();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(false);
        await toc.hover({ elem: await toc.getTOCPin() });
        await takeScreenshotByElement(await toc.getMenuContainer(), 'TC73323', 'TOC pin tooltip');
        await toc.pinTOC();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await toc.goToPage({ chapterName: 'TOC Chapter 2', pageName: 'Page 2' });
        await dossierPage.waitForPageIndicatorDisappear();
        await toc.closeMenu({ icon: 'close' });
        await toc.openMenu();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await reset.selectReset();
        await reset.confirmReset();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossier.name);
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await toc.unpinTOC();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(false);
    });

    it('[TC73329] Verify Pin TOC functionality in different dossier on Library web', async () => {
        await toc.openMenu();
        await toc.pinTOC();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossier2.name);
        await toc.openMenu();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(false);
        await toc.pinTOC();
        await toc.unpinTOC();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossier.name);
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await toc.unpinTOC();
    });

    it('[TC73330] Verify Pin TOC functionality for different user on Library web', async () => {
        await toc.openMenu();
        await toc.pinTOC();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await dossierPage.goToLibrary();
        await userAccount.openUserAccountMenu();
        await userAccount.logout();

        await loginPage.login({ username: 'web', password: '' });
        await libraryPage.openDossier(dossier.name);
        await toc.openMenu();
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(false);
        await dossierPage.goToLibrary();
        await userAccount.openUserAccountMenu();
        await userAccount.logout();

        await loginPage.login(specConfiguration.credentials);
        await libraryPage.openDossier(dossier.name);
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);
        await toc.unpinTOC();
    });

    it('[TC73331] Verify UI of TOC responsive mode on Library web', async () => {
        await toc.openMenu();
        await toc.pinTOC();
        await setWindowSize({
            
            width: 599,
            height: 1200,
        });
        await toc.openMenu();
        await grid.hideContainer('TOC C1P1');
        await takeScreenshot('TC73331', 'TOC in mobile view');
        await toc.goToPage({ chapterName: 'TOC Chapter 3' });
        await since('TOC should be dismissed. TOC present should be #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);

        await setWindowSize({
            
            width: 1600,
            height: 1200,
        });

        await toc.openMenu();
        await grid.hideSubPanelContainer('TOC C3');
        await takeScreenshot('TC73331', 'TOC docked left: Chapter 3 Page 1');
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(true);

        // unpin toc
        await toc.unpinTOC();
        await takeScreenshot('TC73331', 'unpin TOC: Chapter 3 Page 1');
        await since('TOC should be docked #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCDocked())
            .toBe(false);
    });
});

export const config = specConfiguration;
