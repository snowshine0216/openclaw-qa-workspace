import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_drill') };
const { credentials } = specConfiguration;

describe('Drill On Document', () => {
    const document = {
        id: 'F2CC12464A524E3CA32D57920CB4759D',
        name: 'Document-drill',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdConverted = {
        id: '709D7EF64881EE89CE3D9281810C435F',
        name: 'Dossier convert to RSD',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, dossierPage, toc, rsdGrid, rsdGraph } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC68195_01] Drill on Grid | Drill from different entries - attribute header ', async () => {
        //Drill on header
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill anywhere' });
        const grid1 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid1.selectContextMenuOnCell('Year', ['Drill', 'Quarter']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Quarter', 'Call Center', 'Category', 'Metrics', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['2014 Q1', 'Atlanta', 'Books', '23.53%']);
    });

    it('[TC68195_02] Drill on Grid | Drill from different entries - attribute element ', async () => {
        //Drill on attribute element
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill anywhere' });
        const grid1 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid1.selectContextMenuOnCell('Books', ['Drill', 'Geography', 'Country']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Year', 'Call Center', 'Country', 'Metrics', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['2014', 'Atlanta', 'USA', '21.70%']);
    });

    it('[TC68196] Drill on Graph | Drill from different entries - graph body', async () => {
        // Drill on graph body
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Graph-drill anywhere' });
        const graph1 = rsdGraph.findGraphByIdContains('kK2EFF52E84D31BABAD39DA1B3C4203F92');
        await graph1.selectContextMenuOnRectArea(
            ['2014', 'San Diego', 'Electronics'],
            ['Drill', 'Geography', 'Country']
        );
        const tooltip = 'Series: Profit<br />Category: 2014 San Diego USA<br />Value: $95,050';
        since('After Drill within, The first tooltip should be #{expected}, instead we have #{actual}')
            .expect(await graph1.getTooltipOnRectArea(['2014', 'San Diego', 'USA']))
            .toEqual(tooltip);
    });

    it('[TC68197_01] Drill with different drill option - Drill within', async () => {
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill within' });
        // with all objects-Grid
        const drillWithinGridWithAllObjects = rsdGrid.getRsdGridByKey('W1909551CB4784FCA803D1B3A2D3AF52C');
        since('The Drill Within Allowed on all objects should be #{expected}, instead we have #{actual}')
            .expect(await drillWithinGridWithAllObjects.IsMenuPresentOnContextMenu('Category', ['Drill']))
            .toBe(false);

        //with part objects-Grid
        const drillWithinGridWithPartObjects = rsdGrid.getRsdGridByKey('W4E7C49751EEF44DAA8DCB715D69421EB');
        await drillWithinGridWithPartObjects.selectContextMenuOnCell('Category', ['Drill', 'Time', 'Quarter']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await drillWithinGridWithPartObjects.getOneRowData(1))
            .toEqual(['Year', 'Call Center', 'Quarter', 'Metrics', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await drillWithinGridWithPartObjects.getOneRowData(2))
            .toEqual(['2014', 'Atlanta', '2014 Q1', '17.31%']);

        // with all objects-Graph
        await toc.openPageFromTocMenu({ chapterName: 'Graph-drill within' });
        const drillWithinGraphWithAllObjects = rsdGraph.findGraphByIdContains('kKBB27D2BE49A844F49C1CB59EA320EE51');
        since('The Drill Within Allowed on all objects should be #{expected}, instead we have #{actual}')
            .expect(
                await drillWithinGraphWithAllObjects.IsMenuPresentOnContextMenu(
                    ['2014', '2014 Q1', 'Atlanta', 'Electronics', 'USA'],
                    ['Drill']
                )
            )
            .toBe(false);

        //with part objects-Graph
        const drillWithinGraphWithPartObjects = rsdGraph.findGraphByIdContains('kKFCE576E6475FCB3A91168C948E149510');
        await drillWithinGraphWithPartObjects.selectContextMenuOnRectArea(
            ['2014', 'San Diego', 'Electronics'],
            ['Drill', 'Time', 'Quarter']
        );
        const tooltip = 'Series: Profit<br />Category: 2014 San Diego 2014 Q1<br />Value: $23,747';
        since('After Drill within, The first tooltip should be #{expected}, instead we have #{actual}')
            .expect(await drillWithinGraphWithPartObjects.getTooltipOnRectArea(['2014', 'San Diego', '2014 Q1']))
            .toEqual(tooltip);
    });

    it('[TC68197_02] Drill with different drill option - No Drilling', async () => {
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-no drilling' });
        const noDrillingGrid = rsdGrid.getRsdGridByKey('K37A687274A6AC05B0F4932BE4D975B48');
        //Attribute Header - Grid
        since('The No Drilling Allowed For Attribute header should be #{expected}, instead we have #{actual}')
            .expect(await noDrillingGrid.IsMenuPresentOnContextMenu('Category', ['Drill']))
            .toBe(false);
        //Attribute Element - Grid
        since('The No Drilling Allowed For Attribute element should be #{expected}, instead we have #{actual}')
            .expect(await noDrillingGrid.IsMenuPresentOnContextMenu('Atlanta', ['Drill']))
            .toBe(false);

        //Graph
        await toc.openPageFromTocMenu({ chapterName: 'Graph-no drilling' });
        const noDrillingGraph = rsdGraph.findGraphByIdContains('kKBF1B4E204044DD4D898A719BE15D53E5');
        since('The No Drilling Allowed should be #{expected}, instead we have #{actual}')
            .expect(await noDrillingGraph.IsMenuPresentOnContextMenu(['2014', 'Atlanta', 'Electronics'], ['Drill']))
            .toBe(false);
    });

    it('[TC68198] Document Drill | Drill on document which converted from dossier - Grid', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsdConverted,
        });
        await libraryPage.openDossier(rsdConverted.name);
        const grid1 = rsdGrid.getRsdGridByKey('WE668F9E35288441A934065707472C6AA');

        //Drill on attribute header
        await grid1.selectContextMenuOnCell('Year', ['Drill', 'System hierarchy', 'Category']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Category', 'Country', 'Call Center', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['Books', 'USA', 'Atlanta', '21.47%']);

        //Drill on attribute element
        await grid1.selectContextMenuOnCell('Atlanta', ['Drill', 'Time', 'Year']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Category', 'Country', 'Year', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['Books', 'USA', '2014', '21.70%']);
    });

    it('[TC68199] Document Drill | Drill on customized drill map with general attributes', async () => {
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid-drill anywhere' });
        const grid1 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid1.selectContextMenuOnCell('Year', ['Drill', 'System hierarchy', 'Quarter']);
        since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Quarter', 'Call Center', 'Category', 'Metrics', 'Profit Margin']);
        since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['2014 Q1', 'Atlanta', 'Books', '23.53%']);
    });
});

export const config = specConfiguration;
