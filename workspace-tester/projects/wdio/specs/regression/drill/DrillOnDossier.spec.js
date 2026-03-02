import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_drill') };
const { credentials } = specConfiguration;

describe('Drill On Dossier', () => {
    const dossier = {
        id: 'F81C1C8D4B3C4C3EACEF9799CFA916B9',
        name: 'Schema DataSouce Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, grid, libraryPage, pieChart } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await dossierPage.sleep(500);
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC68191_01] Drill on Grid | Drill from different entries - attribute header ', async () => {
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Year',
            firstOption: 'Drill',
            secondOption: 'Category',
        });
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Category' }))
            .toBe('Books');
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit Margin' }))
            .toBe('21.47%');
    });

    it('[TC68191_02] Drill on Grid | Drill from different entries - attribute element ', async () => {
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Call Center',
            elementName: 'Atlanta',
            firstOption: 'Drill',
            secondOption: 'Quarter',
        });
        since('The first element of Quarter should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Quarter' }))
            .toBe('2014 Q1');
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit Margin' }))
            .toBe('17.31%');
    });

    it('[TC68192] Drill on Graph | Drill from different entries - graph body', async () => {
        await pieChart.drillTo({ title: 'not all attribute-pie chart', slice: '2014', drillTarget: 'Country' });
        since('The slice count should be #{expected}, instead we have #{actual}')
            .expect(await pieChart.sliceCount('not all attribute-pie chart'))
            .toBe(2);
    });

    it('[TC68193] Dossier Drill |  Drill on customized drill map with general attributes', async () => {
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Year',
            firstOption: 'Drill',
            secondOption: 'Quarter',
        });
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Quarter' }))
            .toBe('2014 Q1');
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit Margin' }))
            .toBe('17.31%');
    });
});

export const config = specConfiguration;
