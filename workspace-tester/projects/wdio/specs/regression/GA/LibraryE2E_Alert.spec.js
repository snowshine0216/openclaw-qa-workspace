import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import deleteSubscriptionsByUser from '../../../api/subscription/deleteSubscriptionsByUser.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetBookmarks from '../../../api/resetBookmarks.js';    


const specConfiguration = { ...customCredentials('_Alert') };
const specConfiguration_Error = { ...customCredentials('_AlertError') };

describe('Alert - E2E test for alert subscription in Library', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        subscribe,
        infoWindow,
        sidebar,
        toc,
        baseVisualization,
        alertDialog,
        conditionDialog,
        bookmark,
        grid,
    } = browsers.pageObj1;

    const dossier = {
        id: '466736684CFE161E05B76CB98D92819F',
        name: '(Auto) Alert Subscription_E2E',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    

    const { credentials } = specConfiguration;
    


    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier,
        });
        await deleteSubscriptionsByUser({ credentials: credentials, dossier: dossier });
    });

    afterEach(async () => {
        await conditionDialog.closeConditionDialog();
        await alertDialog.closeAlertDialog();
        await dossierPage.goToLibrary();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(credentials);
    });

    it('[TC98628_02] Alert | Verify condition creation in Alert Subscription ', async () => {
        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectAlertOnVisualizationMenu('Normal Grid');
        // choose highligted metric and format
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.selectHighlightedMetricFormat('Buttermilk', 'Iceberg');

        await alertDialog.addCondition();

        // add condition for metric
        await conditionDialog.addMetricCondition('Cost', ['By Value','Equals'], '4');


        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Year', ['Selecting in list','In List', '2015']);

        // add condition with two inputs
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Cost', ['By Value','Between'], '2', '4');
        

        // check condition expression in condition dialog
        await alertDialog.editConditionByTitle('Cost Equals 4');
        since('1st condition expression should be #{expected}, instead we have #{actual}')
            .expect(await conditionDialog.getConditionExpression()).toBe('Cost Equals 4');
        await conditionDialog.cancelCondition();
        await alertDialog.editConditionByTitle('{Year} In List [2015]');
        since('2st condition expression should be #{expected}, instead we have #{actual}')
            .expect(await conditionDialog.getConditionExpression()).toBe('{Year} In List [2015]');
        await conditionDialog.addAttributeCondition('Year', ['Selecting in list','In List', '2016']);
        await alertDialog.editConditionByTitle('Cost Between 2 and 4');
        since('3st condition expression should be #{expected}, instead we have #{actual}')
            .expect(await conditionDialog.getConditionExpression()).toBe('Cost Between 2 and 4');
        await conditionDialog.cancelCondition();

        // save alert
        await alertDialog.createAlert();

        // check alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since ('Highlight metric should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Cost');
        since ('Highlight metric format should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricColorFormat()).toEqual(['rgba(255,243,179,1)', 'rgba(220,236,241,1)']);
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['Cost Equals 4', '{Year} In List [2016]', 'Cost Between 2 and 4']);
        

        // edit condition with other expressions in alert dialog
        await alertDialog.selectHighlightedMetric('Discount');
        await alertDialog.deleteCondition('Cost Equals 4');
        await alertDialog.editConditionByTitle('{Year} In List [2016]');
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','In List', 'Books']);
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since ('Highlight metric after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Discount');
        since ('Condition expression in alert dialog after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual([ '{Category} In List [Books]', 'Cost Between 2 and 4']);
        await alertDialog.cancelAlert();

         
        });
    });
    export const config = specConfiguration;
