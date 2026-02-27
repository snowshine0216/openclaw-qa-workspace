import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import * as pythonTXNActionsInfo from '../../../../constants/dossierTXN.js';

describe('25.06 python TXN and actions privilege', () => {
    let { loginPage, libraryPage, dossierPage, toc, agGridVisualization, contentsPanel, vizPanelForGrid } =
        browsers.pageObj1;
    const noUsePythonScriptsUser = pythonTXNActionsInfo.noUsePythonScriptsUser;
    const noExecuteTXNUser = pythonTXNActionsInfo.noExecuteTXNUser;
    const noWebConfigTxnUser = pythonTXNActionsInfo.noWebConfigTxnUser;
    const txnSanity = pythonTXNActionsInfo.txnSanity;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC91680_1] user does not have Execute Transaction privilege', async () => {
        await loginPage.login(noExecuteTXNUser);
        await libraryPage.openDossier(txnSanity.name);
        await toc.openPageFromTocMenu({ chapterName: 'PythonTXN', pageName: 'Sanity Python TXN' });
        await agGridVisualization.hoverOnAGGridCell('2', 'Sanity');
        const enterTXNModeBtn = await agGridVisualization.getEnterTXNModeBtn();
        const enterTXNModeBtnIsDispalyed = await enterTXNModeBtn.isDisplayed();
        await expect(enterTXNModeBtnIsDispalyed).toBe(false);

        await toc.openPageFromTocMenu({ chapterName: 'Action Btn', pageName: 'Sanity NAB' });
        await dossierPage.clickDossierPanelStackSwitchTab('Standard Script');
        const standardBtn = await $('*[aria-label="Standard 1V"]');
        await since('Action button with aria-label="Standard 1V" should NOT exist')
            .expect(await standardBtn.isExisting())
            .toBe(false);

        await dossierPage.clickDossierPanelStackSwitchTab('Transaction Script');
        await since('Action button named SimpleCase should NOT be present')
            .expect(await $('div.mstrmojo-Button-text=SimpleCase').isExisting())
            .toBe(false);
    });

    it('[TC91680_2] user does not have Use Python Scripts privilege', async () => {
        await loginPage.login(noUsePythonScriptsUser);
        await libraryPage.openDossier(txnSanity.name);
        await toc.openPageFromTocMenu({ chapterName: 'PythonTXN', pageName: 'Sanity Python TXN' });
        await agGridVisualization.hoverOnAGGridCell('2', 'Sanity');
        const enterTXNModeBtn = await agGridVisualization.getEnterTXNModeBtn();
        const enterTXNModeBtnIsDispalyed = await enterTXNModeBtn.isDisplayed();
        await expect(enterTXNModeBtnIsDispalyed).toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Action Btn', pageName: 'Sanity NAB' });
        await dossierPage.clickDossierPanelStackSwitchTab('Standard Script');
        const standardBtn = await $('*[aria-label="Standard 1V"]');
        await since('Action button with aria-label="Standard 1V" should NOT exist')
            .expect(await standardBtn.isExisting())
            .toBe(true);

        await dossierPage.clickDossierPanelStackSwitchTab('Transaction Script');
        await since('Action button named SimpleCase should NOT be present')
            .expect(await $('div.mstrmojo-Button-text=SimpleCase').isExisting())
            .toBe(true);
    });

    it('[TC91680_3] user does not have Web Config Transaction privilege', async () => {
        await loginPage.login(noWebConfigTxnUser);
        await libraryPage.openDossier(txnSanity.name);
        await dossierPage.clickEditIcon();
        await libraryPage.dismissMissingFontPopup();
        // 'You do not have the privileges to modify a dashboard with transaction service enabled...' dialog show
        const partialText = 'You do not have the privileges to modify a dashboard with transaction service enabled';
        const labelDiv = await $('div.mstrmojo-Label.dont-show-popup-text');
        await labelDiv.waitForDisplayed({ timeout: 5000 });
        // const labelText = await labelDiv.getText();
        // await expect(labelText.includes(partialText)).toBe(true);
        const labelText = await browser.execute((el) => el.textContent, await labelDiv);
        console.log('Label text:', labelText);
        await expect(labelText.includes(partialText)).toBe(true);

        await dossierPage.clickCloseBtn();
        await dossierPage.clickVisibleButtonByAriaLabel();

        await contentsPanel.goToPage({ chapterName: 'PythonTXN', pageName: 'Sanity Python TXN' });
        await agGridVisualization.openContextMenu('Sanity');
        const editTransactionOption = await agGridVisualization.getContextMenuOption('Edit Transaction');
        const editTransactionOptionExisted = await editTransactionOption.isExisting();
        await expect(editTransactionOptionExisted).toBe(false);
        const pauseActionOption = await agGridVisualization.getContextMenuOption('Edit Transaction');
        const pauseActionOptionExisted = await pauseActionOption.isExisting();
        await expect(pauseActionOptionExisted).toBe(false);
        const clearTransactionOption = await agGridVisualization.getContextMenuOption('Edit Transaction');
        const clearTransactionOptionExisted = await clearTransactionOption.isExisting();
        await expect(clearTransactionOptionExisted).toBe(false);
        // dismiss context menu
        await agGridVisualization.clickOnAGGridCell('2', 'Sanity');

        // Standard Script
        await contentsPanel.goToPage({ chapterName: 'Action Btn', pageName: 'Sanity NAB' });
        await dossierPage.clickDossierPanelStackSwitchTab('Standard Script');
        await agGridVisualization.openContextMenu('Standard-1V| No Refresh + No banner');
        const configureTXNOption = await agGridVisualization.getContextMenuOption('Configure Transaction');
        const configureTXNOptionExisted = await configureTXNOption.isExisting();
        await expect(configureTXNOptionExisted).toBe(false);
        // dismiss context menu
        await agGridVisualization.clickOnAGGridCell('1', 'Standard-1V| No Refresh + No banner');
        // to show Editor panel of the ag grid
        await vizPanelForGrid.switchToEditorPanel();
        await agGridVisualization.clickOnElement(agGridVisualization.agGridAddColumnSetIcon);
        const actionButtonDiv = await $('div.mtxt=Action Button');
        const actionBtnExists = await actionButtonDiv.isExisting();
        await expect(actionBtnExists).toBe(false);
        // dismiss menu
        await agGridVisualization.clickOnAGGridCell('1', 'Standard-1V| No Refresh + No banner');

        // Transaction Script
        await dossierPage.clickDossierPanelStackSwitchTab('Transaction Script');
        await agGridVisualization.openContextMenu('Transaction| No Refresh + Banner');
        const configureTXNOption2 = await agGridVisualization.getContextMenuOption('Configure Transaction');
        const configureTXNOption2Existed = await configureTXNOption2.isExisting();
        await expect(configureTXNOption2Existed).toBe(false);
        await vizPanelForGrid.switchToEditorPanel();
        await agGridVisualization.clickOnElement(agGridVisualization.agGridAddColumnSetIcon);
        const actionBtn2Exists = await actionButtonDiv.isExisting();
        await expect(actionBtn2Exists).toBe(false);
        await vizPanelForGrid.switchToEditorPanel();
    });
});
