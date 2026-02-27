import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { feedbackUserCredentials } from '../../../constants/autoAnswer.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsIgnoreError,
} from '../../../api/mock/mock-response-utils.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Auto Answers Feedback', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const Feedback_E2E = {
        id: '35FE6992FC413B35DB2ED68439C0471F',
        name: 'Dashboard for Auto Answer Feedback',
        project,
    };

    const AA_SmartSuggestions = {
        id: '4D5A9810EA461E197F625CB89FF9BB21',
        name: 'Smart Suggestion Dashboard',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const browserWindowSmallWidth = {
        width: 900,
        height: 1200,
    };

    const customAppWithFeedback = {
        id: null,
        name: 'Auto_ThumbDown_EnableFeedback',
    };

    const customAppWithDisabledFeedback = {
        id: null,
        name: 'Auto_ThumbDown_DisableFeedback',
    };

    const customAppWithDarkTheme = {
        id: null,
        name: 'Auto_ThumbDown_DarkTheme',
    };

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant, interpretation } = browsers.pageObj1;

    const telemetryRequestURL = '/api/mstrServices/library/telemetryProducer/send';

    const openAutoAnswerAndPostQuestion = async () => {
        await resetDossierState({
            credentials: feedbackUserCredentials,
            dossier: Feedback_E2E,
        });
        await libraryPage.openDossier(Feedback_E2E.name);

        // open AI assistant
        await aiAssistant.openAndPin();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.sleep(1000);

        // post question by input
        await aiAssistant.input('What is the profit trend in each category?');
        await aiAssistant.sendQuestionAndWaitForAnswer();
    };

    const openFeedbackDialog = async () => {
        await openAutoAnswerAndPostQuestion();

        // thumb down
        await aiAssistant.sleep(1000);
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getFeedbackContainer(1));
    };

    const createCustomAppForFeedback = async () => {
        // create custom app with feedback enabled
        const enabledFeedbackBody = getCustomAppBody({
            version: 'v6',
            name: customAppWithFeedback.name,
            aiSettings: {
                feedback: true,
                learning: true,
            },
        });
        customAppWithFeedback.id = await createCustomApp({
            credentials: feedbackUserCredentials,
            customAppInfo: enabledFeedbackBody,
        });
    };

    const createCustomAppForDisabledFeedback = async () => {
        // create custom app with feedback disabled
        const disableFeedbackBody = getCustomAppBody({
            version: 'v6',
            name: customAppWithDisabledFeedback.name,
            aiSettings: {
                feedback: false,
                learning: true,
            },
        });
        customAppWithDisabledFeedback.id = await createCustomApp({
            credentials: feedbackUserCredentials,
            customAppInfo: disableFeedbackBody,
        });
    };

    const createCustomAppInDarkThemeWithFeedback = async () => {
        // create custom app with feedback enabled and dark theme
        const darkThemeBody = getCustomAppBody({
            version: 'v6',
            name: customAppWithDarkTheme.name,
            theme: appConsts.darkTheme,
            aiSettings: {
                feedback: true,
                learning: true,
            },
        });
        customAppWithDarkTheme.id = await createCustomApp({
            credentials: feedbackUserCredentials,
            customAppInfo: darkThemeBody,
        });
    };

    beforeEach(async () => {
        await libraryPage.openCustomAppById({ id: customAppWithFeedback.id });
    });

    beforeAll(async () => {
        await loginPage.login(feedbackUserCredentials);
        await createCustomAppForFeedback();
        await createCustomAppForDisabledFeedback();
        await createCustomAppInDarkThemeWithFeedback();
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: feedbackUserCredentials,
            customAppIdList: [customAppWithFeedback.id, customAppWithDisabledFeedback.id, customAppWithDarkTheme.id],
        });
    });

    it('[TC94700_01] Validate E2E workflow for Thumb down and Feedback', async () => {
        await openAutoAnswerAndPostQuestion();

        let requestCount = 0;
        const mock = await browser.mock('**' + telemetryRequestURL, {
            method: 'POST',
            statusCode: 204,
        });
        mock.on('request', () => {
            requestCount++;
        });

        // thumb down to trigger feedback, check thumb down position
        await aiAssistant.sleep(1000);
        await aiAssistant.hover({ elem: aiAssistant.getAnswers()[0] });
        const thumbDownButtonYPosition = (await (await aiAssistant.getThumbDownIcon(1)).getLocation()).y;

        await aiAssistant.clickThumbDown(1);
        const thumbDownButtonSelectedYPosition = (await (await aiAssistant.getThumbDownIconSelected(1)).getLocation())
            .y;
        await since(
            'Thumb down, thumb down icon and thumb down selected icon position should be the same, while we get different positions #{expected} and #{actual}'
        )
            .expect(thumbDownButtonYPosition)
            .toEqual(thumbDownButtonSelectedYPosition);
        await aiAssistant.waitForElementVisible(aiAssistant.getFeedbackContainer(1));

        await since('Thumb down, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(true);
        await since('Thumb down, thumb down icon should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThumbDownButtonHighlighted(1))
            .toBe(true);

        // provide input and select tag, then submit feedback
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);

        // check thanks for your feedback and network requests
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await since('Submit feedback, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThanksForYourFeedbackVisible(1))
            .toBe(true);
        // Wait for response of telemetry request
        await aiAssistant.sleep(3000);
        await since('Thumb down, submit feedback should send #{expected} telemetry requests, while we get #{actual}')
            .expect(requestCount)
            .toBe(2);
    });

    it('[TC94700_02] Validate provide feedback', async () => {
        await openFeedbackDialog();

        await aiAssistant.clickFeedbackTag(1, 1);
        await since('Click tag, submit button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackSubmitButtonDisabled(1))
            .toBe(false);
        await aiAssistant.clickFeedbackTag(1, 2);
        await since('Click another tag, previous tag selected should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackCategoryButtonSelected(1, 1))
            .toBe(false);
        await since('Click tag, tag selected should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackCategoryButtonSelected(1, 2))
            .toBe(true);

        await aiAssistant.clickFeedbackTag(1, 2);
        await since('Click tag again, submit button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackSubmitButtonDisabled(1))
            .toBe(true);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await since('Input message, submit button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackSubmitButtonDisabled(1))
            .toBe(false);
    });

    it('[TC94700_03] Validate dismiss feedback', async () => {
        await openFeedbackDialog();
        await aiAssistant.closeFeedbackDialog(1);
        await since('Thumb down, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(false);
        await since('Thumb down, thumb down icon highlighted should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThumbDownButtonHighlighted(1))
            .toBe(true);
        await since('Thumb down, thumb down icon clickable should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThumbDownButtonVisible(1))
            .toBe(false);
        await aiAssistant.clickThumbDownSelected(1);
        await since('Thumb down, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(false);
    });

    it('[TC94700_04] Validate open multiple feedback dialogs', async () => {
        await openFeedbackDialog();
        // post question by input 2
        await aiAssistant.input('Which year had the highest profit?');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // thumb down 2
        await aiAssistant.clickThumbDown(2);
        await since('Thumb down, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(2))
            .toBe(true);
        await since('Thumb down, thumb down icon should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThumbDownButtonHighlighted(2))
            .toBe(true);

        // feedback 1
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.submitFeedback(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await since('Submit feedback, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThanksForYourFeedbackVisible(1))
            .toBe(true);

        // feedback 2
        await aiAssistant.clickFeedbackTag(2, 3);
        await aiAssistant.submitFeedback(2);
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(2));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(2));
        await since('Submit feedback, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThanksForYourFeedbackVisible(2))
            .toBe(true);
    });

    it('[TC94700_05] Validate message for feedback dialog', async () => {
        await openFeedbackDialog();
        await aiAssistant.inputFeedbackMessage(
            1,
            'This is a long input message feedback. This is a long input message feedback. This is a long input message feedback. This is a long input message feedback. This is a long input message feedback. This is a long input message feedback. This is a long input message feedback.'
        );
        await takeScreenshotByElement(
            aiAssistant.getFeedbackContainer(1),
            'TC94700_05',
            'Long input message in feedback dialog'
        );
    });

    it('[TC94700_06] Validate responsive view for feedback dialog', async () => {
        await openFeedbackDialog();
        await aiAssistant.clickFeedbackTag(1, 1);
        await takeScreenshotByElement(
            aiAssistant.getFeedbackContainer(1),
            'TC94700_06',
            'Default auto answer size for feedback dialog'
        );

        await aiAssistant.clickMaxMinBtn();
        await takeScreenshotByElement(
            aiAssistant.getFeedbackContainer(1),
            'TC94700_06',
            'Full screen auto answer size for feedback dialog'
        );

        await setWindowSize(browserWindowSmallWidth);
        await aiAssistant.sleep(1000);
        await takeScreenshotByElement(
            aiAssistant.getFeedbackContainer(1),
            'TC94700_06',
            'Resize browser for feedback dialog'
        );
        await setWindowSize(browserWindow);
    });

    it('[TC94701_01] Validate X-Func with other auto answer features', async () => {
        await resetDossierState({
            credentials: feedbackUserCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();
        await aiAssistant.sleep(1000);

        // mock ambiguous response and smart suggestions
        await mockAmbiguousAndFollowUpResponse(true, false);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me the highest airline');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);

        // thumb down to trigger feedback dialog
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getFeedbackContainer(1));
        await since('Thumb down, feedback dialog present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(true);
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(false);
        await aiAssistant.clickFeedbackTag(1, 1);
        await interpretation.clickCIFromAnswer(1);
        await since(
            'Click interpretation icon, interpretation section visible should be #{expected}, while we get #{actual}'
        )
            .expect(await interpretation.isInterpretationSectionVisible())
            .toBe(true);

        const interpretationSectionYPosition = (await (await interpretation.getInterpretationSection(1)).getLocation())
            .y;
        const feedbackContainerYPosition = (await (await aiAssistant.getFeedbackContainer(1)).getLocation()).y;
        await since('Interpretation section should be above feedback dialog, while we get below')
            .expect(interpretationSectionYPosition)
            .toBeLessThan(feedbackContainerYPosition);
    });

    it('[TC94701_02] Validate X-Func with custom app', async () => {
        // disable thumb down and feedback
        await libraryPage.openCustomAppById({ id: customAppWithDisabledFeedback.id });
        await openAutoAnswerAndPostQuestion();
        await since('Disable feedback, thumb down button visible should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isThumbDownButtonVisibleOnHover(1))
            .toBe(false);
        await dossierPage.goToLibrary();

        // dark theme
        await libraryPage.openCustomAppById({ id: customAppWithDarkTheme.id });
        await openFeedbackDialog();
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await takeScreenshotByElement(
            aiAssistant.getFeedbackContainer(1),
            'TC94701_02',
            'Dark theme custom app for feedback dialog'
        );
    });
});
