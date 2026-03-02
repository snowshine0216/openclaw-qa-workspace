import { autoDashBrowserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_PageByImageUpload.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Privileges on Auto Dash 2.0', () => {
    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, dossierAuthoringPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(autoDashBrowserWindow);
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    beforeEach(async () => {
        await loginPage.login(bot.autoDashUser);
    });

    afterEach(async () => {
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('ACIT-3864_01_Privilege to control image upload', async () => {
        // back to home page
        await libraryPage.resetToLibraryHome();

        // switch to privilege user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.autoDashNoImagePrivUser);

        // open auto dash
        await libraryPage.editDossierByUrl({
            projectId: AutoDash2.projectId,
            dossierId: AutoDash2.id,
        });
        await autoDashboard.openAutoDashboard();

        // check image upload button
        await since('Upload image button display should be #{expected}, while we get #{actual}')
            .expect(await autoDashboard.isUploadImageBtnDisplayed())
            .toBe(false);
    });
});
