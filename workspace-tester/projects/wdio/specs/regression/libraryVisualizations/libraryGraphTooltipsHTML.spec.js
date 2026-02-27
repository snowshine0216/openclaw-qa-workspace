import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('libraryGraphTooltipsHTML', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        CustomMsgDoc_ContentOn: {
            id: 'FE49062341098E04A9C158B15A0D6DCC',
            name: 'CustomMsgDoc_ContentOn',
        },
        DocGraphTooltip_ContentOn: {
            id: 'A91D7189401134C1F3ABB4A2BAE8EE64',
            name: 'DocGraphTooltip_ContentOn',
        },
        DocGraphTooltip_ContentOff_NoHTML: {
            id: 'A91D7189401134C1F3ABB4A2BAE8EE64',
            name: 'DocGraphTooltip_ContentOff_NoHTML',
        },
        DocGraphTooltip_ContentOff_OneHTML1: {
            id: '30F8231E43430D292FBD04A74F196FCE',
            name: 'DocGraphTooltip_ContentOff_OneHTML1',
        },
        testName: 'libraryGraphTooltipsHTML',
    };

    let { loginPage, libraryPage, rsdGraph } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.noHTML.credentials);
        await setWindowSize(browserWindowCustom);
        await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93376] Acceptance | Library | Verify the display of Graph tooltips with granular HTML control. ', async () => {
        // Check Tooltip, RMC context menu for Grid in Bot, Snapshot.
        await libraryPage.openUrlAndCancelAddToLibrary(
            testObjectInfo.project.id,
            testObjectInfo.CustomMsgDoc_ContentOn.id
        );
        await checkElementByImageComparison(rsdGraph.getGraph(1), 'TC93376', '00_CustomMsgDoc_ContentOn', 1);
        await libraryPage.openUrlAndCancelAddToLibrary(
            testObjectInfo.project.id,
            testObjectInfo.DocGraphTooltip_ContentOn.id
        );
        await rsdGraph.clickGraphCell(1, '20000');
        await checkElementByImageComparison(rsdGraph.getGraph(1), 'TC93376', '01_CustomMsgDoc_ContentOn', 1);
        await logoutFromCurrentBrowser();

        // await loginPage.login(consts.oneHTML1.credentials);
        // await libraryPage.openUrlAndCancelAddToLibrary(
        //     testObjectInfo.project.id,
        //     testObjectInfo.DocGraphTooltip_ContentOff_NoHTML.id
        // );
        // await rsdGraph.clickOnRectArea('Value: 20000');
        // await checkElementByImageComparison(
        //     rsdGraph.getGraph(1),
        //     'TC93376',
        //     '02_DocGraphTooltip_ContentOff_NoHTML_NotPOC_No',
        //     1
        // );
        // await libraryPage.openUrlAndCancelAddToLibrary(
        //     testObjectInfo.project.id,
        //     testObjectInfo.DocGraphTooltip_ContentOff_OneHTML1.id
        // );
        // await rsdGraph.clickOnRectArea('Value: 20000');
        // await checkElementByImageComparison(
        //     rsdGraph.getGraph(1),
        //     'TC93376',
        //     '03_DocGraphTooltip_ContentOff_OneHTML1_POC_Yes',
        //     1
        // );
    });
});
