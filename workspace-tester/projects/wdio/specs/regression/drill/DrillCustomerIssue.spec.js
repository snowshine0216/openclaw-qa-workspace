import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_drill') };
const { credentials } = specConfiguration;

describe('Drill Customer Issue', () => {
    const rsdDrill = {
        id: 'F2CC12464A524E3CA32D57920CB4759D',
        name: 'Document-drill',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdGroupBy = {
        id: 'B6F93817495A67D8D85ABF8D9FF064BF',
        name: 'Document-drill-GroupBy',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdDrillUp = {
        id: '66DBECCF4C84CF01C8B1B9B28770FA9E',
        name: 'Document-Only Drill Up',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdPrompt = {
        id: '0DA8F58F4B69182F89697EAEF344921E',
        name: 'Document with prompt - Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, dossierPage, toc, rsdGrid, rsdGraph, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80240] - Customer Issues: Verify multi-select drilling works for a grid in presentation mode', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdDrill,
        });
        await libraryPage.openDossier(rsdDrill.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill anywhere' });
        const grid1 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid1.selectContextMenuOnCells(['Books', 'Electronics'], ['Drill', 'Time', 'Quarter']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Year', 'Call Center', 'Quarter', 'Metrics', 'Profit Margin']);
        since('The second row should be #{expected}, instead we get #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['2014', 'Atlanta', '2014 Q1', '20.55%']);
    });

    it('[TC80241_01] - Customer Issues: Drill on documents with grouping - Grid', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdGroupBy,
        });
        await libraryPage.openDossier(rsdGroupBy.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill anywhere' });
        await transactionPage.groupBy.changeGroupBy('2016');
        const gridWithGroupBy = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await gridWithGroupBy.selectContextMenuOnCell('Year', ['Drill', 'Quarter']);
        await dossierPage.waitForDossierLoading();
        since('The Report Cell value should be #{expected}, instead we have #{actual}')
            .expect(await gridWithGroupBy.getOneRowData(1))
            .toEqual(['Quarter', 'Call Center', 'Category', 'Metrics', 'Profit Margin']);
        since('The Report Cell value should be #{expected}, instead we have #{actual}')
            .expect(await gridWithGroupBy.getOneRowData(2)) 
            .toEqual(['2016 Q1', 'Atlanta', 'Books', '24.10%']);
    });

    it('[TC80241_02] - Customer Issues: Drill on documents with grouping - Graph', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdGroupBy,
        });
        await libraryPage.openDossier(rsdGroupBy.name);
        await toc.openPageFromTocMenu({ chapterName: 'Graph-drill anywhere' });
        const graphWithGroupBy = rsdGraph.findGraphByIdContains('kK2EFF52E84D31BABAD39DA1B3C4203F92');
        await transactionPage.groupBy.changeGroupBy('2015');
        await graphWithGroupBy.selectContextMenuOnRectArea(
            ['2015', 'San Diego', 'Electronics'],
            ['Drill', 'Time', 'Quarter']
        );
        const tooltip = 'Series: Profit<br />Category: 2015 San Diego 2015 Q1<br />Value: $30,154';
        since('After Drill within, The first tooltip should be #{expected}, instead we have #{actual}')
            .expect(await graphWithGroupBy.getTooltipOnRectArea(['2015', 'San Diego', '2015 Q1']))
            .toEqual(tooltip);
    });

    it('[TC80242_01] - Customer Issues: Drill on documents using attribute that can only drill up/across - Grid', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdDrillUp,
        });
        await libraryPage.openDossier(rsdDrillUp.name);
        const gridDrillUp = rsdGrid.getRsdGridByKey('K44');
        await gridDrillUp.selectContextMenuOnCell('Day', ['Drill', 'Month']);
        since('The Report Cell value should be #{expected}, instead we have #{actual}')
            .expect(await gridDrillUp.getOneRowData(2))
            .toEqual(['Jan 2014', '$89,174']);
    });

    it('[TC80242_02] - Customer Issues: Drill on documents using attribute that can only drill up/across - Graph', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdDrillUp,
        });
        await libraryPage.openDossier(rsdDrillUp.name);
        const graphDrillUp = rsdGraph.findGraphByIdContains('K44');
        const gridDrillUp = rsdGrid.getRsdGridByKey('K44');
        await graphDrillUp.selectContextMenuOnRectArea(['1/1/2014'], ['Drill', 'Month']);
        since('The Report Cell value should be #{expected}, instead we have #{actual}')
            .expect(await gridDrillUp.getOneRowData(2))
            .toEqual(['Jan 2014', '$2,324']);
    });

    it('[TC80243_01] - Customer Issues: Drill on prompted document - Grid', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdPrompt,
        });
        await libraryPage.openDossierAndRunPrompt(rsdPrompt.name);
        const gridPrompt = rsdGrid.getRsdGridByKey('K44');
        await gridPrompt.selectContextMenuOnCell('USA', ['Drill', 'Call Center']);
        await since('The Report Cell value Second row should be #{expected}, instead we have #{actual}')
            .expect(await gridPrompt.getOneRowData('2'))
            .toEqual(['2014', '2014 Q1', 'Atlanta', '17.31%', '$37,920', '$7,939']);
    });

    it('[TC80243_02] - Customer Issues: Drill on prompted document - Graph', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdPrompt,
        });
        await libraryPage.openDossierAndRunPrompt(rsdPrompt.name);
        const graphPrompt = rsdGraph.findGraphByIdContains('K44');
        const gridPrompt = rsdGrid.getRsdGridByKey('K44');
        await graphPrompt.selectContextMenuOnRectArea(['2014', '2014 Q1', 'Atlanta'], ['Drill', 'Country']);
        since('The Report Cell value Second row should be #{expected}, instead we have #{actual}')
            .expect(await gridPrompt.getOneRowData('2'))
            .toEqual(['2014', '2014 Q1', 'USA', '17.68%', '$1,317,598', '$283,021']);
    });
});

export const config = specConfiguration;
