import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Prompt UI Issues', () => {
    const dossier = {
        id: 'D6FDB40F43A23EADBD5BC8ACB994410E',
        name: 'long prompt title and desc name',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    const browserWindow = {
        width: 1600,
        height: 1000,
    };

    let { loginPage, libraryPage, dossierPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC83470] Validate Prompt with long name/desc and no blank space in Library', async () => {
        await resetDossierState({ credentials, dossier: dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC83470_01', 'UI display of prompt');
        await promptObject.selectPromptByIndex({
            index: '5',
            promptName:
                'CostwithlongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnameEND',
        });
        // await takeScreenshotByElement(promptEditor.getPromptEditor(),'TC83470_02','UI display of prompt after switch to last prompt');
        await promptEditor.toggleViewSummary();
        // await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC83470_03', 'UI display of prompt summary');
    });
});

export const config = specConfiguration;
