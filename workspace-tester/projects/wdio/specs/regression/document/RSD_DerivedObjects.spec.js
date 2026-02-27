import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_DerivedObjects', () => {
    const document = {
        id: '3F447EC14818B1F730346FAAACD8C310',
        name: 'R1 Derived Metrics on RSD from R and new',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '3D93C5804706471F16D9C19CB2D415C2',
        name: 'R2 Derived Elements Format',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: '8595E5D749B2E0D7865E24AA77E16AA9',
        name: 'R3 DE Group Selection',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: '220528C044EE1B06081F08A426573AF5',
        name: 'R3 DE Group Selection-graph',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document5 = {
        id: '05D2C25F49744CA89D001B84CD31162D',
        name: 'R4 DM Logical formula',
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

    let { loginPage, libraryPage, dossierPage, rsdGrid, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80435] Validate Derived Metrics on RSD from R and new', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Electronics', '17.59%', '21%']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80435', 'rsd with Derived Metrics');
    });

    it('[TC80438] Validate Derived Elements Format', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        let grid = rsdGrid.getRsdGridByKey('K53');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['20K-30K', '$247,427', '$213,459']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80438_01', 'rsd with Derived Elements Format', {
            tolerance: 0.6,
        });
        await transactionPage.groupBy.changeGroupBy('2014');
        grid = rsdGrid.getRsdGridByKey('K53');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['20K-30K', '$174,164', '$150,361']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80438_02', 'change groupby to 2014', {
            tolerance: 0.6,
        });
    });

    it('[TC80439] Validate Derived Elements Group Selection', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        let grid = rsdGrid.getRsdGridByKey('K53');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['20K and Under', '$115,841', '501']);
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC80439_01',
            'rsd with Derived Elements Group Selection',
            { tolerance: 0.9 }
        );
        await transactionPage.groupBy.changeGroupBy('2015');
        grid = rsdGrid.getRsdGridByKey('K53');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['20K and Under', '$163,567', '676']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80439_02', 'change groupby to 2015', {
            tolerance: 0.9,
        });
    });

    it('[TC80441] Validate Derived Elements Group Selection with graph mode', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC80441_01',
            'rsd with Derived Elements Group Selection with graph mode'
        );
        await transactionPage.groupBy.changeGroupBy('2015');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80441_02', 'change groupby to 2015');
        await transactionPage.groupBy.changeGroupBy('2016');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80441_03', 'change groupby to 2016');
        await transactionPage.groupBy.changeGroupBy('2015');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80441_04', 'change groupby to 2015');
    });

    it('[TC80440] Validate Derived Metrics Logical formula', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document5.name);
        let grid = rsdGrid.getRsdGridByKey('K54');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Business', '0', '$1,410']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80440', 'rsd with Derived Metrics Logical formula', {
            tolerance: 1,
        });
        await transactionPage.groupBy.changeGroupBy('Movies');
        grid = rsdGrid.getRsdGridByKey('K54');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Comedy', '0', '$739']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80440', 'change groupby to movies', {
            tolerance: 1,
        });
        await transactionPage.groupBy.changeGroupBy('Total');
        grid = rsdGrid.getRsdGridByKey('K54');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Business', '0', '$1,410']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC80440', 'change groupby to total', { tolerance: 1 });
    });
});

export const config = specConfiguration;
