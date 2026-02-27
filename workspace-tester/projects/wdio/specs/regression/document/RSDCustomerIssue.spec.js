import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_CustomerIssue', () => {
    const document = {
        id: '02DA236E479A6F22D4837F81DD34DB16',
        name: 'TC60390',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: 'EACB5E2A4F291D5BA52948BE024837C6',
        name: 'TC40327',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: '791F7D08402A19769CA1EF9A64B2535A',
        name: 'TC57710',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3fitwidth = {
        id: '6EFFAA8D40629C1F4BBC558584EB061B',
        name: 'TC57710-fit width',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: 'C56BD7B44FB4B2C219DEFC8FA47CA87E',
        name: 'TC60593',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document5 = {
        id: '5FEE97A24945B31A39F79CB3310DF00C',
        name: 'I_D1_Elements_FixedInfoWindow',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document6 = {
        id: 'A45AECED415C46AF4B72988CB7677108',
        name: 'Restore_Opportunity',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document7 = {
        id: '31E6977E45D66B56AA9A528EC521E901',
        name: 'I_D8_S_Transaction',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document8 = {
        id: '6AD1C1A047C108435673D3908B10DF92',
        name: 'DE229951_TC83532',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document9 = {
        id: 'B9FF31794E73513CDD0780850B57F737',
        name: 'TC53347',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;
    let checkbox, dropdown, metricQualification;

    let { loginPage, libraryPage, dossierPage, rsdGrid, selectorObject, rsdGraph, transactionPage, panelStack } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80309] Verify the height of text field value for null is bigger than the value set in text field properties in library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80309', 'the height of text field value for null');
    });

    it('[TC80399] Validate open in a new window setting of Hyperlink on text/image can work well in library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80399_01', 'rsd with Hyperlink on text/image');

        // Click link that run document in new window
        await dossierPage.clickTextfieldByTitle('open in a new window');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80399_02', 'open rsd in new window');
        await dossierPage.closeTab(1);

        // Click link that open URL in new window
        await dossierPage.clickImageLinkByTitle('Hyperlink2');
        await dossierPage.switchToTab(1);
        let currentUrl = await browser.getUrl();
        await since('Library home page: Url should contain config id').expect(currentUrl.includes('bing')).toBe(true);
        await dossierPage.closeTab(1);

        // Click link that run document in current window
        await dossierPage.clickImageLinkByTitle('Hyperlink1');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80399_03', 'open rsd in current window');
        await dossierPage.goBackFromDossierLink();

        // Click link that run URL in current window
        let url = await browser.getUrl();
        console.log(url);
        await dossierPage.clickTextfieldByTitle('open in the current window');
        let currentUrl2 = await browser.getUrl();
        await since('Library home page: Url should contain config id').expect(currentUrl2.includes('bing')).toBe(true);
        await browser.url(url);
        await libraryPage.waitForItemLoading();
    });

    it('[TC80419] Verify Dashboard from mpp file render correctly if browser zoom is set to Fit Width/Page.', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document3fitwidth,
        });
        await libraryPage.openDossier(document3.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80419_01', 'rsd with fit page');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document3fitwidth.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80419_02', 'rsd with fit width');
    });

    it("[TC80420] Verify nested information window (panel stack) doesn't float after re-opening for a second time", async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        await dossierPage.clickTextfieldByTitle('target Panel1');
        await dossierPage.clickTextfieldByTitle('target panel49');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80420_01', 'nested information window');
        // Close nested info Window
        await panelStack.closeInfoWindow();
        await dossierPage.clickTextfieldByTitle('target Panel1');
        await dossierPage.clickTextfieldByTitle('target panel49');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80420_02', 'open nested information window again');
    });

    it('[TC80421] Validate Information window display correctly in all screen sizes', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document5.name);

        const graph = rsdGraph.findGraphByIdContains('kW54');
        await graph.clickOnRectArea(['Northeast', '2016']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_01', 'IW trigger from graph', {
            tolerance: 0.5,
        });

        await setWindowSize({
            width: 1360,
            height: 768,
        });

        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('Central');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_02', 'IW trigger from grid', { tolerance: 1 });

        await setWindowSize({
            width: 1280,
            height: 720,
        });

        await dossierPage.clickTextfieldByTitle('Text');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_03', 'IW trigger from text', {
            tolerance: 1.1,
        });

        await grid.clickCell('Mid-Atlantic');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_04', 'IW trigger from grid', {
            tolerance: 1.1,
        });

        await setWindowSize({
            width: 1680,
            height: 1050,
        });

        await dossierPage.clickBtnByTitle('Button');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_05', 'IW trigger from button', {
            tolerance: 0.6,
        });

        await dossierPage.clickImageLinkByTitle('Image');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80421_06', 'IW trigger from image', {
            tolerance: 0.6,
        });
    });

    it('[TC80422] Validate Transaction in information window', async () => {
        await setWindowSize({
            width: 1600,
            height: 1200,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document6.name);
        await transactionPage.submitChanges();
        await transactionPage.goToLibrary();

        await libraryPage.openDossier(document7.name);
        await dossierPage.clickTextfieldByTitle('Open Info Window');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80422_01', 'IW of Transaction');
        await transactionPage.inputTextFieldByKey('IGK267', 'Update Opportunity name');
        await transactionPage.inputTextFieldByKey('IGK270', 'Update Opportunity description');
        await transactionPage.inputTextFieldByKey('IGK279', 'Update Competitor');
        await transactionPage.inputTextFieldByKey('IGK306', 'New Action Description');
        await transactionPage.list.selectListItem('Commit');
        await transactionPage.submitChanges();
        const alert = transactionPage.alert;
        await alert.clickOnButtonByName('OK', 3000);
        await libraryPage.waitForItemLoading();
        // Validate Transaction update
        await dossierPage.clickTextfieldByTitle('Open Info Window');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80422_02', 'Update in Transaction', {
            tolerance: 0.5,
        });
        const grid = rsdGrid.getRsdGridByKey('W838');
        const regressionData = ['8', 'New Action Description', 'Commit'];
        const actualData = await grid.selectCellInOneRow(9, 2, 4);
        const cellPresent = await grid.isGridCellInRowPresent(9, 1);
        await since('The last 3 cells of the 9th row in grid should be #{expected}, instead we get #{actual}')
            .expect(actualData === regressionData || cellPresent)
            .toEqual(true);
    });

    it('[TC83531] Validate document with section condition format Hide section when meet threshold condition', async () => {
        checkbox = selectorObject.checkbox;
        await setWindowSize({
            width: 1600,
            height: 1200,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document8,
        });
        await libraryPage.openDossier(document8.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83531_01', 'Only green condition', {
            tolerance: 0.2,
        });
        await checkbox.clickItems(['2014 Q1']);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83531_02', 'Show blue/red, hide green condition', {
            tolerance: 0.2,
        });
        await checkbox.clickItems(['2014 Q2']);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83531_03', 'Show blue/red/green condition', {
            tolerance: 0.2,
        });
    });

    it('[TC83532] Validate conditional formatting hide text/image when meet condition', async () => {
        checkbox = selectorObject.checkbox;

        await setWindowSize({
            width: 1600,
            height: 1200,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document8,
        });
        await libraryPage.openDossier(document8.name);
        await checkbox.clickItems(['2014 Q1', '2014 Q2', '2014 Q3']);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83532_01', 'Hide button', { tolerance: 0.2 });
        await checkbox.clickItems(['2014 Q4']);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83532_02', 'Show button', { tolerance: 0.2 });
    });

    it('[TC83532_02] Validate RSD with Different Shrink Setting', async () => {
        dropdown = selectorObject.dropdown;
        metricQualification = selectorObject.metricQualification;
        await resetDossierState({
            credentials: credentials,
            dossier: document9,
        });
        await libraryPage.openDossier(document9.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83532_03', 'Fit Page in Customer Object', {
            tolerance: 0.2,
        });
        await dossierPage.clickBtnByTitle('Article Filters Jan 2014');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC83532_04', 'IW for ArticleFilter', {
            tolerance: 0.2,
        });
        await metricQualification.inputValue('100000');
        await metricQualification.apply();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Feb 2014');
        const grid = rsdGrid.getRsdGridByKey('W1195');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 2))
            .toEqual(['Feb 2014', '$107,289']);
    });
});

export const config = specConfiguration;
