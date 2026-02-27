import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_drill') };
const { credentials } = specConfiguration;

describe('Drill X Func', () => {
    const drillExternal = {
        id: 'BA4873E54EDAD708B51C6183AC0311FF',
        name: 'Document with external dataset',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const customDossier = {
        id: 'D0ED6E2B437E7D6B5DFEFC97AA7082E3',
        name: 'Dossier with custom group',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const customRsd = {
        id: '231CDFE24D3567CB9175DAA2E84B8D21',
        name: 'Document with custom group',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const templateRsd = {
        id: '90F2DD15448C0B45773A99BC19F289E2',
        name: 'Document with different grid template',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier = {
        id: 'F81C1C8D4B3C4C3EACEF9799CFA916B9',
        name: 'Schema DataSouce Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, dossierPage, rsdGrid, grid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC68201_01] Drill X-Func |  Drill from external dataset - Attribute header', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: drillExternal,
        });
        //Drill on header
        await libraryPage.openDossier(drillExternal.name);
        const grid1 = rsdGrid.getRsdGridByKey('K96F81D7345A39AF40FA63CA348453666');
        await grid1.selectContextMenuOnCell('Transaction Date', ['Drill', 'System hierarchy', 'Stock ID']);
        since('The RSD Cell value should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData('1'))
            .toEqual([
                'Stock ID',
                'Exchange',
                'Metrics',
                'Clinch a Deal the Quantity',
                'Clinch a Deal Amount',
                'Maximum Transaction Price',
                'Minimum Transaction Price',
            ]);
        since('The RSD Cell value should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData('2'))
            .toEqual(['000001-SZE', 'SZE', '78643518', '971222474.19', '12.73', '12.36']);
    });

    it('[TC68201_02] Drill X-Func |  Drill from external dataset - Attribute Element', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: drillExternal,
        });
        //Drill on Element
        await libraryPage.openDossier(drillExternal.name);
        const grid1 = rsdGrid.getRsdGridByKey('K96F81D7345A39AF40FA63CA348453666');
        await grid1.selectContextMenuOnCell('Exchange', ['Drill', 'System hierarchy', 'Stock ID']);
        since('The RSD Cell value should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData('1'))
            .toEqual([
                'Transaction Date',
                'Stock ID',
                'Metrics',
                'Clinch a Deal the Quantity',
                'Clinch a Deal Amount',
                'Maximum Transaction Price',
                'Minimum Transaction Price',
            ]);
        since('The RSD Cell value should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData('2'))
            .toEqual(['2019-05-20', '000001-SZE', '78643518', '971222474.19', '12.54', '12.25']);
    });

    it('[TC68202_01] Drill X-Func |  Drill on custom group - Dossier with custom group attribute header', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: customDossier,
        });
        await libraryPage.openDossier(customDossier.name);
        // drill on attribute header
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Country Custom Group',
            firstOption: 'Drill',
            secondOption: 'Country',
        });

        since('The first element of Country should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Country' }))
            .toEqual('USA');
        since('The first element of Profit attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit' }))
            .toEqual('$2,416,590');
    });

    it('[TC68202_02] Drill X-Func |  Drill on custom group - Dossier with custom group - attribute element', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: customDossier,
        });
        await libraryPage.openDossier(customDossier.name);
        // drill on attribute element
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Country Custom Group',
            elementName: 'Some Country',
            firstOption: 'Drill',
            secondOption: 'Country',
        });
        since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('not all attribute-grid'))
            .toEqual(2);
        since('The first element of Country should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Country' }))
            .toEqual('USA');
        since('The first element of Profit attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit' }))
            .toEqual('$2,416,590');
    });

    it('[TC68202_03] Drill X-Func |  Drill on custom group - Document with custom group ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: customRsd,
        });
        await libraryPage.openDossier(customRsd.name);

        const grid = rsdGrid.getRsdGridByKey('W6B9C669BFBD2483BB9AA14BEDF5DC64F');
        since('The Attribute header drill allowed should be #{expected}, instead we have #{actual}')
            .expect(await grid.isCellClickable('Country Custom Group'))
            .toBe(false);
        await grid.selectContextMenuOnCell('Some Country', ['Drill', 'Country']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Year', 'Quarter', 'Country', 'Metrics', 'Revenue', 'Cost', 'Profit']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2014', '2014 Q1', 'USA', '$3,129,746', '$2,576,361', '$553,385']);
    });

    it('[TC68203_01] Drill X-Func |  Drill and view filter - Drill on Atrribute header ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Year',
            firstOption: 'Drill',
            secondOption: 'Quarter',
        });
        since('The View filter exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isViewFilterPresent('not all attribute-grid'))
            .toBe(false);
    });

    it('[TC68203_02] Drill X-Func |  Drill and view filter - Drill on Atrribute Element ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        //Drill on attribute element
        await grid.selectGridContextMenuOption({
            title: 'not all attribute-grid',
            headerName: 'Call Center',
            elementName: 'Atlanta',
            firstOption: 'Drill',
            secondOption: 'Quarter',
        });
        since('The View filter exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isViewFilterPresent('not all attribute-grid'))
            .toBe(true);
        await grid.openViewFilterContainer('not all attribute-grid');
        await grid.clearViewFilter('Clear drill conditions');
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Quarter' }))
            .toBe('2014 Q1');
        since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'not all attribute-grid', headerName: 'Profit Margin' }))
            .toBe('17.68%');
    });

    it('[TC68204_01] Drill X-Func |  Drill on different grid template - all in row', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: templateRsd,
        });
        await libraryPage.openDossier(templateRsd.name);
        const grid = rsdGrid.getRsdGridByKey('WE3C64DC5926840A2B7DB4509A49BEE97');

        //drill on attribute header
        await grid.selectContextMenuOnCell('Year', ['Drill', 'Quarter']);
        since('Drill on Attribute Header, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Quarter', 'Metrics', '']);
        since('Drill on Attribute Header, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2014 Q1', 'Profit', '$297,427']);
        since('Drill on Attribute Header, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['2014 Q1', 'Profit Margin', '17.68%']);

        //drill on attribute element
        await grid.selectContextMenuOnCell('2014 Q1', ['Drill', 'Products', 'Category']);
        since('Drill on Attribute Element, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Metrics', '']);
        since('Drill on Attribute Element, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Profit', '$29,756']);
        since('Drill on Attribute Element, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['Books', 'Profit Margin', '23.87%']);
    });

    it('[TC68204_02] Drill X-Func |  Drill on different grid template - all in Column', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: templateRsd,
        });
        await libraryPage.openDossier(templateRsd.name);
        const grid = rsdGrid.getRsdGridByKey('W40ED02E416C44D0CA6C1A094FEDD2DBA');

        //drill on attribute header
        await grid.selectContextMenuOnCell('Quarter', ['Drill', 'Year']);
        since('Drill on Attribute Header, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Year', '2014', '2015', '2016']);
        since('Drill on Attribute Header, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['', '$7,343,097', '15.08%', '$9,777,521', '15.11%', '$12,609,467', '15.14%']);

        //drill on attribute element
        await grid.selectContextMenuOnCell('2014', ['Drill', 'Country']);
        since('Drill on Attribute Element, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Country', 'USA', 'Web']);
        since('Drill on Attribute Element, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['', '$6,940,922', '15.10%', '$402,175', '14.70%']);
    });

    it('[TC68204_03] Drill X-Func |  Drill on different grid template - attribute in row, metric in column', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: templateRsd,
        });
        await libraryPage.openDossier(templateRsd.name);
        const grid = rsdGrid.getRsdGridByKey('W2FE53D08938F4BF3A3077C6E23B3E0B0');

        //drill on attribute header
        await grid.selectContextMenuOnCell('Country', ['Drill', 'Time', 'Year']);
        since('Drill on Attribute Header, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Metrics', 'Year', '2014', '2015', '2016']);
        since('Drill on Attribute Header, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Profit', '$1,304,141', '$1,740,085', '$2,249,397']);

        //drill on attribute element
        await grid.selectContextMenuOnCell('2014', ['Drill', 'Quarter']);
        since('Drill on Attribute Element, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Metrics', 'Quarter', '2014 Q1', '2014 Q2', '2014 Q3', '2014 Q4']);
        since('Drill on Attribute Element, The third row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['Profit Margin', '17.68%', '14.82%', '15.33%', '13.42%']);
    });
});

export const config = specConfiguration;
