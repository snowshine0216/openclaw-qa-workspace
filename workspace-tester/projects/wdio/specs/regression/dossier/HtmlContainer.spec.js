import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('HTML Container', () => {
    const dossier = {
        id: 'B258520143B7CE1D7984E791B7874631',
        name: 'HTML container',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const specName = 'HTML Container';

    let { loginPage, dossierPage, libraryPage, htmlContainer, toc, webLoginPage, folderPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });

        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await browser.switchToFrame(null);
        await dossierPage.goToLibrary();
    });

    it('[TC42243] Verify HTML Container rendering with different kinds of tags in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'HTML Text' });
        await dossierPage.sleep(10000); // Wait for HTML container loading
        const Container = htmlContainer.getHTMLNode(0);
        await takeScreenshotByElement(Container, 'TC56654', 'HTML Text', { tolerance: 2.7 });
        await dossierPage.hover({ elem: Container.$('.button6') });
        await dossierPage.sleep(500);
        await takeScreenshotByElement(Container, 'TC56654', 'Interaction with HTML Container', { tolerance: 2.7 });
    });

    it('[TC72540] Verify embedded MSTR web with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'HTML Text' });
        const Container = htmlContainer.getHTMLNode(1);
        await dossierPage.sleep(10000); // Wait for HTML container loading
        await takeScreenshotByElement(Container, 'TC72540', 'MSTR Web', { tolerance: 3 });
    });

    it('[TC72534] Verify embedded MSTR web and Library with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'iFrame', pageName: 'http' });
        await dossierPage.sleep(10000); // Wait for HTML container loading
        //await takeScreenshotByElement(dossierPage.getDossierView(), 'TC72534', 'iframe: http');
        await since('Left container should contain MicroStrategy')
            .expect(await htmlContainer.textContent(3))
            .toContain('MicroStrategy/servlet/mstrWeb');
        await since('Right container should contain MicroStrategyLibrary')
            .expect(await htmlContainer.textContent(2))
            .toContain('MicroStrategyLibrary');

        await toc.openPageFromTocMenu({ chapterName: 'iFrame', pageName: 'https' });
        await dossierPage.sleep(15000); // Wait for HTML container loading
        //await takeScreenshotByElement(dossierPage.getDossierView(), 'TC72534', 'iframe: https', { tolerance: 1 });
        await since('Left container should contain MicroStrategy')
            .expect(await htmlContainer.textContent(5))
            .toContain('MicroStrategy/servlet/mstrWeb');
        await since('Right container should contain MicroStrategyLibrary')
            .expect(await htmlContainer.textContent(4))
            .toContain('MicroStrategyLibrary');
    });

    it('[TC72534_01] Verify embedded MSTR web and Library with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'iFrame', pageName: 'https' });
        await dossierPage.sleep(15000); // Wait for HTML container loading
        await browser.switchToFrame(await libraryPage.$('iframe[k="IGK2C37EFE247AE4B94157FFDB4CD242300"]'));
        await webLoginPage.openProject('MCI-AC4B2-DEV-ISERVER-0', 'MicroStrategy Tutorial');
        await webLoginPage.standardLDAPLogin('web', 'newman1#');
        await since('Folder Path should be #{expected}, instead we have #{actual}')
            .expect(await folderPage.paths())
            .toEqual(['MicroStrategy Tutorial', 'Home']);
    });

    it('[TC72675] Verify out sourcing website with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'iFrame', pageName: 'Out source websites' });
        await dossierPage.sleep(10000); // Wait for HTML container loading
        await since('Right container should contain bing')
            .expect(await htmlContainer.textContent(2))
            .toContain('https://cn.bing.com/');
        await since('Left container should contain Rally')
            .expect(await htmlContainer.textContent(3))
            .toContain('https://rally1.rallydev.com/');
    });

    it('[TC72677] Verify embedded video with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Media', pageName: 'Video' });
        await dossierPage.sleep(10000); // Wait for HTML container loading
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC72677', 'Video', { tolerance: 25 });
    });

    it('[TC72678] Verify embedded video with HTML Container in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Media', pageName: 'Image' });
        await dossierPage.sleep(10000); // Wait for HTML container loading
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC72678', 'Image');
    });

    it('[TC82593] Verify embedded dossier with iframe in Library dossier', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'iFrame', pageName: 'current env' });
        await libraryPage.refresh();
        await dossierPage.sleep(10000); // Wait for HTML container loading
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC82593', 'embedded dossier', { tolerance: 2 });
    });
});
