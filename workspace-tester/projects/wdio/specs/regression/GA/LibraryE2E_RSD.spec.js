import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import RsdFilterPanel from '../../../pageObjects/document/RsdFilterPanel.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('RSD_E2E', () => {
    const document = {
        id: '5D74B6904FD2C3AF5CA780A04EDD09A3',
        name: 'E2E RSD',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, dossierPage, rsdGrid, panelStack, selectorObject, checkbox, listbox } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC82638] E2E - Validate object display in RSD', async () => {
        checkbox = selectorObject.checkbox;
        listbox = selectorObject.listbox;
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC82638_01', 'object display in RSD', {
            tolerance: 1.5,
        });

        const getPanelStack = panelStack.create('PanelStack 1');
        await getPanelStack.getTitle().clickRightArrow();
        await dossierPage.waitForDossierLoading();

        const grid = rsdGrid.getRsdGridByKey('W7742F728ED354105A9327A3A11BFE723');
        await since('The 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['2014', 'Books', '$510,239']);
        await checkbox.clickItems(['Books', 'Electronics']);
        await listbox.selectItemByText('2015');
        await dossierPage.waitForDossierLoading();
        await since('The 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 3))
            .toEqual(['2015', 'Electronics', '$6,610,260']);

        // Trigger info window from grid
        await grid.clickCell('2015');
        await dossierPage.waitForDossierLoading();

        const grid2 = rsdGrid.getRsdGridByKey('W0E1D546D8420403AA1587A51E96FDC73');
        await since('The 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 2))
            .toEqual(['2015', '$1,740,085']);

        await panelStack.closeInfoWindow();

        // Unset All Filters in filter panel
        const filterPanel = RsdFilterPanel.createbyName('Filtersbd6');
        await filterPanel.openAndChooseMenuByText('Unset All Filters');
        await since('The 3 cells of the 5th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(5, 1, 3))
            .toEqual(['2014', 'Music', '$912,395']);
    });
});
