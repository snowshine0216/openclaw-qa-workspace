import setWindowSize from '../../../../config/setWindowSize.js';
import NativeEmbeddingPage from '../../../../pageObjects/embedding/NativeEmbeddingPage.js';
import * as embeddingConstants from '../../../../constants/embedding.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('Native Embedding SDK Test - InfoWindow', () => {
    let embeddingPage: NativeEmbeddingPage;
    const libraryUrl = browser.options.baseUrl as string;
    const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
    const loginConfig = embeddingConstants.adminUser;
    const tutorialProject = {
        id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
        name: 'Tutorial Project',
    };
    const infoWindowDashboard = {
        id: '3C84BDA802419C11131D37B41E361834',
        name: 'Info Window',
        project: tutorialProject,
    };
    const visKeys = ['K52', '72EECA0554FD4FB8B549AF59828041A8', 'W107', 'W81'];

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
            dossier: infoWindowDashboard,
        });
    });

    afterAll(async () => {
        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    // npm run regression -- --baseUrl=https://mci-h7kzr-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.browserName=chrome --params.locale=en-EN --tcList=TC99385_1
    it('[TC99385_1] Support info window in native embedding - Grid', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['K52']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Normal Grid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_1_1', 'Grid Info Window Panel 1');
        // Switch to panel 2
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_1_2', 'Grid Info Window Panel 2');
        // Close IW by clicking close button
        await dossierPage.closeInfoWindow();
        await takeScreenshot('TC99385_1_3', 'Close Info Window by clicking close button');
    });

    it('[TC99385_2] Support info window in native embedding - AG Grid', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['72EECA0554FD4FB8B549AF59828041A8']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'AG Grid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
            agGrid: true,
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_2_1', 'AG Grid Info Window');
        // Trigger IW by clicking another cell
        await grid.selectGridElement({
            title: 'AG Grid',
            headerName: 'Airline Name',
            elementName: 'US Airways Inc.',
            agGrid: true,
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_2_2', 'Trigger Info Window by clicking another cell');
    });

    it('[TC99385_3] Support info window in native embedding - Linechart', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['W107']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from viz
        await lineChart.clickElement({
            vizName: 'Line Chart',
            eleName: 'American Airlines Inc.',
            lineName: 'Flights Delayed',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_3_1', 'Linechart Info Window');
        // Close IW by clicking other area
        await lineChart.clickOnYAxis('Line Chart');
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_3_2', 'Close Info Window by clicking other area');
    });

    it('[TC99385_4] Support info window in native embedding - Image&Shape&Text', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['W81']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Image',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_4_1', 'Image Info Window');
        // Switch to panel "Shape"
        await dossierPage.clickDossierPanelStackSwitchTab('Shape');
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_4_2', 'Shape Info Window');
        // Switch to panel "Text"
        await dossierPage.clickDossierPanelStackSwitchTab('Text');
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_4_3', 'Text Info Window');
    });

    it('[TC99385_5] Support info window in native embedding - embedding vizs cross pages', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['K52', 'W107']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Normal Grid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // wait for 5s to ensure the IW is loaded
        await browser.pause(5000);
        // take screenshot
        await takeScreenshot('TC99385_5_1', 'Trigger IW for viz from page1');
        // Close IW by clicking close button
        await dossierPage.closeInfoWindow();
        await dossierPage.waitForDossierLoading();
        // Trigger IW from linechart
        await lineChart.clickElement({
            vizName: 'Line Chart',
            eleName: 'American Airlines Inc.',
            lineName: 'Flights Delayed',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99385_5_2', 'Trigger IW for viz from another page');
    });

    it('[TC99385_6] Support info window in native embedding - embedding vizs cross chapters', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['K52', 'W81']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Normal Grid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_6_1', 'Trigger IW for viz from chapter1');
        // Close IW by clicking close button
        await dossierPage.closeInfoWindow();
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Image',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshot('TC99385_6_2', 'Trigger IW for viz from another chapter');
    });

    it('[TC99385_7] Support info window in native embedding - manipulation in info window', async () => {
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(infoWindowDashboard.project.id, infoWindowDashboard.id);
        await embeddingPage.renderVisualizationsWithInfowindow(dossierKey, ['K52']);
        await dossierPage.waitForDossierLoading();
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'Normal Grid',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await grid.selectGridElement({
            title: '50 50',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
        });
        await grid.selectGridContextMenuOption({
            title: '50 50',
            headerName: 'Airline Name',
            elementName: 'AirTran Airways Corporation',
            firstOption: 'Exclude',
        });
        await dossierPage.waitForDossierLoading();
        // take screenshot
        await takeScreenshot('TC99385_7_1', 'Keep only in info window');
    });
});
