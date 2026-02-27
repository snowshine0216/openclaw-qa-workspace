import setWindowSize from '../../../../config/setWindowSize.js';
import IframeEmbeddingPage from '../../../../pageObjects/embedding/IframeEmbeddingPage.js';
import * as embeddingConstants from '../../../../constants/embedding.js';

describe('Iframe Embedding SDK Test - RSD widget selection', () => {
    let embeddingPage: IframeEmbeddingPage;
    const serverUrl = browser.options.baseUrl;
    const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
    const loginConfig = embeddingConstants.adminUser;


    const config = {
            serverUrl: serverUrl as string,
            projectId: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
            objectId: 'FF620C2A674C166CCF588691C46E00E2',
            placeholderId: 'container',
            settings: {
                documentConsumption: {
                    componentSelection: {
                        layout: { enabled: true },
                        widget: { enabled: true },
                        multipleSelections: true,
                    },
                },
            },
        }

    const {
        loginPage,
        rsdPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        embeddingPage = new IframeEmbeddingPage(embeddingPageUrl, serverUrl, config);

        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: true });
        const browserWindow = {
            width: 1600,
            height: 1200,
        };
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    // npm run regression -- --baseUrl=https://mci-h7kzr-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.browserName=chrome --params.locale=en-EN --tcList=BCED-4714
    it('[BCED-4714] Embed Document Consumption Page with Component Selection Event', async () => {
        await embeddingPage.navigateToPage();
        await embeddingPage.loadScripts();

        // Embed document consumption page
        await embeddingPage.createDocConsumptionPage();
        // await embeddingPage.createEnvironment();
        await embeddingPage.waitForItemLoading();
        console.log('login ...');
        await loginPage.login(loginConfig);
        // Wait for the library page to load
        await loginPage.waitForLibraryLoading();

        // step 2: Click the widget selection checkbox
        await rsdPage.clickWidgetSelectionCheckbox('K44');


        // step 3: Log the component selection events
        await embeddingPage.switchToParentFrame();
        const events = await browser.execute(() => window.componentSelectionEvents);
        // console.log('componentSelectionEvents:', JSON.stringify(events, null, 2));

        // step 4: Validate the component selection event
        await since('Should have exactly one event')
            .expect(events.length)
            .toBe(1);

        const event = events[0];
        await since('Event objectId should match')
            .expect(event.objectId)
            .toBe('FF620C2A674C166CCF588691C46E00E2');

        await since('Event objectType should be document')
            .expect(event.objectType)
            .toBe('document');

        await since('Event projectId should match')
            .expect(event.projectId)
            .toBe('B19DEDCC11D4E0EFC000EB9495D0F44F');

        await since('Should have exactly one selected component')
            .expect(event.selectedComponents.length)
            .toBe(1);

        const selectedComponent = event.selectedComponents[0];
        await since('Selected component key should be K44')
            .expect(selectedComponent.key)
            .toBe('K44');

        await since('Selected component layoutKey should be K3')
            .expect(selectedComponent.layoutKey)
            .toBe('K3');

        await since('Selected component type should be grid')
            .expect(selectedComponent.type)
            .toBe('grid');

        await since('Selected component should have dimension')
            .expect(selectedComponent.dimension)
            .toBeDefined();

        await since('Selected component should have position')
            .expect(selectedComponent.position)
            .toBeDefined();

    });
});
