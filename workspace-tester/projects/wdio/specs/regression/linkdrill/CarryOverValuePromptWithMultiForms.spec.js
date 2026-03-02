import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_LD') };

describe('CarryOverDifferentPromptTypes', () => {
    const rsd = {
        id: '1A43655843D3E9F163D1E9B836687E68',
        name: 'Source_CarryOverMulti-formValuePrompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let { loginPage, dossierPage, libraryPage, promptEditor, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66657_01] validate multi-forms can be carried over for value prompt for grid enabled incremental fetch on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });
        // source grid enabled incremental fetch dynamic by des
        await libraryPage.openDossier(rsd.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let gridEnaledByDes = rsdGrid.getRsdGridByKey('K44');
        await gridEnaledByDes.waitForGridLoaded();
        await gridEnaledByDes.scrollGridCellIntoView('159');
        await gridEnaledByDes.clickCell('159');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of prompt value should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toEqual('Ewing');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();
        gridEnaledByDes = rsdGrid.getRsdGridByKey('K44');
        await gridEnaledByDes.scrollInGridToTop();
    });

    it('[TC66657_02] validate multi-forms can be carried over for value prompt for grid enabled incremental fetch on Library RSD', async () => {
        // source grid enabled incremental fetch dynamic by ID
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        let gridEnaledByID = rsdGrid.getRsdGridByKey('W6BFC1EC2DDBE488B9EF8A9054AAF54E2');
        await gridEnaledByID.waitForGridLoaded();
        await gridEnaledByID.scrollGridCellIntoView('159');
        await gridEnaledByID.clickCell('Ewing');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of prompt value should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toEqual('159');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();
        gridEnaledByID = rsdGrid.getRsdGridByKey('W6BFC1EC2DDBE488B9EF8A9054AAF54E2');
        await gridEnaledByID.scrollInGridToTop();
    });

    it('[TC66657_03] validate multi-forms can be carried over for value prompt for grid enabled incremental fetch on Library RSD', async () => {
        // source grid disabled incremental fetch dynamic by des
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        let gridDesabledByDes = rsdGrid.getRsdGridByKey('W543D1E1F721347AF89881FE095E3B853');
        await gridDesabledByDes.waitForGridLoaded();
        await gridDesabledByDes.scrollGridCellIntoView('159');
        await gridDesabledByDes.clickCell('159');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of prompt value should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toEqual('Ewing');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();
        gridDesabledByDes = rsdGrid.getRsdGridByKey('W543D1E1F721347AF89881FE095E3B853');
        await gridDesabledByDes.scrollInGridToTop();
    });

    it('[TC66657_04] validate multi-forms can be carried over for value prompt for grid enabled incremental fetch on Library RSD', async () => {
        // source grid disabled incremental fetch dynamic by ID
        await libraryPage.openDossier(rsd.name);
        await dossierPage.waitForDossierLoading();
        let gridDesabledByID = rsdGrid.getRsdGridByKey('WC0F987BA92BB4E5D819810AD6278DA8A');
        await gridDesabledByID.waitForGridLoaded();
        await gridDesabledByID.scrollGridCellIntoView('159');
        await gridDesabledByID.clickCell('Ewing');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of prompt value should be #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toEqual('159');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();
        gridDesabledByID = rsdGrid.getRsdGridByKey('WC0F987BA92BB4E5D819810AD6278DA8A');
        await gridDesabledByID.scrollInGridToTop();
    });
});

export const config = specConfiguration;
