import { browser } from '@wdio/globals'
import { exportFrontendUser } from '../../../constants/bot.js';
//import { checkElement as checkElementOri } from '../../../pageObjects/library/authoring/utils/common.js'
import { ExpressionType, FunctionName, UnitType } from '../../../pageObjects/library/authoring/utils/model.js'

import loginPage from '../../../pageObjects/library/authoring/library.login.page.js'
import consumptionPage from '../../../pageObjects/library/authoring/library.consumption.page.js'
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import ConditionalFormatEditor from '../../../pageObjects/library/authoring/conditionalFormat.editor.js'
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
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

describe('Sanity Test for Conditional Display', () => {
    
    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_cf', password: 'newman1#'});
    });

    // Entry: RMC element in layout panel. (text, choose element in list)
    it('[TC90584_1] Layout Panel_RMC: Create attribute condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_AE_InList';
        /* 
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '22D6CCCA4F2CF753C4D3478517E29A12',
            dossierName: 'cf_sanity_base_1',
            pageKey: 'W84',
            filterKey: 'K46',
        };
        // define test element: normal text box
        const textBoxNodeKey = 'W123';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };
        // attribute element in list to be selected
        const condition = {
            target: 'Region',
            et: ExpressionType.AE,
            fn: FunctionName.IN_LIST,
            elements: ['South', 'Southwest'],
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        const textBoxElement = await authoringPage.getUnit(textBoxUnitInfo);
        //Layout panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        //await checkElement(contextMenuElement, 'contextMenu');
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC90584_1','contextMenu', 1);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_1','conditionalFormatEditor', 1);
        //Add new attribute condition: select attribute element in list
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_1','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget(condition.target);
        await conditionEditor.selectExpressionType(condition.et);
        await conditionEditor.selectFunction(condition.fn);
        await conditionEditor.clickElements(condition.elements);
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_1','conditionEditor_after_add_condition', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_1','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_1','layersPanelTree', 1);
        await authoringPage.saveDossier();
        //Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        //await checkElement(viDoc, 'viDoc');
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_1','viDoc', 1);
    });

    // Entry: element’s three dot menu in layout panel. (html container, choose element not in list)
    it('[TC90584_2] Layout Panel_Three dots: Create attribute condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_AE_NotInList';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: 'FC096CE5458C8D2260C45A9273491402',
            dossierName: 'cf_sanity_base_2',
            pageKey: 'W84',
            filterKey: 'K46',
        };
        // define test element: html container
        const htmlContainerNodeKey = 'W131';
        const htmlContainerUnitInfo = {
            type: UnitType.HTML,
            nodeKey: htmlContainerNodeKey
        };
        // attribute element in list to be selected
        const condition = {
            target: 'Year',
            et: ExpressionType.AE,
            fn: FunctionName.NOT_IN_LIST,
            elements: ['2014','2016'],
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        const htmlContainerElement = await authoringPage.getUnit(htmlContainerUnitInfo);
        //Layout panel: Open conditional display dialog from Three-Dots
        await authoringPage.openContextMenuByThreeDots('HTML Container 1');
        const contextMenuElement = await authoringPage.getContextMenuInThreeDots();
        //await checkElement(contextMenuElement, 'contextMenu');
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC90584_2','contextMenu', 1);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_2','conditionalFormatEditor_before_add_threshold', 1);
        //Add new attribute condition: select attribute element in list
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_2','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget(condition.target);
        await conditionEditor.selectExpressionType(condition.et);
        await conditionEditor.clickElements(condition.elements);
        await conditionEditor.selectFunction(condition.fn);
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_2','conditionEditor_after_add_condition', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_2','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_2','layersPanelTree', 1);
        await authoringPage.saveDossier();
        // Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        //await checkElement(viDoc, 'viDoc');
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_2','viDoc', 1);
    });

    // Entry: RMC element in layer panel. (rich text, metric condition: Cost greater than 1000)
    it('[TC90584_3] Layer Panel_RMC: Create metric condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_ME_Operator_GreaterThanValue';
        /*const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '635414A74B1F5D52DF53129DB1F4F881',
            dossierName: 'cf_sanity_base_3',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        // Layer panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenuInLayerPanel('Rich Text');
        const contextMenuElement = await authoringPage.getContextMenuInLayerPanel();
        //await checkElement(contextMenuElement, 'contextMenu');
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC90584_3','contextMenu', 1);
        await authoringPage.clickConditionalDisplayMenuItemInLayerPanel('Conditional Display...');
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_3','conditionalFormatEditor_before_add_threshold', 1);
        // Add new metric condition: Cost Greater than 1000
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_3','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget('Cost');
        await conditionEditor.selectMetricOperator('Greater than');
        await conditionEditor.inputOperatorValue('1000');
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_3','conditionEditor_after_add_condition', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_3','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_3','layersPanelTree', 1);
        await authoringPage.saveDossier();
        // Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        //await checkElement(viDoc, 'viDoc');
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_3','viDoc', 1);
    });

    // Entry: RMC element in layer panel. (image, metric condition: Cost greater than Profit)
    it('[TC90584_4] Layout Panel_RMC: Create metric condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_ME_Operator_GreaterThanMetric';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '1CC6156049805CF98F8AEB848B3CAE56',
            dossierName: 'cf_sanity_base_4',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        // define test element: image box
        const imageNodeKey = 'W127';
        const imageUnitInfo = {
            type: UnitType.IMAGE,
            nodeKey: imageNodeKey
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        const textBoxElement = await authoringPage.getUnit(imageUnitInfo);
        //Layout panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenu(imageUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        //await checkElement(contextMenuElement, 'contextMenu');
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC90584_4','contextMenu', 1);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_4','conditionalFormatEditor_before_add_threshold', 1);
        //Add new metric condition: Cost Greater than Profit
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_4','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget('Cost');
        await conditionEditor.selectMetricOperator('Greater than');
        await conditionEditor.selectOperatorMetric('Profit');
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_4','conditionEditor_after_add_condition', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_4','conditionalFormatEditor_after_add_threshold', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_4','layersPanelTree', 1);
        await authoringPage.saveDossier();
        //Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        //await checkElement(viDoc, 'viDoc');
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_4','viDoc', 1);
    });

    // Entry: element’s three dot menu in layout panel. (shape, attribute and metric mix condition)
    it('[TC90584_5] Layout Panel_Three dots: Create mix condition and check the result', async () => {
        const screenshotPrefix = 'add_threshold_Mix';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '313247544BE61F427D272AB1AB60B968',
            dossierName: 'cf_sanity_base_5',
            pageKey: 'W84',
            filterKey: 'K46',
        };
        // define test element: shape
        const shapeNodeKey = 'W129';
        const shapeUnitInfo = {
            type: UnitType.SHAPE,
            nodeKey: shapeNodeKey
        };
        // attribute element in list to be selected
        const condition = {
            target: 'Region',
            et: ExpressionType.AE,
            fn: FunctionName.IN_LIST,
            elements: ['South'],
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        const shapeElement = await authoringPage.getUnit(shapeUnitInfo);
        //await checkElement(shapeElement, 'shape'); // TODO: add assertion for all checkElement
        //Layout panel: Open conditional display dialog from Three-Dots
        await authoringPage.openContextMenuByThreeDots('Rectangle');
        const contextMenuElement = await authoringPage.getContextMenuInThreeDots();
        //await checkElement(contextMenuElement, 'contextMenu');
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC90584_5','contextMenu', 1);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_before_add_threshold');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionalFormatEditor_before_add_threshold', 1);
        //Add new attribute condition: select attribute element in list
        await conditionalFormatEditor.clickNewCondition();
        const conditionEditor = await conditionalFormatEditor.getConditionEditor();
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_before_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionEditor_before_add_condition', 1);
        await conditionEditor.selectTarget(condition.target);
        await conditionEditor.selectExpressionType(condition.et);
        await conditionEditor.clickElements(condition.elements);
        await conditionEditor.selectFunction(condition.fn);
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionEditor_after_add_condition_1', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold_1');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionalFormatEditor_after_add_threshold_1', 1);
        //await conditionalFormatEditor.clickThresholdDeleteButton();
        await conditionalFormatEditor.clickAddCondition();
        await conditionEditor.selectTarget('Cost');
        await conditionEditor.selectMetricOperator('Less than');
        await conditionEditor.inputOperatorValue('1000');
        //await checkElement(conditionEditor.getElement(), 'conditionEditor_after_add_condition');
        await checkElementByImageComparison(conditionEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionEditor_after_add_condition_2', 1);
        await conditionEditor.saveCondition();
        //await checkElement(conditionalFormatEditor.getElement(), 'conditionalFormatEditor_after_add_threshold_2');
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC90584_5','conditionalFormatEditor_after_add_threshold_2', 1);
        await conditionalFormatEditor.saveConditionalFormat();
        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_5','layersPanelTree', 1);
        await authoringPage.saveDossier();
        //Check results in library page
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        //await checkElement(viDoc, 'viDoc');
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_5','viDoc', 1);
    });

    it('[TC90584_6] Delete thresholds', async () => {
        const screenshotPrefix = 'delete_threshold';
        /*
        const checkElement = async (elementOrSelector: string | any, imageName: string) => {
            return await checkElementOri(elementOrSelector, `${screenshotPrefix}__${imageName}`);
        }
        */     
        const dossierInfo = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '22D6CCCA4F2CF753C4D3478517E29A12',
            dossierName: 'cf_sanity_base_1',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        // define test element: normal text box
        const textBoxNodeKey = 'W123';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };

        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();

        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorShape: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        await conditionalFormatEditorShape.clickThresholdDeleteButton();
        await conditionalFormatEditorShape.saveConditionalFormat();

        const layersPanelTree = await authoringPage.getLayersPanelTree();
        //await checkElement(layersPanelTree, 'layersPanelTree');
        await checkElementByImageComparison(layersPanelTree, 'T4969/conditional_formatting/TC90584_6','layersPanelTree', 1);
        
        await authoringPage.saveDossier();
        await libraryPage.openUrl(dossierInfo.projectId, dossierInfo.dossierId);
        let tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        while(tag_VIDoc == false){   
            tag_VIDoc = await consumptionPage.getVIDoc.isExisting();
        }
        const viDoc = await consumptionPage.getVIDoc;
        await checkElementByImageComparison(viDoc, 'T4969/conditional_formatting/TC90584_6','viDoc', 1);
    });
  
});