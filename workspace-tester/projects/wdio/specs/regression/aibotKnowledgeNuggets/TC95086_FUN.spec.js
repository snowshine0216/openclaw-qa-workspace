import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('TC95086: [FUN] Knowledge Nuggets in AI Bot', () => {
    let {
        dossierPage,
        loginPage,
        aibotChatPanel,
        libraryPage,
        aibotSnapshotsPanel,
        botConsumptionFrame,
        botAuthoring,
        botAppearance,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await dossierPage.goToLibrary();
    });

    it('Test interpretation in chatbot', async () => {
        await libraryPage.openDossier('Knowledge Nuggets Automation Bot');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Michael have?');
        await aibotChatPanel.openInterpretation();
        await aibotChatPanel.clickNuggetTriggerIcon();
        await expect(await aibotChatPanel.getNuggetsPopoverContentDatasetTitle().getText()).toBe(
            'Employee data new 2024-09-17T10:56:41'
        );
        await expect(await aibotChatPanel.getNuggetsPopoverContentDefinition().getText()).toBe('2. Michael Smith');
    });

    it('Test interpretation in snapshot and maximize view and clear snapshot panel', async () => {
        await aibotChatPanel.takeSnapshot();
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotSnapshotsPanel.clickInterpretationFromSnapshot();
        await aibotSnapshotsPanel.clickSnapshotNuggetTriggerIcon();
        await expect(await aibotSnapshotsPanel.getSnapshotNuggetsPopoverContentDatasetTitle().getText()).toBe(
            'Employee data new 2024-09-17T10:56:41'
        );
        await expect(await aibotSnapshotsPanel.getSnapshotNuggetsPopoverContentDefinition().getText()).toBe(
            '2. Michael Smith'
        );
        await aibotSnapshotsPanel.clickSnapshotNuggetTriggerIcon();
        await aibotSnapshotsPanel.clickMaximizeButtonFromSnapshot();
        await aibotSnapshotsPanel.clickInterpretationFromMaximizeView();
        await aibotSnapshotsPanel.clickNuggetTriggerIconFromMaximizeView();

        await expect(await aibotSnapshotsPanel.getNuggetsPopoverContentDatasetTitleFromMaximizeView().getText()).toBe(
            'Employee data new 2024-09-17T10:56:41'
        );
        await expect(await aibotSnapshotsPanel.getNuggetsPopoverContentDefinitionFromMaximizeView().getText()).toBe(
            '2. Michael Smith'
        );

        await aibotSnapshotsPanel.clickCloseFocusViewButton();

        await aibotSnapshotsPanel.clickClearSnapshots();
        await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        await aibotSnapshotsPanel.closeSnapshotsPanel();
    });

    it('Test interpretation with dark mode and edit mode opened', async () => {
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Dark');

        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion('How many customers does Michael have?');
        await aibotChatPanel.openInterpretation();
        await aibotChatPanel.clickNuggetTriggerIcon();
        await expect(await aibotChatPanel.getNuggetsPopoverContentDatasetTitle().getText()).toBe(
            'Employee data new 2024-09-17T10:56:41'
        );
        await expect(await aibotChatPanel.getNuggetsPopoverContentDefinition().getText()).toBe('2. Michael Smith');
    });
});
