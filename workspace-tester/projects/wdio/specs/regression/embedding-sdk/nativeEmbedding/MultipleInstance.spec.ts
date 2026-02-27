import setWindowSize from '../../../../config/setWindowSize.js';
import NativeEmbeddingPage from '../../../../pageObjects/embedding/NativeEmbeddingPage.js';
import * as embeddingConstants from '../../../../constants/embedding.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';
import resetBookmarks from '../../../../api/resetBookmarks.js';

describe('Native Embedding SDK Test - Multiple instance', () => {
    let embeddingPage: NativeEmbeddingPage;
    const libraryUrl = browser.options.baseUrl as string;
    const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
    const loginConfig = embeddingConstants.adminUser;
    const tutorialProject = {
        id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
        name: 'Tutorial Project',
    };
    const bookmarkDashboard = {
        id: 'EE4D4BDAF14271826BCCB289CC3C4908',
        name: 'Multiple Instance',
        project: tutorialProject,
    };

    const visKey = '2538E5A8059E4FFA85794B8059F3BB77';

    const { dossierPage} = browsers.pageObj1;

    beforeAll(async () => {
        embeddingPage = new NativeEmbeddingPage(embeddingPageUrl, libraryUrl);

        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: true });
        const browserWindow = {
            width: 1600,
            height: 1200,
        };
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: loginConfig,
            dossier: bookmarkDashboard,
        });
        await resetBookmarks({
            credentials: loginConfig,
            dossier: bookmarkDashboard,
        });
    });

    afterAll(async () => {
        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    // npm run regression -- --baseUrl=https://mci-h7kzr-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.browserName=chrome --params.locale=en-EN --tcList=BCIN-6494_1
    it('[BCIN-6494_1] Support multiple instance by create bookmark', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(bookmarkDashboard.project.id, bookmarkDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, [visKey]);
        await dossierPage.waitForDossierLoading();

        await embeddingPage.createBookmark(
            dossierKey,
            'New Bookmark 1',
        );
        const dossierBookmarkKey = await embeddingPage.listBookmarks(bookmarkDashboard.project.id, bookmarkDashboard.id, visKey, dossierKey);
        await dossierPage.waitForDossierLoading();
        // take screenshot after listing bookmarks
        await takeScreenshot('BCIN-6494_1_01', 'Render 2 instance by create bookmark');

        // apply different filter on two instance
        const filter1 = [
            {
                // attribute element list Category - chapter filter
                key: 'W63',
                currentSelection: {
                    elements: [
                        {
                            name: 'Books',
                            id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                        },
                    ],
                },
            },
        ];
        const filter2 = [
            {
                // attribute element list Category - chapter filter
                key: 'W63',
                currentSelection: {
                    elements: [
                        {
                            name: 'Electronics',
                            id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                        },
                    ],
                },
            },
        ];
        await embeddingPage.applyFilters(dossierKey, filter1);
        await dossierPage.waitForDossierLoading();
        await embeddingPage.applyFilters(dossierBookmarkKey[0], filter2);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying different filter on two instance
        await takeScreenshot('BCIN-6494_1_02', 'Apply different filter on two instance');
    });

    it('[BCIN-6494_2] Support multiple instance by create new instance', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(bookmarkDashboard.project.id, bookmarkDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, [visKey]);
        await dossierPage.waitForDossierLoading();

        const dossierInstanceKey = await embeddingPage.createNewDashboardInstance({
            dossier: bookmarkDashboard,
            credentials: loginConfig,
            visKey: visKey,
        });
        await dossierPage.waitForDossierLoading();

        // take screenshot after listing bookmarks
        await takeScreenshot('BCIN-6494_2_01', 'Render 2 instance by create instance');

        // apply different filter on two instance
        const filter1 = [
            {
                // attribute element list Category - chapter filter
                key: 'W63',
                currentSelection: {
                    elements: [
                        {
                            name: 'Books',
                            id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                        },
                    ],
                },
            },
        ];
        const filter2 = [
            {
                // attribute element list Category - chapter filter
                key: 'W63',
                currentSelection: {
                    elements: [
                        {
                            name: 'Electronics',
                            id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                        },
                    ],
                },
            },
        ];
        await embeddingPage.applyFilters(dossierKey, filter1);
        await dossierPage.waitForDossierLoading();
        await embeddingPage.applyFilters(dossierInstanceKey, filter2);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying different filter on two instance
        await takeScreenshot('BCIN-6494_2_02', 'Apply different filter on two instance');

    });

});
