import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botAdModeUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';


describe('Pause mode for prompt', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const PromptBot = {
        id: '7330F948C346ED5766D736A03F32DA67',
        name: 'AdMode-Prompt',
        dataset1: 'Auto_Advanced_promptrpt',
        dataset2: 'Auto_Advanced_normalrpt',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };


    let { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage, 
        botAuthoring, 
        aibotDatasetPanel,
        aibotChatPanel, 
        toolbar, 
        datasetsPanel, 
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botAdModeUser);
        await browser.execute(() => {
            localStorage.setItem('debugMojo', '1');
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95824] pause mode when prompt dataset exist', async () => {
        await libraryPage.editBotByUrl({ projectId: PromptBot.project.id, botId: PromptBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        // check disabled buttons
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
        .toBe(true);
        await since('Advanced button enabled should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isAdvancedButtonEnabled())
        .toBe(false);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('hello');
        await since('Send icon disabled should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
        .toBe(true);
        // delete prompt dataset and everything should be back to normal
        await aibotDatasetPanel.clickOneDatasetManipuButton(PromptBot.dataset1, 'Delete');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('Delete prompt, error icon displays should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
        .toBe(false);
        await since('Delete prompt, advanced button enabled should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isAdvancedButtonEnabled())
        .toBe(true);
        await since('Delete prompt, send icon disabled should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
        .toBe(false);
        // go to advanced mode
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('advanced mode execute should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.getButtonFromToolbar('Pause Data Retrieval').isExisting() )
        .toBe(true);
        // import prompt dataset
        // add dataset from toolbar
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('Existing Dataset...');
        await dossierAuthoringPage.searchSelectDataset(PromptBot.dataset1);
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('dataset count should be #{expected}, instead we have #{actual}')
        .expect (await datasetsPanel.getDatasetCount())
        .toBe(3); 
        await since('with Prompt dataset, the apply button disabled should be #{expected}, instead we have #{actual}')
        .expect(await dossierAuthoringPage.isApplyButtonDisabled())
        .toBe(true);
        await since('pause button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Resume Data') )
        .toBe(true);
        const dsPanelMenuBtn = await dossierAuthoringPage.getDatasetPanelMenuBtn();
        await dossierAuthoringPage.openMenuByClick(dsPanelMenuBtn);
        await dossierAuthoringPage.actionOnSubmenu('Collapse All');
        await dossierAuthoringPage.openMenuByClick(dsPanelMenuBtn);
        await dossierAuthoringPage.actionOnSubmenu('Expand All');
        await checkElementByImageComparison(
            dossierAuthoringPage.getDatasetPanel(),
            'advancedMode/TC95824',
            'promptdataset',
            1
        );
        const ds1Btn = await dossierAuthoringPage.getDatasetOptionBtn(PromptBot.dataset1);
        await dossierAuthoringPage.openMenuByClick(ds1Btn);
        await dossierAuthoringPage.actionOnSubmenu('Delete');
        await dossierAuthoringPage.waitForCurtainDisappear();
        await browser.pause(2000);
        await since('pause button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Resume Data') )
        .toBe(false);
        await since('delete Prompt dataset, the apply button disabled should be #{expected}, instead we have #{actual}')
        .expect(await dossierAuthoringPage.isApplyButtonDisabled())
        .toBe(false);
        // go back to bot and go to advanced mode again, still execute mode
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('Pause button exist should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.getButtonFromToolbar('Pause Data Retrieval').isExisting() )
        .toBe(true);
    });
   
});
