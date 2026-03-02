import users from '../../../../testData/users.json' assert { type: 'json' };
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/**
 * Test environment: https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/
 *
 * Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/ --xml=specs/regression/config/Locale_OIDC.config.xml --params.loginType=okta --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=****
 */
describe('Library Web Locale Settings - OIDC', () => {
    const baseUrl = 'https://emm.labs.microstrategy.com:6262/MicroStrategyLibrary/';
    const user = users['EMM_OKTA'];
    user.credentials.password = process.env.okta_password;
    //  user.credentials.password = 'Shine1234';
    const admin = users['EMM_web_automation_administrator'];
    const dossierName = 'Locale Test Dossier';
    const errDossierName = 'Locale Test Dossier Create From Cube';

    let { userAccount, libraryPage, loginPage, grid, dossierPage } = browsers.pageObj1;

    afterAll(async () => {
        await setUserLanguage({
            baseUrl: baseUrl,
            adminCredentials: admin.credentials,
            userId: user.id,
            localeId: locales.default,
        });
    });

    it('[TC86641] Verify locale settings function with OIDC authentication modes in Library Web', async () => {
        try {
            await setUserLanguage({
                baseUrl: baseUrl,
                adminCredentials: admin.credentials,
                userId: user.id,
                localeId: locales['Chinese (Simplified)'],
            });

            await loginPage.oktaLogin(user.credentials);
            await libraryPage.waitForLibraryLoading();
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
                .toBe('$4,909,404');
            await since('Date is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Date', headerName: '首个订单日期' }))
                .toBe('2012/1/1');
            await since('Data locale is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: '商品大类' }))
                .toBe('电器');

            await libraryPage.openDefaultApp();
            await userAccount.openUserAccountMenu();
            await userAccount.closeUserAccountMenu();
            // check iserver message locale
            await libraryPage.openDossier(errDossierName);
            await libraryPage.viewErrorDetails();
            await since('Unpublished Dataset error details is shown as #{expected}, instead we have #{actual}')
                .expect(await libraryPage.errorDetails())
                .toContain('区域设置为 中文（中国） 的智能多维数据集(Locale Intelligent Cube)未发布');

            await libraryPage.dismissErrorByText('确定');
            await userAccount.openUserAccountMenu();
            await libraryPage.logout();

            // switch locale
            await setUserLanguage({
                baseUrl: baseUrl,
                adminCredentials: admin.credentials,
                userId: user.id,
                localeId: locales['French (France)'],
            });

            await loginPage.oidcRelogin();
            await libraryPage.waitForLibraryLoading();
            // check display locale
            await userAccount.openUserAccountMenu();
            await since('Preference Button text is supposed to be "#{expected}", instead we have "#{actual}"')
                .expect(await userAccount.getPreferenceText())
                .toBe('Préférences');
            await libraryPage.closeUserAccountMenu();

            // check number, date and md&data locale
            await libraryPage.openDossier(dossierName);
            await dossierPage.waitForDossierLoading();
            await since('Number cost is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: 'Coût' }))
                .toBe('$2 886 348');
            await since('Date is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Date', headerName: 'Date de la première commande' }))
                .toBe('01/01/2012');
            await since('Data locale is shown as #{expected}, instead we have #{actual}')
                .expect(await grid.firstElmOfHeader({ title: 'Number', headerName: 'Catégorie' }))
                .toBe('Électronique');

            await libraryPage.openDefaultApp();
            await userAccount.openUserAccountMenu();
            await userAccount.closeUserAccountMenu();
            // check iserver message locale
            await libraryPage.openDossier(errDossierName);
            await libraryPage.viewErrorDetails();
            await since('Unpublished Dataset error details is shown as #{expected}, instead we have #{actual}')
                .expect(await libraryPage.errorDetails())
                .toContain(
                    `Intelligent Cube (Locale Intelligent Cube) du paramètre régional français (France) n'est pas publié`
                );

            await libraryPage.dismissErrorByText('OK');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC86641: ', e.message);
                return;
            }
            throw e;
        }
    });
});
