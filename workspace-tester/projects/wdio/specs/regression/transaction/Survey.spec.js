import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Survey for TXN test', () => {
    const surveyTXN = {
        id: 'CCD3F6FD41EE3196707E09A54AF136ED',
        name: 'Survey Widget',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, survey } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await survey.goToLibrary();
    });

    it('[TC79865]  Verify Survey Widget on Library RSD', async () => {
        // open transaction document
        await libraryPage.openDossier(surveyTXN.name);
        await survey.waitDataLoaded();

        // check initial rendering for survey
        await takeScreenshotByElement(survey.getSurveyContainer(), 'TC79865_01', 'Survey_Initial');

        // do changes on survey and submit
        await survey.inputTextField('1. Text Field - Source - input yes', 'yes');
        await survey.inputTextField('2. Text Field - Target', 'target');
        await survey.inputTextArea('3. Text Area - Source - input a12', 'a12');
        await survey.inputTextArea('4. Text Area - Target', 'target');
        await survey.chooseList('5. Radio Button - Source - choose B', 'Good');
        await survey.chooseList('6. Radio Button - Target', 'M');
        await survey.chooseList('7. Pop-Over Radio Button - Source - Choose P or Y', 'T');
        await survey.chooseList('8. Pop-Over Radio Button - Target', 'Playing');
        await survey.chooseList('9. Check Box - Source - Choose 1 of them', 'Cherry');
        await survey.chooseList('10. Check Box - Target', 'Meat');
        await survey.chooseList('11. Pop-Over Check Box - Source - Choose iPad', 'iPad');
        await survey.chooseList('12. Pop-Over Check Box - Target', 'Mi');
        await survey.inputTextField('13. Dropdown List - Source - Choose even Sheep', 'even sheep');
        await survey.goNext();
        await survey.chooseDropDownList('14. Dropdown List - Target', 'Dog1');
        await survey.submitChanges();

        // check result
        await survey.waitWidgetLoaded();
        await takeScreenshotByElement(survey.getSurveyContainer(), 'TC79865_02', 'Survey_AfterSubmit');
    });
});
export const config = specConfiguration;
