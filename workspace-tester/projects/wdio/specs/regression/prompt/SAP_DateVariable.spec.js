import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('SAP_DateVariable', () => {
    const PromptName1 = 'Manual Date selection';

    const project = {
        id: '06F4B4424AF3D68156873CA7DBC777FF',
        name: 'SAP Project',
    };

    const dossier1 = {
        name: 'Date and search_Dossier',
        id: '75312A29452E40417ACF42B5806D0C5C',
        project,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    let prompt;
    const { credentials } = specConfiguration;
    let { loginPage, dossierPage, libraryPage, promptEditor, grid, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85328] Validate Date Variable SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85328_01', 'Default UI');

        // Choose day
        await promptObject.calendar.openCalendar(prompt);
        await promptObject.calendar.clearAndInputYear(prompt, '2006');
        await promptObject.calendar.openMonthDropDownMenu(prompt);
        await promptObject.calendar.selectMonth(prompt, 'Jan');
        await promptObject.calendar.selectDay(prompt, '10');
        // Check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85328_02', 'Prompt summary');
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(PromptName1))
            .toBe('1/10/2006');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Region attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2005');
    });
});

export const config = specConfiguration;
