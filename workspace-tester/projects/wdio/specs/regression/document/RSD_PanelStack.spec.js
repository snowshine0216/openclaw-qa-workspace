import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_PanelStack', () => {
    const document = {
        id: '6A4414FF44C0D12E1F26FBB21F7431BF',
        name: 'P_D1_Elements',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '1301FF8F4A4EB9921D28BB81B90440AB',
        name: 'P_D2_Selectors',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: 'DAF593D947707CB917F068A919256EDD',
        name: 'P_D2_Selectors_Threshold',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: '70ACFE34442A6D34FE8EA2885C2CA1F8',
        name: 'P_D3_Preload_current_only',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentFormat = {
        id: '48F4DEFC403C7CFAA87EF79E3BC4D12A',
        name: 'P_D1_Elements_FormatAndProperty',
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

    let linkbar, dropdown, checkbox, radiobutton;

    let { loginPage, libraryPage, dossierPage, selectorObject, rsdGrid, panelStack } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC74249_01] Validate multi panel with multi elements', async () => {
        dropdown = selectorObject.dropdown;
        checkbox = selectorObject.checkbox;
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_01', 'First panel');
        // Switch to second panel
        const getPanelStack = panelStack.create('Panel Stack45');
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_02', 'Second panel');
        // Open information window from button
        await dossierPage.clickBtnByTitle('Button');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_03', 'IW in second panel');
        await panelStack.closeInfoWindow();
        // Switch to third panel
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_04', 'Third panel');
        // Switch to fourth panel
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_05', 'Fourth panel');
        await dropdown.openDropdown();
        await dropdown.selectItemByText('2014');
        await checkbox.clickItems(['Central', 'Mid-Atlantic', 'Web']);
        let grid = rsdGrid.getRsdGridByKey('W63');
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['Central', 'Books', 'Art & Architecture']);
        await grid.scrollInGridToBottom();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_06', 'Fourth panel after select');
        // Switch to fifth panel
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_07', 'Fifth panel', { tolerance: 0.51 });
        // Switch back
        await getPanelStack.getTitle().clickLeftArrow();
        await getPanelStack.getTitle().clickLeftArrow();
        await getPanelStack.getTitle().clickLeftArrow();
        await dossierPage.clickBtnByTitle('Button');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_08', 'IW in second panel after switch back');
        await panelStack.closeInfoWindow();
        // Switch forth again
        await getPanelStack.getTitle().clickRightArrow();
        await getPanelStack.getTitle().clickRightArrow();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('2015');
        await checkbox.clickItems(['Central', 'South', 'Web']);
        grid = rsdGrid.getRsdGridByKey('W63');
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['South', 'Books', 'Art & Architecture']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_09', 'Fourth panel after switch and select');
    });

    it('[TC74249_02] Validate multi panel with selectors', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        // Select South in dropdown selector
        const dropdownselector = selectorObject.getDropDownById('W56');
        await dropdownselector.openDropdown();
        await dropdownselector.selectItemByText('South');
        const grid = rsdGrid.getRsdGridByKey('W53');
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['South', '$101,248', '201301']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_10', 'Panel47 with south only');
        // Switch to Panel70 using button selector
        const buttonselector = selectorObject.getButtonbarByName('Selector120');
        await buttonselector.selectItemByText('Panel70');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_11', 'Panel70 with south only');
        // Switch to Panel162 using button selector
        const buttonselector2 = selectorObject.getButtonbarByName('Selector125');
        await buttonselector2.selectItemByText('Panel62');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_12', 'Panel62 with south only');
        // Switch to Panel54 using dropdown selector
        const dropdownselector2 = selectorObject.getDropDownById('W59');
        await dropdownselector2.openDropdown();
        await dropdownselector2.selectItemByText('Panel54');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_13', 'Panel54 with south only');
    });

    it('[TC74249_03] Validate multi panel with selectors and threshold', async () => {
        checkbox = selectorObject.checkbox;
        linkbar = selectorObject.linkbar;
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        // Select 2014 only
        await checkbox.clickItems(['2014', '2015']);
        const grid = rsdGrid.getRsdGridByKey('W56');
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['2014', '7,343,097', '$1,304,141']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_14', 'Daily panel with 2014 only');
        // Switch to Weekly panel and select 2015 only
        await linkbar.selectItemByText('Weekly');
        await checkbox.clickItems(['2014', '2015']);
        const grid2 = rsdGrid.getRsdGridByKey('W55');
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 3))
            .toEqual(['2015', '9,777,521', '$1,740,085']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_15', 'Weekly panel with 2015 only');
        // Select no data
        await checkbox.clickItems(['2015']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_16', 'Weekly panel with no data', {
            tolerance: 0.15,
        });
        const getPanelStack = panelStack.create('Panel Stack49');
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_17', 'Daily panel with no data', {
            tolerance: 0.15,
        });
    });

    it('[TC74249_04] Validate multi panel with information window', async () => {
        radiobutton = selectorObject.radiobutton;
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_18', 'Panel46');
        // Open information window from image
        await dossierPage.clickImageLinkByTitle('Image60');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_19', 'IW in second panel');
        await panelStack.closeInfoWindow();
        // Switch to Panel1 using radiobutton selecttor
        await radiobutton.selectNthItem(1, 'Panel1');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_20', 'Panel1');
        // Open information window from image
        await dossierPage.clickImageLinkByTitle('Image50');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_21', 'IW in first panel');
        await panelStack.closeInfoWindow();
        // Switch to Panel47 using radiobutton selecttor
        await radiobutton.selectNthItem(3, 'Panel47');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_22', 'Panel47');
        // Open information window from image
        await dossierPage.clickImageLinkByTitle('Image78');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_23', 'IW in third panel');
        await panelStack.closeInfoWindow();
        // Switch back to panel46
        const getPanelStack = panelStack.create('PanelStack 1');
        await getPanelStack.getTitle().clickLeftArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_24', 'Panel46 by switch back');
        // Open information window from image
        await dossierPage.clickImageLinkByTitle('Image60');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_25', 'IW in second panel by switch back');
        await panelStack.closeInfoWindow();
    });

    it('[TC80303] Validate panel stack with different format and properties', async () => {
        dropdown = selectorObject.dropdown;
        await resetDossierState({
            credentials: credentials,
            dossier: documentFormat,
        });
        await libraryPage.openDossier(documentFormat.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_26', 'Initial render');

        const getPanelStack = panelStack.create('PanelStackEffects');
        // Switch to Panel48 using dropdown selecttor
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Panel48');
        await getPanelStack.getTitle().clickRightArrow();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_27', 'Panel48');
        // hover on the panel stack to check tooltip
        await panelStack.hoverOnPanelstack('PanelStackEffects');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74249_27', 'tooltip');
    });
});

export const config = specConfiguration;
