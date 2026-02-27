import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import RsdFilterPanel from '../../../pageObjects/document/RsdFilterPanel.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };
const { credentials } = specConfiguration;

describe('RSD_PanelStackIssue', () => {
    const documentFitWidth = {
        id: 'C2422BD24E87272DC13737AF5EB74492',
        name: 'TC59587 - fit width',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentFitPage = {
        id: 'B74D504A4684BEFB1F6DA68F0FA0BDC1',
        name: 'TC59587 - fit page',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentZoom75 = {
        id: '47791B0548D892D3C5A662A97C7AB60D',
        name: 'TC59587 - 75%',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentZoom150 = {
        id: '3A721D52437095705B68F78A699A0A55',
        name: 'TC59587 - 150%',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentZoom300 = {
        id: 'D7DF2C4A49C9978754C698B2F0D7906B',
        name: 'TC59587 - 300%',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'CE7085CC488315D60B0B579E45E31794',
        name: 'TC59587',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentTC2906 = {
        id: '9E444BD344E9DDE5D4AEEEA2FF5B6230',
        name: 'TC2906',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let checkbox;

    let { loginPage, libraryPage, dossierPage, selectorObject, panelStack } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        checkbox = selectorObject.checkbox;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80308_01]Verify vertical scroll bar is not added for the button "Unset" and "apply" in Filter Panel - fit page', async () => {
        //fit to page
        await resetDossierState({
            credentials: credentials,
            dossier: documentFitPage,
        });

        await libraryPage.openDossier(documentFitPage.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80308_01', 'fit page');
        // Uncheck first item "Central" and Apply
        //  a. Data is filtered according to selection
        //  b. Check: Take a scrrenshot "DefaultZoomSelection_FitPage_Apply_NoVerticalScrollbars"
        const filterPanel = RsdFilterPanel.createbyName('FilterPanel');
        await checkbox.clickItems(['Central', 'South']);
        await filterPanel.clickApply();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TTC80308_01',
            'DefaultZoomSelection_FitPage_Apply_NoVerticalScrollbars'
        );
    });

    it('[TC80308_02] Verify vertical scroll bar is not added for the button "Unset" and "apply" in Filter Panel - fit width', async () => {
        //  "Fit Width"
        //  a. Unset/Apply buttons adjust to new size and no extra scrollbar appear on the buttons area
        //  b. Check: Take a scrrenshot "ZoomSelection_FitWidth_NoVerticalScrollbars"
        // fit to width
        await resetDossierState({
            credentials: credentials,
            dossier: documentFitWidth,
        });

        await libraryPage.openDossier(documentFitWidth.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80308_02', 'fit width');

        // Resize the browser window
        //  a. Unset/Apply buttons adjust to new size and no extra scrollbar appear on the buttons area
        //  b. Check: Take a scrrenshot "ZoomSelection_FitWidth_SmallWin_NoVerticalScrollbars"
        await setWindowSize({
            width: 500,
            height: 300,
        });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC80308_02',
            'ZoomSelection_FitWidth_SmallWin_NoVerticalScrollbars',
            { tolerance: 0.6 }
        );
        // Uncheck the third item "Northeast" and Unset
        //  a. Selection is cleared
        //  b. Check: Take a scrrenshot "ZoomSelection_FitWidth_SmallWin_Unset_NoVerticalScrollbars"
        const filterPanel = RsdFilterPanel.createbyName('FilterPanel');
        await checkbox.clickItemByText('Northeast');
        await filterPanel.clickUnset();
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC80308_02',
            'ZoomSelection_FitWidth_SmallWin_Unset_NoVerticalScrollbars',
            { tolerance: 0.6 }
        );
    });

    it('[TC80308_03]Verify vertical scroll bar is not added for the button "Unset" and "apply" in Filter Panel - 75%, 150%, 300%', async () => {
        //zoom to 75%
        await resetDossierState({
            credentials: credentials,
            dossier: documentZoom75,
        });

        await libraryPage.openDossier(documentZoom75.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80308_03', 'zoom 75%');
        await dossierPage.goToLibrary();

        //zoom to 150
        await resetDossierState({
            credentials: credentials,
            dossier: documentZoom150,
        });

        await libraryPage.openDossier(documentZoom150.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80308_03', 'zoom 150%', { tolerance: 0.2 });
        await dossierPage.goToLibrary();

        //zoom to 300
        await resetDossierState({
            credentials: credentials,
            dossier: documentZoom300,
        });

        await libraryPage.openDossier(documentZoom300.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80308_03', 'zoom 300%', { tolerance: 0.6 });
    });

    it('[TC59587]Verify vertical scroll bar is not added for the button "Unset" and "apply" in Filter Panel', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentTC2906,
        });

        await libraryPage.openDossier(documentTC2906.name);

        const panelStackNoClip = panelStack.create('PanelStack 1');
        await since('Panel stack > Properties and Formatting > Layout > Content Overflow > Scroll')
            .expect(await panelStackNoClip.hasPanelScrollBar('K34'))
            .toBe(true);

        const panelStackClip = panelStack.create('Panel Stack3f1');
        await since('Panel stack > Properties and Formatting > Layout > Content Overflow > Clip')
            .expect(await panelStackClip.hasPanelScrollBar('KD3F69C1742A42F71066A89A3529446CA'))
            .toBe(false);
    });
});

export const config = specConfiguration;
