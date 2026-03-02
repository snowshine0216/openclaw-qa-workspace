import setWindowSize from '../../../../config/setWindowSize.js';
import NativeEmbeddingPage from '../../../../pageObjects/embedding/NativeEmbeddingPage.js';
import * as embeddingConstants from '../../../../constants/embedding.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('Native Embedding SDK Test - Attribute Metric Selector', () => {
    let embeddingPage: NativeEmbeddingPage;
    const libraryUrl = browser.options.baseUrl as string;
    const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
    const loginConfig = embeddingConstants.adminUser;
    const tutorialProject = {
        id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
        name: 'Tutorial Project',
    };
    const selectorDashboard = {
        id: 'D972E8947A4BED3F4D1B1683F800621E',
        name: 'Embedding Attribute Metric Selector',
        project: tutorialProject,
    };
    const visKeys = ['K52'];

    const { dossierPage, grid, lineChart } = browsers.pageObj1;

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
            dossier: selectorDashboard,
        });
    });

    afterAll(async () => {
        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    // npm run regression -- --baseUrl=https://mci-h7kzr-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.browserName=chrome --params.locale=en-EN --tcList=TC99387_1
    it('[TC99387_1] Apply Attribute Selector', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(selectorDashboard.project.id, selectorDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        const filter1 = {
            key: 'W63',
            currentSelection: {
                selectionStatus: 'included',
                objectItems: [
                    {
                        id: 'UF2CE79F69440E3CFF2E13B8FBB550589;F2CE79F69440E3CFF2E13B8FBB550589',
                        name: 'Origin Airport',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter1);
        // take screenshot
        await takeScreenshot('TC99385_1_1', 'Apply Attribute Selector by including an item');
        const filter2 = {
            key: 'W63',
            currentSelection: {
                selectionStatus: 'unfiltered',
                objectItems: [
                    {
                        id: 'UF2CE79F69440E3CFF2E13B8FBB550589;F2CE79F69440E3CFF2E13B8FBB550589',
                        name: 'Origin Airport',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter2);
        // take screenshot
        await takeScreenshot('TC99385_1_2', 'Apply Attribute Selector by excluding an item');
        const filter3 = {
            key: 'W63',
            currentSelection: {
                selectionStatus: 'included',
                objectItems: [
                    {
                        id: 'UF2CE79F69440E3CFF2E13B8FBB550589;F2CE79F69440E3CFF2E13B8FBB550589',
                        name: 'Origin Airport',
                    },
                    {
                        id: 'UBBCAA30DD54667A4C28ADA8756119AC1;BBCAA30DD54667A4C28ADA8756119AC1',
                        name: 'Airline Name',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter3);
        // take screenshot
        await takeScreenshot('TC99385_1_3', 'Apply Attribute Selector by including multiple items');
    });

    it('[TC99387_2] Apply Metric Selector', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(selectorDashboard.project.id, selectorDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        const filter1 = {
            key: 'W65',
            currentSelection: {
                selectionStatus: 'included',
                objectItems: [
                    {
                        id: 'i3BA8A83A39409302B153568A42C38388;3BA8A83A39409302B153568A42C38388',
                        name: 'Flights Delayed',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter1);
        // take screenshot
        await takeScreenshot('TC99385_2_1', 'Apply Metric Selector by including an item');
        const filter2 = {
            key: 'W65',
            currentSelection: {
                selectionStatus: 'unfiltered',
                objectItems: [
                    {
                        id: 'i3BA8A83A39409302B153568A42C38388;3BA8A83A39409302B153568A42C38388',
                        name: 'Flights Delayed',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter2);
        // take screenshot
        await takeScreenshot('TC99385_2_2', 'Apply Metric Selector by excluding an item');
        const filter3 = {
            key: 'W65',
            currentSelection: {
                selectionStatus: 'included',
                objectItems: [
                    {
                        id: 'i3BA8A83A39409302B153568A42C38388;3BA8A83A39409302B153568A42C38388',
                        name: 'Flights Delayed',
                    },
                    {
                        id: 'iB2100EACDC48ECF56EA3D0A07A2706C9;B2100EACDC48ECF56EA3D0A07A2706C9',
                        name: 'Flights Cancelled',
                    },
                ],
            },
        };
        await embeddingPage.applyFilter(dossierKey, filter3);
        // take screenshot
        await takeScreenshot('TC99385_2_3', 'Apply Metric Selector by including multiple items');
    });

    it('[TC99387_3] Apply both Attribute and Metric Selectors', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(selectorDashboard.project.id, selectorDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                key: 'W63',
                currentSelection: {
                    selectionStatus: 'included',
                    objectItems: [
                        {
                            id: 'UF2CE79F69440E3CFF2E13B8FBB550589;F2CE79F69440E3CFF2E13B8FBB550589',
                            name: 'Origin Airport',
                        },
                    ],
                },
            },
            {
                key: 'W65',
                currentSelection: {
                    selectionStatus: 'included',
                    objectItems: [
                        {
                            id: 'i3BA8A83A39409302B153568A42C38388;3BA8A83A39409302B153568A42C38388',
                            name: 'Flights Delayed',
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // take screenshot
        await takeScreenshot('TC99385_3_1', 'Apply both Attribute and Metric Selectors');
    });

    it('[TC99387_4] X-func with chapter filter', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(selectorDashboard.project.id, selectorDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                key: 'W63',
                currentSelection: {
                    selectionStatus: 'included',
                    objectItems: [
                        {
                            id: 'UBBCAA30DD54667A4C28ADA8756119AC1;BBCAA30DD54667A4C28ADA8756119AC1',
                            name: 'Airline Name',
                        },
                    ],
                },
            },
            {
                key: 'W65',
                currentSelection: {
                    selectionStatus: 'included',
                    objectItems: [
                        {
                            id: 'i3BA8A83A39409302B153568A42C38388;3BA8A83A39409302B153568A42C38388',
                            name: 'Flights Delayed',
                        },
                    ],
                },
            },
            {
                key: 'W67',
                currentSelection: {
                    selectionStatus: 'included',
                    elements: [
                        {
                            id: 'hAirTran Airways Corporation;BBCAA30DD54667A4C28ADA8756119AC1',
                            name: 'AirTran Airways Corporation',
                        },
                        {
                            id: 'hAmerican Airlines Inc.;BBCAA30DD54667A4C28ADA8756119AC1',
                            name: 'American Airlines Inc.',
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // take screenshot
        await takeScreenshot('TC99385_4_1', 'Apply both Attribute Selectors and chapter filter');
    });
});
