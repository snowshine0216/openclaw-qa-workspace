import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_LD') };

describe('CarryOverDifferentPromptTypes', () => {
    // CarryOverPromptAnswer/Source_Document Value+Element
    const rsd = {
        id: 'EA2F57164A0FEA12849AAD9DF07D6ABB',
        name: 'Source_RWD With SpecialPromptElement',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const documentWithCategoryPrompt = {
        id: '26CC821748A52908DB9DC18820003885',
        name: 'SourceWithCategoryPrompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let { loginPage, dossierPage, libraryPage, promptEditor, reportGrid, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66642] validate carry over prompt element contains special keywords on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        // answer dynamicly to carry over a;a prompt value
        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption('a;a', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of AttrDE102292 should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('a;a');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        // carry over all special prompt values
        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await sourceGrid.selectGridContextMenuOption('a;a', 'SameFromSource');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since( 'The carryover of AttrDE102292 contains many special characters should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('a,a, a;a, a\\,a, Bücher, test, t est, t est , a, a&*, 25, %, a\\a, a\\;a');
        await promptEditor.cancelEditor();
    });

    it('[TC66635] validate carry over prompt element contains space on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption(' test', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        let promptFinder = promptEditor.getSummaryByName('AttrDE102292');
        // getAttribute('textContent') would not trim the space character like getText()
        since('The carryover of AttrDE102292 contains space should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.getSummaryText(promptFinder))
            .toEqual(' test');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption(' t est', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        promptFinder = promptEditor.getSummaryByName('AttrDE102292');
        since('The carryover of AttrDE102292 contains space should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.getSummaryText(promptFinder))
            .toEqual(' t est');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption(' t est ', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        promptFinder = promptEditor.getSummaryByName('AttrDE102292');
        // getAttribute('textContent') would not trim the space on the right
        since('The carryover of AttrDE102292 contains space should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.getSummaryText(promptFinder))
            .toEqual(' t est ');
        await promptEditor.cancelEditor();
    });

    it('[TC66637] validate carry over prompt element contains % on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption('%', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of AttrDE102292 should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('%');
        await promptEditor.cancelEditor();
    });

    it('[TC66655] validate carry over prompt element contains German Umlaute on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption('Bücher', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of AttrDE102292 contains should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('Bücher');
        await promptEditor.cancelEditor();
    });

    it('[TC66639] validate links on null grid cell on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption(' ', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();

        // This text should be null, because of another issue. We should change it later.
        since('The carryover of AttrDE102292 contains should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('25');
        await promptEditor.cancelEditor();
    });

    it('[TC66654] validate context menu can be trigged with right click on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.selectGridContextMenuOption('a;a', 'Dynamicly');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of AttrDE102292 should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('a;a');
        await promptEditor.cancelEditor();
    });

    it('[TC66638] validate carry over prompt answer dynamically when grid row column is hidden on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const sourceGrid = rsdGrid.getRsdGridByKey('WDA183DEF5D8C4D8B82FE5CF405E27933');
        await sourceGrid.clickCell('1');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of AttrDE102292 should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkListSummary('AttrDE102292'))
            .toEqual('a,a');
        await promptEditor.cancelEditor();
    });

    it('[TC79756] validate carry over prompt answer for grid cell with threshold on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentWithCategoryPrompt,
        });

        await libraryPage.openDossier(documentWithCategoryPrompt.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await sourceGrid.clickCellFromLocation(2, 1);

        await reportGrid.waitForGridRendring();
        since('Target report grid data should be #{expected}, instead we have #{actual}')
         .expect(await reportGrid.getOneRowData(1)).toEqual(['Books', '$2,640,094']);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carry over prompt answer should be #{expected}, instead we have #{actual}  ')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('6');
        await promptEditor.cancelEditor();
    });
});
export const config = specConfiguration;
