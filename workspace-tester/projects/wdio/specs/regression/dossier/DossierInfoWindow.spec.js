import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_PS') };

describe('Dossier Info Window', () => {
    const dossier = {
        id: '17B2E6F245FF28144CF89881EC901E71',
        name: 'IW Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let { loginPage, dossierPage, libraryPage, grid, textbox, imageContainer, lineChart, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize({
            
            width: 1600,
            height: 1200,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80480] Validate dossier information window rendering in Library Web', async () => {
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'trigger from grid',
            headerName: 'Call Center',
            elementName: 'San Diego',
        });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from grid, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-triggerfromgrid'))
            .toBe(true);

        // Close IW
        await grid.selectGridElement({
            title: 'trigger from grid',
            headerName: 'Call Center',
            elementName: 'San Diego',
        });
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.waitForDossierLoading();
        await since('Close IW from grid, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW-triggerfromgrid'))
            .toBe(false);

        // Switch to panel 2
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await dossierPage.waitForInfoWindowLoading();
        // Trigger IW from viz
        await lineChart.clickElement({ vizName: 'Trigger from viz', eleName: 'Electronics', lineName: '2015' });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from viz, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-trigger from viz'))
            .toBe(true);
        await since('Trigger IW from viz, the IW should appear')
            .expect(await grid.isVizDisplayed('Visualization 2'))
            .toBe(true);

        // Close IW
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await since('Close IW from viz, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW-trigger from viz'))
            .toBe(false);
        await since('Close IW from viz, the IW should not appear')
            .expect(await grid.isVizDisplayed('Visualization 2'))
            .toBe(false);

        // Switch to freeform layout chapter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        // Trigger IW from text
        await textbox.navigateLink(0);
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from text, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-trigger from text'))
            .toBe(true);

        // Close IW
        await dossierPage.clickDossierPanelStackSwitchTab('targetpanel-1');
        await since('Close IW from text, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW-trigger from text'))
            .toBe(false);

        // Trigger IW from image
        await imageContainer.navigateLinkInCurrentPage(0);
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from image, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-trigger from image'))
            .toBe(true);

        // Close IW
        await dossierPage.clickDossierPanelStackSwitchTab('targetpanel-1');
        await since('Close IW from image, the IW should not appear')
            .expect(await grid.isVizDisplayed('IW-trigger from image'))
            .toBe(false);
    });

    it('[TC80481] Validate dossier information window manipulation in Library Web', async () => {
        // Trigger IW from grid
        await grid.selectGridElement({
            title: 'trigger from grid',
            headerName: 'Call Center',
            elementName: 'San Diego',
        });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from grid, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-triggerfromgrid'))
            .toBe(true);
        await grid.selectGridElement({
            title: 'IW-triggerfromgrid',
            headerName: 'Year',
            elementName: '2016',
        });
        await grid.selectGridContextMenuOption({
            title: 'IW-triggerfromgrid',
            headerName: 'Year',
            elementName: '2016',
            firstOption: 'Keep Only',
        });
        await since('The first element of Year attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'IW-triggerfromgrid', headerName: 'Year' }))
            .toBe('2016');
    });

    it('[TC80482] Validate dossier information window switching in Library Web', async () => {
        // Switch to panel 2
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await dossierPage.waitForInfoWindowLoading();
        // Trigger IW from viz
        await lineChart.clickElement({ vizName: 'Trigger from viz', eleName: 'Electronics', lineName: '2015' });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from viz, the IW should appear')
            .expect(await grid.isVizDisplayed('IW-trigger from viz'))
            .toBe(true);
        await since('Trigger IW from viz, the IW should appear')
            .expect(await grid.isVizDisplayed('Visualization 2'))
            .toBe(true);
        // Switch to Panel 1 copy in info window
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1 copy');
        await dossierPage.waitForInfoWindowLoading();
        await since('Switch IW to Panel 1 copy, the Visualization 1 should appear')
            .expect(await grid.isVizDisplayed('Visualization 1'))
            .toBe(true);
        await since('Switch IW to Panel 1 copy, the Visualization 2 should not appear')
            .expect(await grid.isVizDisplayed('Visualization 2'))
            .toBe(false);
    });
});

export const config = specConfiguration;
