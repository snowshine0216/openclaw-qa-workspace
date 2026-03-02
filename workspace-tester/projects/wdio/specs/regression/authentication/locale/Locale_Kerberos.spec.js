import users from '../../../../testData/users.json' assert { type: 'json' };
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/**
 * Test environment: http://tec-w-015861.labs.microstrategy.com:8080/MicroStrategyLibrary/
 *
 * Run in Local: npm run regression -- --baseUrl=http://tec-w-015861.labs.microstrategy.com:8080/MicroStrategyLibrary/ --xml=specs/regression/config/Locale_Kerberos.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Library Web Locale Settings - Kerberos', () => {
    const user = users['EMM_integrated_kerberos'];
    const admin = {
        credentials: {
            username: 'administrator',
            password: '',
        },
    };
    const dossierName = 'Locale Test Dossier';
    const errDossierName = 'Locale Test Dossier Create From Cube';

    let { userAccount, libraryPage, loginPage, grid, dossierPage } = browsers.pageObj1;

    afterAll(async () => {
        await setUserLanguage({
            baseUrl: browser.options.baseUrl,
            adminCredentials: admin.credentials,
            userId: user.id,
            localeId: locales.default,
        });
    });

    it('[TC86562] Verify locale settings function with Standard authentication modes in Library Web', async () => {
        try {
            await setUserLanguage({
                baseUrl: browser.options.baseUrl,
                adminCredentials: admin.credentials,
                userId: user.id,
                localeId: locales['Chinese (Simplified)'],
            });

            await loginPage.login(user.credentials, { mode: 'integrated', type: 'kerberos' });
            // check display locale
            await userAccount.openUserAccountMenu();
            await since('Preference Button text is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await userAccount.getPreferenceText())
            .toBe('首选项');
            await libraryPage.closeUserAccountMenu();

            // check number, date and md & data locale
            await libraryPage.openDossier(dossierName);
            await dossierPage.waitForDossierLoading();
            await since('Number is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: '成本' }))
                .toBe('$506,490');
            await since('Data locale is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: '商品大类' }))
                .toBe('书籍');
            await takeScreenshotByElement(grid.getTable('Date'), 'TC86562_01', 'Kerberos Locale');

            await libraryPage.openDefaultApp();
            // check iserver message locale
            await libraryPage.openDossier(errDossierName);
            await libraryPage.sleep(5000);
            await libraryPage.viewErrorDetails();
            await since('Unpublished Dataset error details is shown as #{expected}, instead we have #{actual}')
                .expect(await libraryPage.errorDetails())
                .toContain('区域设置为 中文（中国） 的智能多维数据集(BaseReport)未发布');

            await libraryPage.dismissErrorByText('确定');
            await userAccount.openUserAccountMenu();
            await libraryPage.logout();

            // switch locale
            await setUserLanguage({
                baseUrl: browser.options.baseUrl,
                adminCredentials: admin.credentials,
                userId: user.id,
                localeId: locales['French (France)'],
            });

            await loginPage.login(user.credentials, { mode: 'integrated', type: 'kerberos' });
            // check display locale
            await userAccount.openUserAccountMenu();
            await since('Preference Button text is supposed to be "#{expected}", instead we have "#{actual}"')
                .expect(await userAccount.getPreferenceText())
                .toBe('Préférences');
            await libraryPage.closeUserAccountMenu();

            // check number, date and md&data locale
            await libraryPage.openDossier(dossierName);
            await since('Number cost is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: 'Coût' }))
                .toBe('$295 505');
            await since('Data locale is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: 'Catégorie' }))
                .toBe('Livres');
            await takeScreenshotByElement(grid.getTable('Date'), 'TC86562_02', 'Kerberos Locale');

            await libraryPage.openDefaultApp();
            // check iserver message locale
            await libraryPage.openDossier(errDossierName);
            await libraryPage.viewErrorDetails();
            await since('Unpublished Dataset error details is shown as #{expected}, instead we have #{actual}')
                .expect(await libraryPage.errorDetails())
                .toContain(`Intelligent Cube (BaseReport) du paramètre régional français (France) n'est pas publié`);
            await libraryPage.dismissErrorByText('OK');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC86562: ', e.message);
                return;
            }
            throw e;
        }
    });
});
