import { noExecuteUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { ExpressionType, FunctionName, UnitType } from '../../../pageObjects/library/authoring/utils/model.js'
import loginPage from '../../../pageObjects/library/authoring/library.login.page.js'
import consumptionPage from '../../../pageObjects/library/authoring/library.consumption.page.js'
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import ConditionalFormatEditor from '../../../pageObjects/library/authoring/conditionalFormat.editor.js'

describe('LibraryExport - Check Export Function of User without Execute Permission', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        excelExportPanel,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    const dossier_noExecuteCase = {
        id: '23BDB2F545E5576BC7AC779B29372081',
        name: 'noExecuteCase',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(noExecuteUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });


    it('[TC99092_1] ThreeDotMenu: Check Icon and Dialog of Conditional Display for User without Execute Permission', async () => {
         await libraryPage.openUrl(dossier_noExecuteCase.project.id, dossier_noExecuteCase.id);
         await libraryAuthoringPage.editDossierFromLibrary();
         await authoringPage.openContextMenuByThreeDots('Text 5');
         const conditionalDisplayWarningIcon = await authoringPage.getConditionalDisplayWarningIcon();
         await checkElementByImageComparison(conditionalDisplayWarningIcon, 'T4969/conditional_formatting/TC99092_1','conditionalDisplayWarningIcon', 1);
         await authoringPage.clickConditionalDisplayMenuItem(conditionalDisplayWarningIcon);
         const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
         await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_1','conditionalDisplayEditor', 1);
         await libraryPage.sleep(1000);
         await conditionalFormatEditor.hoveConditionalDisplayOkButton();
         await libraryPage.sleep(3000);
         await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_1','conditionalDisplayEditorWithTooltipOnOkButton', 1);
         since('Tooltip present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await conditionalFormatEditor.isTooltipPresent()).toBe(true);
    });

    it('[TC99092_2] ContextMenu: Check Icon and Dialog of Conditional Display for User without Execute Permission', async () => {
        // define test element
        const textBoxNodeKey = 'W138';
        const textBoxUnitInfo = {
            type: UnitType.TEXT,
            nodeKey: textBoxNodeKey
        };
        await libraryPage.openUrl(dossier_noExecuteCase.project.id, dossier_noExecuteCase.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        const textBoxElement = await authoringPage.getUnit(textBoxUnitInfo);
        //Layout panel: Open conditional display dialog by RMC
        await authoringPage.openContextMenu(textBoxUnitInfo);
        const contextMenuElement = await authoringPage.getContextMenu();
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC99092_2','contextMenuWithWarningIcon', 1);
        await authoringPage.clickConditionalDisplayMenuItem(contextMenuElement);
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_2','conditionalDisplayEditor', 1);
        await libraryPage.sleep(1000);
        await conditionalFormatEditor.hoveConditionalDisplayOkButton();
        await libraryPage.sleep(3000);
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_2','conditionalDisplayEditorWithTooltipOnOkButton', 1);
        since('Tooltip present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await conditionalFormatEditor.isTooltipPresent()).toBe(true);
    });
    
    it('[TC99092_3] LayerPanel_RMC: Check Icon and Dialog of Conditional Display for User without Execute Permission', async () => {
        await libraryPage.openUrl(dossier_noExecuteCase.project.id, dossier_noExecuteCase.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringPage.openContextMenuInLayerPanel('Rich Text 2');
        const contextMenuElement = await authoringPage.getContextMenuInLayerPanel();
        await checkElementByImageComparison(contextMenuElement, 'T4969/conditional_formatting/TC99092_3','contextMenuInLayerPanel', 1);
        await authoringPage.clickConditionalDisplayMenuItemInLayerPanel('Conditional Display...');
        const conditionalFormatEditor: ConditionalFormatEditor = await authoringPage.getConditionalFormatEditor();
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_3','conditionalDisplayEditor', 1);
        await libraryPage.sleep(1000);
        await conditionalFormatEditor.hoveConditionalDisplayOkButton();
        await libraryPage.sleep(3000);
        await checkElementByImageComparison(conditionalFormatEditor.getElement(), 'T4969/conditional_formatting/TC99092_3','conditionalDisplayEditorWithTooltipOnOkButton', 1);
        since('Tooltip present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await conditionalFormatEditor.isTooltipPresent()).toBe(true);
    });
});