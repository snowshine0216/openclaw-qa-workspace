import { browser } from '@wdio/globals'
import { ExpressionType, FunctionName, UnitType } from '../../../pageObjects/library/authoring/utils/model.js'
import loginPage from '../../../pageObjects/library/authoring/library.login.page.js'
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import ConditionalFormatEditor from '../../../pageObjects/library/authoring/conditionalFormat.editor.js'
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

describe('Reset element conditions', () => {
    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login({username: 'auto_cf', password: 'newman1#'});
    });

    it('[TC90584_reset] Delete current thresholds if exists', async () => {   
        const dossierInfo_1 = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '22D6CCCA4F2CF753C4D3478517E29A12',
            dossierName: 'cf_sanity_base_1',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        const dossierInfo_2 = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: 'FC096CE5458C8D2260C45A9273491402',
            dossierName: 'cf_sanity_base_2',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        const dossierInfo_3 = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '635414A74B1F5D52DF53129DB1F4F881',
            dossierName: 'cf_sanity_base_3',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        const dossierInfo_4 = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '1CC6156049805CF98F8AEB848B3CAE56',
            dossierName: 'cf_sanity_base_4',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        const dossierInfo_5 = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '313247544BE61F427D272AB1AB60B968',
            dossierName: 'cf_sanity_base_5',
            pageKey: 'W84',
            filterKey: 'K46',
        };

        const dossierInfo_mix = {
            projectId: PROJECTS.TUTO.projectId,
            dossierId: '8BC0F51C488D4BBC4EFA14B402AC4FB9',
            dossierName: 'cf_derivedElement_base_1',
            pageKey: 'K200',
            filterKey: 'K193',
        };

        // define test element: normal text box
        const textBoxNodeKey = 'W123';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };

        // define test element: html container
        const htmlContainerNodeKey = 'W131';
        const htmlContainerUnitInfo = {
            type: UnitType.HTML,
            nodeKey: htmlContainerNodeKey
        };

        // define test element: image box
        const imageNodeKey = 'W127';
        const imageUnitInfo = {
            type: UnitType.IMAGE,
            nodeKey: imageNodeKey
        };

        // define test element: shape
        const shapeNodeKey = 'W129';
        const shapeUnitInfo = {
            type: UnitType.SHAPE,
            nodeKey: shapeNodeKey
        };

        // define test element: rich text
        const richTextNodeKey = 'W125';
        const richTextUnitInfo = {
            type: UnitType.RICHTEXT,
            nodeKey: richTextNodeKey
        };

         // define test element: normal text box for dossier 'cf_derivedElement_base_1
         const textBoxNodeKey_mix = 'W244';
         const textBoxUnitInfo_mix = {
             type: UnitType.TEXT,
             nodeKey: textBoxNodeKey_mix
         };

        await libraryPage.openUrl(dossierInfo_1.projectId, dossierInfo_1.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorText: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorText.checkExistingCondition() == 0) {
            await conditionalFormatEditorText.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorText.clickThresholdDeleteButton();
            await conditionalFormatEditorText.saveConditionalFormat();
        }
        await authoringPage.saveDossier();
        
       await libraryPage.openUrl(dossierInfo_2.projectId, dossierInfo_2.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(htmlContainerUnitInfo);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorHTML: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorHTML.checkExistingCondition() == 0) {
            await conditionalFormatEditorHTML.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorHTML.clickThresholdDeleteButton();
            await conditionalFormatEditorHTML.saveConditionalFormat();
        }
        await authoringPage.saveDossier();

       await libraryPage.openUrl(dossierInfo_3.projectId, dossierInfo_3.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(richTextUnitInfo);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorRichText: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorRichText.checkExistingCondition() == 0) {
            await conditionalFormatEditorRichText.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorRichText.clickThresholdDeleteButton();
            await conditionalFormatEditorRichText.saveConditionalFormat();
        }
        await authoringPage.saveDossier();

       await libraryPage.openUrl(dossierInfo_4.projectId, dossierInfo_4.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(imageUnitInfo);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorImage: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorImage.checkExistingCondition() == 0) {
            await conditionalFormatEditorImage.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorImage.clickThresholdDeleteButton();
            await conditionalFormatEditorImage.saveConditionalFormat();
        }
        await authoringPage.saveDossier();

       await libraryPage.openUrl(dossierInfo_5.projectId, dossierInfo_5.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(shapeUnitInfo);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorShape: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorShape.checkExistingCondition() == 0) {
            await conditionalFormatEditorShape.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorShape.clickThresholdDeleteButton();
            await conditionalFormatEditorShape.saveConditionalFormat();
        }
        await authoringPage.saveDossier();

       await libraryPage.openUrl(dossierInfo_mix.projectId, dossierInfo_mix.dossierId);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenu(textBoxUnitInfo_mix);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditorText_mix: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        if (await conditionalFormatEditorText_mix.checkExistingCondition() == 0) {
            await conditionalFormatEditorText_mix.cancelConditionalFormat();
        }
        else {
            await conditionalFormatEditorText_mix.clickThresholdDeleteButton();
            await conditionalFormatEditorText_mix.saveConditionalFormat();
        }
        await authoringPage.saveDossier();

    });
  
});