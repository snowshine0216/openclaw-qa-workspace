import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('System Prompt', () => {
    const dossier = {
        id: 'DB07015C4A55C1BB6D88A0AFA5E33A8F',
        name: 'System Prompt - Date',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, dossierPage, grid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80231] Validate system prompt in library', async () => {
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('1/1/2014');
    });
});

export const config = specConfiguration;
