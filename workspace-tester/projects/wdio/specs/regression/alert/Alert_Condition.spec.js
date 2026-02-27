import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import deleteSubscriptionsByUser from '../../../api/subscription/deleteSubscriptionsByUser.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetBookmarks from '../../../api/resetBookmarks.js';    


const specConfiguration = { ...customCredentials('_Alert') };
const specConfiguration_Error = { ...customCredentials('_AlertError') };

describe('Alert - create and update condition for alert subscription in Library', () => {
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
        id: '22BC1E8347186406D8C5DE8462307520',
        name: '(Auto) Alert Subscription',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithPrompt = {
        id: '36D1C0ED4AE27AF768B32486AED472E7',
        name: '(Auto) Alert Subscription_Multiple Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithDifferentObjects = {
        id: 'BA40052746BDDD4305046280C5F5D453',
        name: '(Auto) Alert Subscription_DifferentObjetcs',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithRA = {
        id: '5D343FC448B51984C0618ABF78994A2D',
        name: '(Auto) Alert Subscription_RA',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: alertWithErrorCredentials } = specConfiguration_Error;


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

    it('[TC98628] Alert | Verify condition creation in Alert Subscription ', async () => {

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

        // // check alert in sidebar
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

    it('[TC98628_01]  Alert | Verify condition creation in Alert Subscription in AG Grid', async () => {
        // create alert for compound grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization 1');

        // add highlighted metric
        await alertDialog.selectHighlightedMetric('Cost Growth');
        await alertDialog.selectHighlightedMetricFormat('Pink', 'Sweet Corn');
        since ('Highlight metric column sets should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricDropdownColumnSetsValue()).toEqual(['Column Set 1', 'Column Set 3']);


        // add condition for attribute  
        await alertDialog.addCondition();
        since('Based on dropdown for column set3 should have #{expected} options, instead we have #{actual}')
            .expect(await conditionDialog.getBasedOnDropDownElementsText()).toEqual(['Category', 'Subcategory', 'Year','Cost Growth', 'Revenue']);

        await conditionDialog.addAttributeCondition('Category', ['Qualification on','ID', 'Less than'], '5');
        // add condition for metric
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Revenue', ['By Value','Is Not Null']);


        // add condition with two inputs
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Cost Growth', ['By Rank','Between highest%'], '2', '4');

        // group the first two conditions
        await alertDialog.updateConditionOperator('Revenue Is Not Null', 'OR');
        
        // save alert
        await alertDialog.createAlert();

        // check alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('All operators value should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR', 'AND']);
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Category}(ID) Less than 5', 'Revenue Is Not Null ', `Percentage of 'Cost Growth' Between highest% 2% and 4%`]);
        

        // edit condition with other operators in alert dialog
        await alertDialog.selectHighlightedMetric('Profit');
        // add condition for metric  
        await alertDialog.addCondition();
        since('Based on dropdown for column set1 should have #{expected} options, instead we have #{actual}')
            .expect(await conditionDialog.getBasedOnDropDownElementsText()).toEqual(['Category', 'Quarter', 'Subcategory', 'Year', 'Cost', 'Profit']);
        await conditionDialog.addMetricConditionWithoutApply('Profit', ['By Value','Greater than']);
        await conditionDialog.selectMetric('Cost');
        await conditionDialog.applyCondition();

        await alertDialog.updateConditionOperator('Revenue Is Not Null', 'OR NOT');
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('Highlight metric after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Profit');
        since('Highlight metric format after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricColorFormat()).toEqual(['rgba(253,162,154,1)', 'rgba(250,212,127,1)']);
        since('All operators value after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'AND', 'AND']);
        since ('Condition expression in alert dialog after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Category}(ID) Less than 5', 'NOT Revenue Is Not Null ',`Percentage of 'Cost Growth' Between highest% 2% and 4%`, 'Profit Greater than Cost']);
        await takeScreenshotByElement(alertDialog.getConditionSection(),'T98628_01','Condition Section after editing');
        await alertDialog.cancelAlert();
    });

    it('[TC98679]  Alert | Verify operator for condition in Alert Subscription', async () => {
        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectAlertOnVisualizationMenu('Grid with Threshold');

        // select highlighted metric
        await alertDialog.selectHighlightedMetric('Cost');

        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Qualification on','ID', 'Less than'], '5');
        // add condition for metric
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Discount', ['By Value','Is Not Null']);

        // add condition for attribute
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Subcategory', ['Selecting in list','Not In List', 'Business']);

        // add duplicate condition
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Qualification on','ID', 'Less than'], '5');

        // add condition with two inputs
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Revenue', ['By Value','Greater than'], '300');
        // await conditionDialog.addMetricCondition('Cost', ['By Rank','Between highest%'], '2', '4');

        // group the first two conditions
        await alertDialog.updateConditionOperator('Discount Is Not Null', 'OR');
        await alertDialog.updateConditionOperator('{Subcategory} Not In List [Business]', 'AND NOT');
        await alertDialog.updateConditionOperator('{Category}(ID) Less than 5',  'OR NOT', 2);
        await alertDialog.updateConditionOperator('Revenue Greater than 300', 'OR NOT');
        since('All operators value should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR', 'AND NOT', 'AND', 'AND']);
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(3);
        
        // save alert
        await alertDialog.createAlert();

        // check alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('All operators value should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR', 'AND NOT', 'AND', 'AND']);
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Category}(ID) Less than 5','Discount Is Not Null ', '{Subcategory} Not In List [Business]','{Category}(ID) Less than 5','Revenue Greater than 300']);

        // edit condition with other operators in alert dialog
        await alertDialog.selectHighlightedMetric('Revenue');
        await alertDialog.updateConditionOperator('Discount Is Not Null', 'OR NOT');
        await alertDialog.updateConditionOperator('Revenue Greater than 300', 'AND NOT');
        await alertDialog.clickAddToSnapshotCheckbox();
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('All operators value after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'AND NOT', 'AND', 'AND NOT']);
        since('add to snapshot checkbox should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isAddToSnapshotPresent()).toBe(true);
        await alertDialog.cancelAlert();
         
    });

    
    it('[TC98712]  Alert | Verify groups for condition in Alert Subscription', async () => {
        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Visualizations 2' });
        await baseVisualization.selectAlertOnVisualizationMenu('Network');

        // select highlighted metric
        await alertDialog.selectHighlightedMetric('Unit Price');

        // add condition for metric
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Unit Price', ['By Value','Equals'], '4');

        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Qualification on','DESC', 'Begins with'], 'Books');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Quarter', ['Selecting in list','In List', '2015 Q3']);

        // add more conditions
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Unit Profit', ['By Rank','Highest%'], '50');
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Units Sold', ['By Rank','Exclude lowest'], '3');

       

        // group all conditions
        await alertDialog.groupCondition('{Category}(DESC) Begins with Books');
        await alertDialog.groupCondition('{Quarter} In List [2015 Q3]');
        await alertDialog.groupCondition(`Percentage of 'Unit Profit' Highest% 50%`);

        // check the group number
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(3);
        
        // change the group status
        await alertDialog.ungroupCondition('{Category}(DESC) Begins with Books');
        await alertDialog.ungroupCondition('{Quarter} In List [2015 Q3]');

        // save alert
        await alertDialog.createAlert();

        // open alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);

        // check the group number and group icons
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(1);
        since('Group icon display for the 1st condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isGroupIconDisplayedInConditionItem('{Category}(DESC) Begins with Books')).toBe(false);
        since('Ungroup icon display for the 1st condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isUngroupIconDisplayedInConditionItem('{Category}(DESC) Begins with Books')).toBe(false);
        since('Group icon display for the 2nd condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isGroupIconDisplayedInConditionItem('{Quarter} In List [2015 Q3]')).toBe(true);
        since('Ungroup icon display for the 2nd condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isUngroupIconDisplayedInConditionItem('{Quarter} In List [2015 Q3]')).toBe(true);
        since('Group icon display for the 3rd condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isGroupIconDisplayedInConditionItem(`Percentage of 'Unit Profit' Highest% 50%`)).toBe(true);
        since('Ungroup icon display for the 3rd condition should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isUngroupIconDisplayedInConditionItem(`Percentage of 'Unit Profit' Highest% 50%`)).toBe(true);
        
        // edit condition with other groups in alert dialog
        await alertDialog.selectHighlightedMetric('Unit Profit');
        await alertDialog.ungroupCondition('{Quarter} In List [2015 Q3]');
        await alertDialog.groupCondition('{Quarter} In List [2015 Q3]');
        await alertDialog.groupCondition(`Rank of 'Units Sold' Exclude lowest 3`);
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(3);
        await alertDialog.cancelAlert();
         
    });

    it('[TC98721]  Alert | Verify group + operator for condition in Alert Subscription ', async () => {
        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Visualizations 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Line Chart');
        // choose highligted metric
        await alertDialog.selectHighlightedMetric('Revenue');

        // add condition for metric
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Cost', ['By Rank','Highest'], '4');

        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Qualification on','DESC', 'Contains'], 'Books');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Quarter', ['Qualification on','DESC', 'Like'], '2016');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Subcategory', ['Selecting in list','In List', 'Business']);
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Year', ['Selecting in list','Not In List', '2015']);

        // add more metric conditions
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Discount', ['By Value','Is Not Null']);
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Profit', ['By Rank','Between highest%'], '10', '20');
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Revenue', ['By Rank','Exclude lowest%'], '20');
       

        // change operator for each condition
        await alertDialog.updateConditionOperator('{Category}(DESC) Contains Books', 'OR');
        await alertDialog.updateConditionOperator('{Quarter}(DESC) Like 2016', 'OR');
        await alertDialog.updateConditionOperator('{Subcategory} In List [Business]', 'OR');
        await alertDialog.updateConditionOperator('{Year} Not In List [2015]', 'OR');
        await alertDialog.updateConditionOperator('Discount Is Not Null',  'OR');
        await alertDialog.updateConditionOperator(`Percentage of 'Profit' Between highest% 10% and 20%`, 'OR');
        await alertDialog.updateConditionOperator(`Percentage of 'Revenue' Exclude lowest% 20%`, 'OR');
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(6);
        since('All operators value should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR', 'OR', 'OR','OR', 'OR', 'OR', 'OR']);
    
        await alertDialog.updateConditionOperator('{Category}(DESC) Contains Books', 'OR NOT');
        await alertDialog.updateConditionOperator('{Subcategory} In List [Business]', 'AND NOT');
        await alertDialog.updateConditionOperator('Discount Is Not Null', 'AND');
        since('Group number should after changing operators #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(6);
        since('All operators value after changing operators should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'OR', 'AND NOT','OR', 'AND', 'OR', 'OR']);

        // drag and drop the condition
        await alertDialog.dragAndDropConditionItem('{Subcategory} In List [Business]', '{Category}(DESC) Contains Books');
        await alertDialog.dragAndDropConditionItem('{Year} Not In List [2015]', 'Discount Is Not Null');

        // change group status
        await alertDialog.ungroupCondition('{Category}(DESC) Contains Books');
        await alertDialog.ungroupCondition('Discount Is Not Null');
        await alertDialog.ungroupCondition(`Percentage of 'Profit' Between highest% 10% and 20%`);

        // check the group number and operator
        since('Group number should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(2);
        since('All operators value after changing grouping should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'OR', 'OR','OR', 'OR', 'OR', 'OR']);
        
        // save alert
        await alertDialog.createAlert();

        // open alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);

        // check the group number and group icons
        since('Group number in editing dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(2);
        since('All operators in editing dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'OR', 'OR','OR', 'OR', 'OR', 'OR']);
        await takeScreenshotByElement(alertDialog.getConditionSection(),'T98721','Condition Section in editing');
        
        // edit condition with other groups in alert dialog
        await alertDialog.selectHighlightedMetric('Discount');
        await alertDialog.groupCondition('{Category}(DESC) Contains Books');
        await alertDialog.groupCondition(`Percentage of 'Profit' Between highest% 10% and 20%`);
        await alertDialog.updateConditionOperator('Discount Is Not Null ', 'AND NOT');
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('Group number after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionGroupsCount()).toBe(4);
        since('All operators value after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAllOperatorsValue()).toEqual(['OR NOT', 'OR', 'OR','OR', 'OR', 'AND NOT', 'OR']);
        await alertDialog.cancelAlert();
         
    });

    it('[TC98734] Alert | Verify  condition for dashboard with prompt in Alert Subscription  ', async () => {
        // reset dossier with prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });

        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });

        // create alert 
        await libraryPage.openDossier(dossierWithPrompt.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization 1');

        // select highlighted metric
        await alertDialog.selectHighlightedMetric('Revenue');

        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Region', ['Qualification on','DESC', 'Ends with'], 'h');
    
        // add condition for metric
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Revenue', ['By Value','Less than or equal to'], '400');

        // save alert
        await alertDialog.createAlert();
        since('Current bookmark label should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle()).toBe('Subscription Bookmark 1');

        // reset base dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });

        // check alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since ('Bookmark label in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getCurrentBookmarkSelection()).toBe('Subscription Bookmark 1');
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Region}(DESC) Ends with h','Revenue Less than or equal to 400']);
        await alertDialog.cancelAlert();

        // edit condition with other expressions in alert dialog
         
    });

    it('[TC98738] Alert | Verify  editing condition IW for Alert Subscription', async () => {
        // reset dossier with prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });

        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });

        // create alert
        await libraryPage.openDossier(dossierWithPrompt.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization 1');
        await alertDialog.selectHighlightedMetric('Revenue');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Region', ['Selecting in list','In List', 'South']);
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Revenue', ['By Value','Is Not Null']);
        await alertDialog.createAlert();

        // create bookmark2
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Region',
            elementName: 'South',
            firstOption: 'Exclude',
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await bookmark.closePanel();

        // change bookmark for alert in dossier IW
        
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossierWithPrompt.name);
        await libraryPage.openDossierInfoWindow(dossierWithPrompt.name);
        await infoWindow.clickManageSubscriptionsButton();
        // Edit subscriptions
        await subscribe.clickInfoWindowEdit();
        await alertDialog.selectBookmark('Bookmark 1');
        await alertDialog.createAlert();


        // check the alert in sidebar
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since ('Bookmark label in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getCurrentBookmarkSelection()).toBe('Subscription Bookmark 1');
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Region} In List [South]','Revenue Is Not Null ']);
        await alertDialog.cancelAlert();

         
    });

    it('[TC98744] Alert | Alert | Verify alert for viz applied threshold ', async () => {
        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectAlertOnVisualizationMenu('Grid with Threshold');

        // create alert1 for condition compatible with threshold
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','In List', 'Books']);
        await alertDialog.createAlert();

        // create alert2 for condition incompatible with threshold
        await baseVisualization.selectAlertOnVisualizationMenu('Grid with Threshold');
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','Not In List', 'Books']);
        await alertDialog.createAlert();

        // create alert3 for condition on different metric
        await baseVisualization.selectAlertOnVisualizationMenu('Grid with Threshold');
        await alertDialog.selectHighlightedMetric('Revenue');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','In List', 'Books']);
        await alertDialog.createAlert();
        

        // run those 3 alerts 
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickRunNowInSubscriptionListByName(dossier.name);
        await subscribe.clickRunNowInSubscriptionListByName(dossier.name, 2);
        await subscribe.clickRunNowInSubscriptionListByName(dossier.name, 3);

        // check the grid with threshold
        await sidebar.clickAllSection();
        await libraryPage.openDossier(dossier.name);
        const value = await grid.isGridElmAppliedThreshold({ 
            title: 'Grid with Threshold',
            headerName: 'Cost',
            elementName: '$132,454',
        });
        since ('Grid with threshold should be #{expected}, instead we have #{actual}')
            .expect(value).toBe(true);

         
    });

    it('[TC98744_01] Alert | Verify alert for Viz with RA ', async () => {
        // reset dossier state
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithRA,
        });

        // reset bookmarks
        await resetBookmarks({
            credentials: credentials,
            dossier: dossierWithRA,
        });
        // create alert for normal grid
        await libraryPage.openDossier(dossierWithRA.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization 1');

        // create alert for condition with RA
        await alertDialog.selectHighlightedMetric('Average Rate');
        await alertDialog.addCondition();
        await conditionDialog.addRACondition('Accounts(Group)', ['Balance Sheet','Net Income', 'Statistical Accounts'], ['Balance Sheet','Net Income'],['Level 2 in Balance Sheet', 'Operating Profit'], ['Level 2 in Balance Sheet'], ['Current Assets', 'Other Assets'] );
        since ('Excluded Condition expression in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getExcludeConditionExpression()).toEqual(['Level 2 in Balance Sheet']);
        await alertDialog.createAlert();

        
        // check the alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossierWithRA.name);
        since ('Excluded Condition expression in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getExcludeConditionExpression()).toEqual(['Level 2 in Balance Sheet']);
        await alertDialog.editConditionByTitle('{Accounts(Group)} : [Balance Sheet, Net Income, Statistical Accounts, NOT Level 2 in Balance Sheet, NOT Operating Profit, Current Assets, Other Assets]');
        await conditionDialog.addRAConditionWithoutBasedOn(['Balance Sheet'] );
        await alertDialog.createAlert();

        // check the updated one
        await subscribe.clickEditButtonInSidebar(dossierWithRA.name);
        since ('Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['{Accounts(Group)} : [Net Income, Statistical Accounts, NOT Level 2 in Balance Sheet, NOT Operating Profit, Current Assets, Other Assets]']);
        since ('Excluded Condition expression in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getExcludeConditionExpression()).toEqual(['Level 2 in Balance Sheet', 'Operating Profit']);
        await alertDialog.cancelAlert();
         
    });

    it('[TC98936] Alert | Verify based on options in condition editor ', async () => {
        //reset dossier and bookmarks
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithDifferentObjects,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossierWithDifferentObjects,
        });
        // create alert for normal grid
        await libraryPage.openDossier(dossierWithDifferentObjects.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid/Graph', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Mordern');

        // create alert1 for modern grid with parameter objects
        await alertDialog.inputName('Alert 1');
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.addCondition();
        since('Based on dropdown for column set1 should have #{expected} options, instead we have #{actual}')
            .expect(await conditionDialog.getBasedOnDropDownElementsText()).toEqual(['Category', '(Profit/Cost)', 'Cost', 'element_list_checkbox_parameter', 'element_list_dropdown_parameter', 'element_list_dynamic_parameter', 'element_list_radio_buttons_parameter', 'element_list_searchbox_parameter', 'element_list_slider_parameter']);
        await conditionDialog.addAttributeCondition('element_list_checkbox_parameter');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','In List', 'Books']);
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('(Profit/Cost)', ['By Value','Is Not Null']); 
        await alertDialog.createAlert();

        // check based-on options for other objects
        await toc.openPageFromTocMenu({ chapterName: 'Based On Option', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization 1');

        // create alert2 for other objects 
        await alertDialog.inputName('Alert 2');
        await alertDialog.selectHighlightedMetric('_Cost');
        await alertDialog.addCondition();
        since('Based on dropdown for column set1 should have #{expected} options, instead we have #{actual}')
            .expect(await conditionDialog.getBasedOnDropDownElementsText()).toEqual(['Customer Age','Year', '_Cost', 'Margin', 'element_list_checkbox_parameter', 'element_list_dropdown_parameter', 'element_list_dynamic_parameter', 'element_list_radio_buttons_parameter', 'element_list_searchbox_parameter', 'element_list_slider_parameter']);
        await conditionDialog.addMetricConditionWithoutApply('Margin', ['Greater than']);
        await conditionDialog.selectParameter('number_fixed_list_no_default_radio_buttons_parameter');
        await conditionDialog.applyCondition();
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('element_list_dropdown_parameter');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Customer Age', ['Selecting in list','In List', '20']);
        await alertDialog.createAlert();

        // go back to previous page to create alert3
        await toc.openPageFromTocMenu({ chapterName: 'Grid/Graph', pageName: 'Page 1' });
        await baseVisualization.selectAlertOnVisualizationMenu('Mordern');
        await alertDialog.inputName('Alert 3');
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.addCondition();
        since('Based on dropdown for column set1 should have #{expected} options, instead we have #{actual}')
            .expect(await conditionDialog.getBasedOnDropDownElementsText()).toEqual(['Category', '(Profit/Cost)', 'Cost', 'element_list_checkbox_parameter', 'element_list_dropdown_parameter', 'element_list_dynamic_parameter', 'element_list_radio_buttons_parameter', 'element_list_searchbox_parameter', 'element_list_slider_parameter']);
        await conditionDialog.addAttributeCondition('element_list_checkbox_parameter');
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Category', ['Selecting in list','In List', 'Music']);
        await alertDialog.addCondition();
        await conditionDialog.addMetricConditionWithoutApply('(Profit/Cost)', ['Greater than']); 
        await conditionDialog.selectParameter('BigDecimal_user_input_no_default_parameter');
        await conditionDialog.applyCondition();
        await alertDialog.createAlert();

        // check alerts in sidebar and edit alert1 and alert 2
        // alert 1
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar('Alert 1');
        since ('1st alert of Highlight metric should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Cost');
        since ('1st alert of Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['element_list_checkbox_parameter Not In List (Empty)', '{Category} In List [Books]', '(Profit/Cost) Is Not Null ']);
        await alertDialog.editConditionByTitle('element_list_checkbox_parameter Not In List (Empty)');
        await conditionDialog.addAttributeCondition('element_list_dynamic_parameter');
        await alertDialog.createAlert();

        // alert 2

        await subscribe.clickEditButtonInSidebar('Alert 2');
        since ('2st alert of Highlight metric should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('_Cost');
        since ('2st alert of Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(
                ['Margin Greater than number_fixed_list_no_default_radio_buttons_parameter', 
                'element_list_dropdown_parameter Not In List (Empty)',
                '{Customer Age} In List [20]'
            ]);
        await alertDialog.selectHighlightedMetric('Margin');
        await alertDialog.editConditionByTitle('{Customer Age} In List [20]');
        await conditionDialog.addAttributeCondition('Customer Age', ['Selecting in list','In List', '25']);
        await alertDialog.addCondition();
        await conditionDialog.addMetricConditionWithoutApply('_Cost', ['By Value','Less than']);
        await conditionDialog.selectMetric('Margin');
        await conditionDialog.applyCondition();
        await alertDialog.addCondition();
        await conditionDialog.addAttributeConditionWithoutApply('Customer Age', ['Qualification on','ID', 'Less than']);
        await conditionDialog.selectAttribute('Year');
        await conditionDialog.applyCondition();
        await alertDialog.createAlert();


        // alert 3

        await subscribe.clickEditButtonInSidebar('Alert 3');
        since ('3st alert of Highlight metric should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Cost');
        since ('3st alert of Bookmark label in alert dialog should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getCurrentBookmarkSelection()).toBe('Subscription Bookmark 1');
        since ('3st alert of Condition expression in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['element_list_checkbox_parameter Not In List (Empty)', '{Category} In List [Music]', '(Profit/Cost) Greater than BigDecimal_user_input_no_default_parameter']);
        await alertDialog.cancelAlert();
    
        
        // check alert1 after editing
        await subscribe.clickEditButtonInSidebar('Alert 1');
        since ('1st alert of Condition expression after editing in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['element_list_dynamic_parameter In List [2014, 2015]', '{Category} In List [Books]', '(Profit/Cost) Is Not Null ']);
        await alertDialog.cancelAlert();

        // check alert2 after editing
        await subscribe.clickEditButtonInSidebar('Alert 2');
        since ('2st alert of Condition expression after editing in alert dialog for editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getConditionExpression()).toEqual(['Margin Greater than number_fixed_list_no_default_radio_buttons_parameter', 'element_list_dropdown_parameter Not In List (Empty)', '{Customer Age} In List [25]', '{Customer Age}(ID) Less than {Year}(ID)', '_Cost Less than Margin']);
        await takeScreenshotByElement(alertDialog.getConditionSection(),'T98936','Condition Section after editing');
        await alertDialog.cancelAlert();
         
    });

    it('[TC98936_01] Alert | Verify alert for highlighted metric has been deleted ', async () => {
        // switch to user with error
        await libraryPage.switchUser(alertWithErrorCredentials);

        // check alert with hihglighted metric has been deleted 
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar('(Auto) Alert Subscription_Error_DeleteObjects');

        // check the error message
        since('Error message should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('The element no longer exists, please reselect');
        
        // select highlighted metric and check the error message
        await alertDialog.selectHighlightedMetric('Discount');
        since('Error message should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getHighlightedMetricOptionValue()).toBe('Discount');
        await alertDialog.cancelAlert();
         
    });


    it('[TC98628_03] Alert | Verify mobile alert creation and update', async () => {

        // create alert for normal grid
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectAlertOnVisualizationMenu('Normal Grid');
        // choose highligted metric and format
        await alertDialog.selectHighlightedMetric('Cost');
        await alertDialog.selectHighlightedMetricFormat('Buttermilk', 'Iceberg');

        // add condition for attribute  
        await alertDialog.addCondition();
        await conditionDialog.addAttributeCondition('Year', ['Selecting in list','In List', '2015']);

        // choose send through type to mobile one
        since('Default send through type should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getCurrentAlertType()).toBe('Email');
        since ('Target device section display should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isTargetDeviceSectionVisible()).toBe(false);
        await alertDialog.selectSendThroughOption('Mobile Notification');
        await alertDialog.selectTargetDevices(['ipad', 'iPad-Demo']);

        // save alert
        await alertDialog.createAlert();

        // // check alert in sidebar
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        since ('Alert type should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getSubscriptionPropertyBySubscriptionName(dossier.name, 'Type')).toBe('Mobile Notification');
        await subscribe.clickEditButtonInSidebar(dossier.name);
        
        // edit the mobile alert to change target devices
        await alertDialog.selectTargetDevices(['Mobile APNS for iPhone', 'iPad-Demo']);
        await alertDialog.createAlert();


        // check the updated one again
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        await subscribe.clickEditButtonInSidebar(dossier.name);
        since('Target devices after editing should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getCurrentTargetDevices()).toEqual('Mobile APNS for iPhone, ipad');
        await alertDialog.cancelAlert();
        //await subscribe.clickRunNowInSubscriptionListByName(dossier.name);
        await subscribe.clickSidebarUnsubscribe(dossier.name);
        await subscribe.clickUnsubscribeYes();
         
    });



    
});
export const config = specConfiguration;
