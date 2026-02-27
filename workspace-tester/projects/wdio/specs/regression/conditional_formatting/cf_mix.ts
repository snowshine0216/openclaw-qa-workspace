import { browser } from '@wdio/globals'
//import { checkElement as checkElementOri } from '../../../pageObjects/library/authoring/utils/common.js'
import { ExpressionType, FunctionName, UnitType } from '../../../pageObjects/library/authoring/utils/model.js'

import loginPage from '../../../pageObjects/library/authoring/library.login.page.js'
import consumptionPage from '../../../pageObjects/library/authoring/library.consumption.page.js'
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import ConditionalFormatEditor from '../../../pageObjects/library/authoring/conditionalFormat.editor.js'
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import collectAutomationResults from '../../../wdioServices/result-summary/collect-auto-results.js';
import parseResult from '../../../wdioServices/result-summary/generateTestSummary.js';
const PROJECTS = {
    TUTO: {
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        projectName: 'Tutorial'
    }
}

let {
    loginPage,    
    libraryPage,
    libraryAuthoringPage,
} = browsers.pageObj1;

describe('X-Function Test for Conditional Display', () => {
    beforeAll(async () => {
await browser.setWindowSize(1200, 800);
        await loginPage.login({username: 'auto_cf', password: 'newman1#'});
    });

    // Create derived attribute condition and check the result
    it('[TC90584_7] Create derived attribute condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_DA_InList';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '8BC0F51C488D4BBC4EFA14B402AC4FB9',
            dossierName: 'cf_derivedElement_base_1',
            pageKey: 'K200',
            filterKey: 'K193',
        };
        // define test element: normal text box
        const textBoxNodeKey = 'W244';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };
        // attribute element in list to be selected
        const condition = {
            target: 'DA_Category1',
            et: ExpressionType.AE,
            fn: FunctionName.IN_LIST,
            elements: ['6', '11'],
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();

        const textBoxElement = await authoringPage.getUnit(textBoxUnitInfo);
        // Layout panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_7','conditionalFormatEditor_before_add_threshold', 1);
        //Add new attribute condition: select attribute element in list
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_7','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget(condition.target);
        await conditionEditor.selectExpressionType(condition.et);
        await conditionEditor.selectFunction(condition.fn);
        await conditionEditor.clickElements(condition.elements);
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_7','conditionEditor_after_add_condition', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_7','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree_1 = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree_1, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree_1, 'T4969/conditional_formatting/TC90584_7','layersPanelTree_1', 1);
        await authoringPage.saveDossier();
        //Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc_1 = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc_1 == false){   
            tag_VIDoc_1 = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc_1 = await consumptionPage.getVIDoc;
        await checkElementByImageComparison(viDoc_1, 'T4969/conditional_formatting/TC90584_7','viDoc_1', 1);

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(textBoxUnitInfo);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorShape: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        await conditionalFormatEditorShape.clickThresholdDeleteButton();
        await conditionalFormatEditorShape.saveConditionalFormat();
        const layersPanelTree_2 = await authoringPage.getLayersPanelTree();
        await checkElementByImageComparison(layersPanelTree_2, 'T4969/conditional_formatting/TC90584_7','layersPanelTree_2', 1);
        
        await authoringPage.saveDossier();
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc_2 = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc_2 == false){   
            tag_VIDoc_2 = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc_2 = await consumptionPage.getVIDoc;
        await checkElementByImageComparison(viDoc_2, 'T4969/conditional_formatting/TC90584_7','viDoc_2', 1);
    });       

    // Check RA in conditional display dialog
    it('[TC90584_8] Check unsupported element in conditional display dialog', async () => {
        const screenshotPrefix = 'check unsupported element';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: 'FA64A4BC4E4B5AD776B6848182B120CB',
            dossierName: 'cf_unsupported_RA',
            pageKey: 'WA6F9E118EA884282876BB9D7A229E179',
            filterKey: 'K46',
        };
        // define test element: normal text box
        const textBoxNodeKey = 'W119';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        const textBoxElement = await authoringPage.getUnit(textBoxUnitInfo);
        // Layout panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_8','conditionalFormatEditor_before_add_threshold', 1);
        // Add new attribute condition: check element in list
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'check conditional element list');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_8','check_conditional_ element_list', 1);
        await conditionEditor.cancelCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_8','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.cancelConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_8','layersPanelTree', 1);
        await authoringPage.saveDossier();
        // Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_8','viDoc', 1);
    });    
    

});
