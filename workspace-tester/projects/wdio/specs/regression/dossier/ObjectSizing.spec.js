import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';

describe('Object Sizing', () => {
    const dossier = {
        id: '7FCCC599482A1179CE106B8ED548ECBC',
        name: 'TC75868',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: 'E865C14A43A684E942462B899E5A8117',
        name: 'TC75869',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: '13A810D34BE3366E068D78A965000B5E',
        name: 'Dossier image with absolute/relative path',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RSD = {
        id: '00DABDD74A8DA75C391E24BC7FDC1F3D',
        name: 'RSD image with absolute/relative path',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, dossierPage, libraryPage, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);

        await setWindowSize({
            width: 1600,
            height: 1200,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC75869] Validate the height of image in dossier HTML container and grid on library is the same as that on web', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC75869_01', 'text');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'image' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC75869_02', 'image');
    });

    it('[TC78911] Validate Dossier image with different absolute/relative path in Library Web', async () => {
        await deleteAllFavorites(browsers.params.credentials);
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossier(dossier3.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'relative path' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC78911_01', 'relative path', { tolerance: 0.12 });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'absolute path' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC78911_02', 'absolute path', { tolerance: 0.13 });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'html path' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC78911_03', 'html path', { tolerance: 9 });
    });

    it('[TC78917] Validate RSD image with different absolute/relative path in Library Web', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: RSD,
        });
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC78917', 'image', { tolerance: 0.6 });
    });
});
