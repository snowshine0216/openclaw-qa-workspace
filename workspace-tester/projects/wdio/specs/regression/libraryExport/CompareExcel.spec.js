import path from 'path';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import '../../../utils/toMatchExcel.js';

const baselineDirectory = 'resources';
const downloadDirectory = 'downloads';

describe('LibraryExport - Export Dashboard to Excel_CheckExportSettings', () => {
    const {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        excelExportPanel,
    } = browsers.pageObj1;

    const dossier = {
        id: 'DEA04EE746D227A2EB1628B3E5F8BA99',
        name: 'Simple',
        project: {
            id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login({
            username: 'administrator',
            password: '',
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[Demo_1] Check end to end work flow of exporting dashboard to Excel', async () => {
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickCheckboxByPageName('Chapter 1');
        await excelExportPanel.clickCheckboxByPageName('Chapter 1');
        await excelExportPanel.clickShareMenuExportButton();
        const fileName = `${dossier.name}.xlsx`;
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await waitForFileExists(downloadPath, 10000);
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, `${dossier.name}_Differences.xlsx`),
        });
        await dossierPage.goToLibrary();
    });
});
