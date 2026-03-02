/* eslint-disable @typescript-eslint/no-floating-promises */
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import LoginPage from '../../../pageObjects/auth/LoginPage.js';

const specConfiguration = { ...customCredentials('') };

describe('tmp test for export', () => {
    const dossier1 = {
        id: '0DF856F94485A7B077CF84AF9F724B76',
        name: 'normalElement',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };


const { credentials } = specConfiguration;

    let {
        loginPage,
        bookmark,
        libraryPage,
        infoWindow,
        dossierPage,
        filterPanel,
        checkboxFilter,
        share,
        shareDossier,
        libraryAuthoringPage,
        libraryConditionalDisplay,
    } = browsers.pageObj1;
/*
    beforeAll(async () => {
        await loginPage.login(credentials);
    });
*/
    
    beforeEach(async () => {
        await loginPage.login(credentials);
        //login to sender
        // await libraryPage.switchUser(credentials);
    });
   
/*
    afterEach(async () => {
        await dossierPage.goToLibrary();
    });
*/
     

    it('[TC90584_1] Check existing Conditional Display settings', async () => {
        await libraryPage.openDossier(dossier1.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryConditionalDisplay.chooseElement('Rich Text (Year 2015 OR Books hide) ');
        await libraryConditionalDisplay.OpenElementMenu('Rich Text (Year 2015 OR Books hide) ');
        await takeScreenshotByElement(await libraryConditionalDisplay.getRightClickMenu(), 'TC90584_1','Right Click Menu', { tolerance: 0.1 });
        await libraryConditionalDisplay.openConditionalDisplayDialog();
        await takeScreenshotByElement(await libraryConditionalDisplay.getConditionalDisplayDialog(), 'TC90584_1','Conditional Display Dialog', { tolerance: 0.1 });
        await libraryConditionalDisplay.closeConditionalDisplayDialog();

    });
 

it('[TC90584_2] Delete existing Conditional Display settings', async () => {
    await libraryPage.openDossier(dossier1.name);
    await libraryAuthoringPage.editDossierFromLibrary();
    await libraryConditionalDisplay.chooseElement('Rich Text (Year 2015 OR Books hide) ');
    await libraryConditionalDisplay.OpenElementMenu('Rich Text (Year 2015 OR Books hide) ');
    await libraryConditionalDisplay.openConditionalDisplayDialog();
    await takeScreenshotByElement(await libraryConditionalDisplay.getConditionalDisplayDialog(), 'TC90584_2','Conditional Display Dialog_Before', { tolerance: 0.1 });
    await libraryConditionalDisplay.deleteConditionByElement('{Year} In List [2015]');
    await takeScreenshotByElement(await libraryConditionalDisplay.getConditionalDisplayDialog(), 'TC90584_2','Conditional Display Dialog_After', { tolerance: 0.1 });
    await libraryConditionalDisplay.closeConditionalDisplayDialog();
   });

   

it('[TC90584_3] Update existing Conditional Display settings', async () => {
    await libraryPage.openDossier(dossier1.name);
    await libraryAuthoringPage.editDossierFromLibrary();
    await libraryConditionalDisplay.chooseElement('Rich Text (Year 2015 OR Books hide) ');
    await libraryConditionalDisplay.OpenElementMenu('Rich Text (Year 2015 OR Books hide) ');
    await libraryConditionalDisplay.openConditionalDisplayDialog();
    await takeScreenshotByElement(await libraryConditionalDisplay.getConditionalDisplayDialog(), 'TC90584_3','Conditional Display Dialog_Before', { tolerance: 0.1 });
    //await libraryConditionalDisplay.openConditionalRelationDropdown('OR');
    //await libraryConditionalDisplay.selectConditionRelation('OR NOT');
    await libraryConditionalDisplay.openNewConditionDialog('{Year} In List [2015]');
    await takeScreenshotByElement(await libraryConditionalDisplay.getNewConditionDialog(), 'TC90584_3','New Conditional Dialog_Before', { tolerance: 0.1 });
    //await takeScreenshotByElement(await libraryConditionalDisplay.getConditionalDisplayDialog(), 'TC90584_4','Conditional Display Dialog_After', { tolerance: 0.1 });
    await libraryConditionalDisplay.selectNewConditionElement('Region');
    //await libraryConditionalDisplay.selectElementInList('Mid-Atlantic');
    await takeScreenshotByElement(await libraryConditionalDisplay.getNewConditionDialog(), 'TC90584_3','New Conditional Dialog_After', { tolerance: 0.1 });
    await libraryConditionalDisplay.closeNewConditionDialog();
    await libraryConditionalDisplay.closeConditionalDisplayDialog();
    });


});

export const config = specConfiguration;
