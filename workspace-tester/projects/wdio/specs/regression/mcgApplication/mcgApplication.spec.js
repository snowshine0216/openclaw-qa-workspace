import createCustomApp from '../../../api/customApp/createCustomApp.js';
import editCustomAppAuthMode from '../../../api/customApp/editCustomappAuthMode.js';
import deleteCustomApp from '../../../api/customApp/deleteCustomApp.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';

describe('MCG Application Regression Tests', () => {
    const adminUser = {
        username: browsers.params.credentials.webServerUsername,
        password: browsers.params.credentials.webServerPassword,
    };

    // Generate a unique app name with datetime postfix
    const dateTimePostfix = new Date().toISOString().replace(/[:.]/g, '-');

    it('[TC99662_01] should fail to create application in MGE env if application auth mode contains standard', async () => {
        console.log('🚀 TC99662_01 is running...');
        try {
            await createCustomApp({
                credentials: adminUser,
                customAppInfo: getRequestBody({
                    name: `Web_auto_disableMcgStandard_TC99662_01_${dateTimePostfix}`,
                    availableModes: [1, 1048576],
                    defaultMode: 1048576,
                }),
            });
            fail('❌ Application auth mode creation succeeded unexpectedly');
        } catch (error) {
            console.log('✅ Application auth mode creation failed as expected');
        }
        console.log('🏁 TC99662_01 completed');
    });

    it('[TC99662_02] should fail to update application in MGE env if application auth mode contains standard', async () => {
        console.log('🚀 TC99662_02 is running...');

        const testApplicationId = await createCustomApp({
            credentials: adminUser,
            customAppInfo: getRequestBody({
                name: `Web_auto_disableMcgStandard_TC99662_02_${dateTimePostfix}`,
            }),
        });

        await expect(testApplicationId).toBeDefined();

        try {
            await editCustomAppAuthMode({
                credentials: adminUser,
                id: testApplicationId,
                availableModes: [1, 1048576],
                defaultMode: 1048576,
            });
            fail('❌ Application auth mode update succeeded unexpectedly');
        } catch (error) {
            console.log('✅ Application auth mode update failed as expected');
        }

        await deleteCustomApp({
            credentials: adminUser,
            customAppId: testApplicationId,
        });

        console.log('🏁 TC99662_02 completed');
    });
});
