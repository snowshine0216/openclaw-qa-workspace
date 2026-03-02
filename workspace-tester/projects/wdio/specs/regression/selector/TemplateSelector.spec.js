import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Template Selector', () => {
    const docProperty1 = {
        id: 'EF18818548CC319D1E2C82B92011E5B0',
        name: 'Template selector - apply selection as filter_not show all',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '216F4E3546B232F8FA1A7D8C51ABA307',
        name: 'TTemplate selector - show all_ show total_ select topmost',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '39E374CE418A5507A8EC03BDB563E8F5',
        name: 'Template selector - Graph as selector',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '2E5044F640730101089BF19AF32F9F74',
        name: 'Template selector - Grid and Graph as selector',
        project: tutorialProject,
    };
    const docsSourceAndTarget3 = {
        id: '7EBE18954F899CF724A8A7977F304BA0',
        name: 'Template selector - Grid as selector - target dataset',
        project: tutorialProject,
    };
    const docsSourceAndTarget4 = {
        id: '774AF7A040B7DBAFFF66099CF7048E65',
        name: 'Template selector - Document converted from dossier',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGraph } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80405] Library | Template selector selector - Property', async () => {
        // Apply selection as filter
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        const grid1 = rsdPage.findGridById('WCC19D2A184AD44069CC3B679EAED37DC');
        const grid1Target = rsdPage.findGridById('W1F62CA0B9E05421E92BCCACC73B690E5');
        await grid1.clickCell('2015');
        await rsdPage.waitAllToBeLoaded();
        await since('Select 2015, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}')
            .expect(await grid1Target.isCellDisplayed('2015'))
            .toBe(true);
        await since('Select 2015, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}')
            .expect(await grid1Target.isCellDisplayed('2014'))
            .toBe(false);

        // Not show all
        await grid1.clickCell('Year');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Select Year but not show all, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid1Target.isCellDisplayed('2014'))
            .toBe(false);

        // Always select topmpst
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        const grid2 = rsdPage.findGridById('K44');
        const grid2Target = rsdPage.findGridById('WCC19D2A184AD44069CC3B679EAED37DC');
        await since(
            'Select topmpst, the grid cell 2016 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2016'))
            .toBe(true);
        await grid2.selectContextMenuOnCell('Year', 'Sort Ascending');
        await since(
            'Select topmpst, after sorrt, the grid cell 2016 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2016'))
            .toBe(false);
        await since(
            'Select topmpst, after sorrt, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2014'))
            .toBe(true);

        // show option for All
        await grid2.clickCell('Year');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Select year and show all, after show all, the grid cell 2016 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2016'))
            .toBe(true);
        await since(
            'Select year and show all, after show all, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2014'))
            .toBe(true);

        // show option for Total
        await grid2.clickCell('Total');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Select total, after show all, the grid cell 2016 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('2016'))
            .toBe(false);
        await since(
            'Select total, after show all, the grid cell Total display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await grid2Target.isCellDisplayed('Total'))
            .toBe(true);
    });

    it('[TC80406] Library | Template selector selector - Graph selector', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const graphTarget = rsdPage.findGridById('WCC19D2A184AD44069CC3B679EAED37DC');
        const graph = rsdGraph.findGraphByIdContains('kK44');

        // target document
        await graph.clickOnRectArea(['2015']);
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Graph selector,select 2015, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await graphTarget.isCellDisplayed('2015'))
            .toBe(true);
        await since(
            'Graph selector,select 2015, the grid cell 2016 displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await graphTarget.isCellDisplayed('2016'))
            .toBe(false);
        await graph.clickOnRectArea(['2016']);
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Graph selector,select 2016, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await graphTarget.isCellDisplayed('2015'))
            .toBe(false);
        await since(
            'Graph selector,select 2016, the grid cell 2016 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await graphTarget.isCellDisplayed('2016'))
            .toBe(true);
    });

    it('[TC80407] Library | Template selector selector - Grid and graph selector', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const grid = rsdPage.findGridById('K44');
        const gridTarget = rsdPage.findGridById('W1F62CA0B9E05421E92BCCACC73B690E5');
        const graph = rsdGraph.findGraphByIdContains('kW1F62CA0B9E05421E92BCCACC73B690E5');

        // target document
        await graph.clickOnRectArea(['2015']);
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Grid and graph selector, select 2015, the grid cell display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2015'))
            .toBe(true);

        await grid.clickCell('2014');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Grid and graph selector, select 2014, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2015'))
            .toBe(false);
        await since(
            'Grid and graph selector, select 2014, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2014'))
            .toBe(true);
        await grid.clickCell('Year');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Grid and graph selector, select 2014, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2015'))
            .toBe(true);
        await since(
            'Grid and graph selector, select 2014, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2014'))
            .toBe(true);
    });

    it('[TC80408] Library | Template selector selector - Grid selector', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget3 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget3.id);
        const grid = rsdPage.findGridById('WB5A1B98F65644482BD7660764218102A');
        const gridTarget = rsdPage.findGridById('W1F62CA0B9E05421E92BCCACC73B690E5');

        // target dataset
        await grid.clickCell('2015');
        await grid.waitDocumentToBeLoaded();
        await since(
            'Grid selector, select 2015, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2015'))
            .toBe(true);
        await since(
            'Grid selector, select 2015, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2014'))
            .toBe(false);
        await grid.clickCell('Year');
        await grid.waitDocumentToBeLoaded();
        await since(
            'Grid selector, select year, the grid cell 2015 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2015'))
            .toBe(true);
        await since(
            'Grid selector, select year, the grid cell 2014 display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('2014'))
            .toBe(true);
    });

    it('[TC80409] Library | Validate Template selector -  Document converted from dossier', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget4 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget4.id);
        const grid = rsdPage.findGridByKey('K52');
        const gridTarget = rsdPage.findGridByKey('W1E081809A3A54C0BB946397FD702DBFD');

        // filter by element
        await grid.clickCell('Category', 2);
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Converted to document, select header, the grid cell  display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('Books'))
            .toBe(true);

        // filter by hearder
        await grid.clickCell('Electronics');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Converted to document, select Electronics, the grid cell  display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('Books'))
            .toBe(false);
        await since(
            'Converted to document, select Electronics, the grid cell  display displayed should be #{expected}, while we get #{actual}'
        )
            .expect(await gridTarget.isCellDisplayed('Electronics'))
            .toBe(true);
    });
});
export const config = specConfiguration;
