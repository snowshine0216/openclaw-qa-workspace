import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };
const { credentials } = specConfiguration;

describe('RSD_InfoWindowIssue', () => {
    const document = {
        id: '005156BC43664D4CE1B6588491CF8D0E',
        name: 'Multi Nested IW - library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: 'BA4C56C94D389B89FFD37286AED0E0C1',
        name: 'DE173407',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let listbox;

    let { loginPage, libraryPage, dossierPage, selectorObject, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        listbox = selectorObject.listbox;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC78912_01] Validate open and close multi nested and circular information window in RSD on library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });

        await libraryPage.openDossier(document.name);
        // Open red info window
        await dossierPage.clickTextfieldByTitle('i');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        const redGrid = rsdGrid.getRsdGridByKey('KDB39C640456B2E8AFE79FF9C4E220F42');

        // Open green info window
        await redGrid.clickCell('Books');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        const greenGrid = rsdGrid.getRsdGridByKey('K13E932DF4FBA3405A50E8B8EC0D7476F');
        await since('The first 2 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await greenGrid.selectCellInOneRow(3, 1, 2))
            .toEqual(['Business', '$311,597']);

        // Open yellow info window
        await greenGrid.clickCell('Literature');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        const yellowGrid = rsdGrid.getRsdGridByKey('K77D06C8C44FFA5CF65AD8AB7FE026286');
        await since('The first 2 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await yellowGrid.selectCellInOneRow(4, 1, 2))
            .toEqual(['Ayn Rand', '$28,068']);

        // Back to green info window
        await dossierPage.clickTextfieldByTitle('Back2');
        await dossierPage.waitForDossierLoading();
        // Back to red info window
        await dossierPage.clickTextfieldByTitle('Back');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC78912_01', 'three IW');

        // Close 2 Info wondow
        await redGrid.clickCell('Movies');
        await dossierPage.waitForInfoWindowLoading();
        await dossierPage.clickTextfieldByTitle('i');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('i');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC78912_02', 'one IW');
    });

    it('[TC78912_02] Validate open and close multi nested and circular information window in RSD on library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });

        await libraryPage.openDossier(document2.name);
        const grid = rsdGrid.getRsdGridByKey('W168C3C88F4104A5BAE055E274DBA1E49');

        // Open info window from grid
        await grid.clickCell('South');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        const targetGrid = rsdGrid.getRsdGridByKey('W8F31E15A063B490A88F1BF814AD7A549');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await targetGrid.selectCellInOneRow(2, 1, 2))
            .toEqual(['2014', '2014 Q1']);

        // Change selector in info window
        await dossierPage.clickImageLinkByTitle('Imaged76');
        await listbox.selectItemByText('2015');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await targetGrid.selectCellInOneRow(2, 1, 2))
            .toEqual(['2015', '2015 Q1']);

        // Sort in target grid
        await targetGrid.selectContextMenuOnCell('Quarter', 'Sort Descending');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await targetGrid.selectCellInOneRow(2, 1, 2))
            .toEqual(['2015', '2015 Q4']);

        // Change selector in info window
        await dossierPage.clickImageLinkByTitle('Imaged76');
        await listbox.selectItemByText('2016');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await targetGrid.selectCellInOneRow(2, 1, 2))
            .toEqual(['2016', '2016 Q4']);
    });
});

export const config = specConfiguration;
