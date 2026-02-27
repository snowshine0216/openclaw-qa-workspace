import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
describe('LibrarySubscription - Manage subscriptions which contains prompts in Library', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscriptionDialog,
        infoWindow,
        sidebar,
        userAccount,
        promptObject,
        promptEditor,
    } = browsers.pageObj1;

    let prompt, cart;

    const MQPromptName = 'Cost';
    const AEPromptName = 'Year';

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_subscription_copy', password: 'newman1#'});
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
    });


    it('[F43156_ReportWithPrompt] Check prompt for report subscription in Library', async() => {
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.editPromptInSubscription('Report_PP');
        await takeScreenshotByElement(subscriptionDialog.getPromptDialog(), 'F43156_ReportWithPrompt', 'PromptDialog_ViewSummaryOn', {tolerance: 0.3}); 

        // change prompt answer for cost MQ - shopping cart
        await promptEditor.clickPromptIndexByTitle(MQPromptName);
        // update cost MQ prompt
        prompt = await promptObject.getPromptByName(MQPromptName);
        cart = promptObject.shoppingCart;
        await cart.openMQFirstValue(prompt, 1);
        await cart.inputValues(prompt, '5');
        await cart.confirmValues(prompt);
        await subscriptionDialog.clickApplyButton();

        // change prompt answer for year AE - shopping cart
        await promptEditor.clickPromptIndexByTitle(AEPromptName);
        prompt = await promptObject.getPromptByName(AEPromptName);
        // add 2020 to selected values
        await cart.clickElmInAvailableList(prompt, '2020');
        await cart.addSingle(prompt);

        // apply changes
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();

        // check prompt answer in saved subscription
        await subscriptionDialog.editPromptInSubscription('Report_PP');
        // check prompt summary
        await promptEditor.waitForSummaryItem(MQPromptName);
        since('Summary with cost MQ prompt is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                'CostGreater than or equal to5at levelDefault'
            );
        await subscriptionDialog.clickApplyButton();
        since ('Summary with year AE prompt is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(AEPromptName))
            .toEqual('2020');
        await subscriptionDialog.clickCloseButton();
        // change prompt answer for cost MQ - shopping cart back to default
        await subscriptionDialog.editPromptInSubscription('Report_PP');
        await promptEditor.clickPromptIndexByTitle(MQPromptName);
        // update cost MQ prompt
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '1');
        await promptObject.shoppingCart.confirmValues(prompt);

        // apply changes
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();
    });

    it('[F43156_RSDWithPrompt] Check prompt for document subscription in Library', async() => {
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.editPromptInSubscription('Document_PP');
        await takeScreenshotByElement(subscriptionDialog.getPromptDialog(), 'F43156_RSDWithPrompt', 'PromptDialog_ViewSummaryOn', {tolerance: 0.3}); 
        // change prompt answer for cost MQ - shopping cart
        await promptEditor.clickPromptIndexByTitle(MQPromptName);
        // update cost MQ prompt
        prompt = await promptObject.getPromptByName(MQPromptName);
        cart = promptObject.shoppingCart;
        await cart.openConditionDropdown(prompt, 1);
        await cart.selectCondition(prompt, 'Highest%');
        await cart.openMQFirstValue(prompt, 1);
        await cart.clearAndInputValues(prompt, '80');
        await cart.confirmValues(prompt);
       
        await subscriptionDialog.clickApplyButton();
        // change prompt answer for year AE - shopping cart
        await promptEditor.clickPromptIndexByTitle(AEPromptName);
        prompt = await promptObject.getPromptByName(AEPromptName);
        // add all elements to selected values
        await cart.addAll(prompt);
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();

        // check prompt answer in saved subscription
        await subscriptionDialog.editPromptInSubscription('Document_PP');
        // check prompt summary
        await promptEditor.waitForSummaryItem(MQPromptName);
        since('Summary with cost MQ prompt is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                'CostHighest%80%at levelDefault'
            );
        await subscriptionDialog.clickApplyButton();
        since ('Summary with year AE prompt is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(AEPromptName))
            .toEqual('2021, 2022');
        await subscriptionDialog.clickCloseButton();
        // change prompt answer for cost MQ - shopping cart back to default
        await subscriptionDialog.editPromptInSubscription('Document_PP');
        await promptEditor.clickPromptIndexByTitle(MQPromptName);
        // update cost MQ prompt
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await cart.selectCondition(prompt, 'Greater than or equal to');
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '1');
        await promptObject.shoppingCart.confirmValues(prompt);  
        // apply changes
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();
    });

    it('[F43156_DashboardWithPrompt] Check prompt for dashboard subscription in Library', async() => {
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.editPromptInSubscription('Dashboard_Prompt');
        await takeScreenshotByElement(subscriptionDialog.getPromptDialog(), 'F43156_DashboardWithPrompt', 'PromptDialog_ViewSummaryOn_SinglePrompt', {tolerance: 0.3}); 
        // change prompt answer for AE - shopping cart
        await promptEditor.clickPromptIndexByTitle(AEPromptName);
        prompt = await promptObject.getPromptByName(AEPromptName);
        cart = promptObject.shoppingCart;
        // add all elements to selected values
        await cart.addAll(prompt);
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();
        // check prompt answer in saved subscription
        await subscriptionDialog.editPromptInSubscription('Dashboard_Prompt');
        // check prompt summary
        since ('Summary with year AE prompt is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(AEPromptName))
            .toEqual('2020, 2021, 2022, 2023');
        await subscriptionDialog.clickCloseButton();
        // change prompt answer for year AE - shopping cart back to default
        await subscriptionDialog.editPromptInSubscription('Dashboard_Prompt');
        await promptEditor.clickPromptIndexByTitle(AEPromptName);
        // update year AE prompt
        await cart.removeAll(prompt);
        await cart.clickElmInAvailableList(prompt, '2020');
        await cart.addSingle(prompt);
        await cart.clickElmInAvailableList(prompt, '2021');
        await cart.addSingle(prompt);
        // apply changes
        await subscriptionDialog.clickApplyButton();
        await subscriptionDialog.clickSave();
    });

});
