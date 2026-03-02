import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import { isFileNotEmpty, findDownloadedFile } from '../../../config/folderManagement.js';
import '../../../utils/toMatchExcel.js';
import '../../../utils/toMatchPdf.ts';
import path from 'path';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';

const specConfiguration = { ...customCredentials('_runasexport') };

describe('Run As Export', () => {
    const dashboardExportToPDF = {
        id: '38B540944543F631AC69328E43B65139',
        name: '(AUTO) RunAsExportToPDF',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.pdf',
    };

    const dashboardExportToExcel = {
        id: '46BA8C714F5847C23D0DB7913697CE2D',
        name: '(AUTO) RunAsExportToExcel',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.xlsx',
    };

    const dashboardExportToPDFWithPrompt = {
        id: 'FE85180C4C0BF057486A8B908CA1B8C6',
        name: '(AUTO) RunAsExport_WithPrompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.pdf',
    };

    const dashboardExportToExcelDoNotDisplay = {
        id: '420E9FCD4CDEE1375B731F8ECA21D913',
        name: '(AUTO) RunAsExport_DoNotDisplay',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dashboardExportToExcelDiscardCurrentAnswer = {
        id: '58E3DE4242601B8280D820AEC5A1CAE0',
        name: '(AUTO) RunAsExport_DiscardCurrentAnswer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentLinking = {
        id: 'B22917864DB12FF0523F34B7EEAD0A22',
        name: '(AUTO) RunByDefaultAsExport_DocumentLinking',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentLinkingTarget = {
        id: 'D21637D3495FE816026878BFE63BFD31',
        name: 'Target_DocumentLinking',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetSelector = {
        id: '9A71835345A8A0C85F8C6A99A0999CC2',
        name: 'target_dossier_filter_category+year+region_PDF',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetFilter = {
        id: '3F38C7244B3403EC3D7CA0A6509799A7',
        name: 'target_dossier_filter_year_dropdown',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dashboardLinking = {
        id: 'FEA92D43438F15C3E71DB4A17A1F89BB',
        name: '(AUTO) RunByDefaultAsExport_DashboardLinking',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetCrossProject = {
        id: 'E88A60044278B161E29C26A735A0E9A8',
        name: 'RunByDefaultAsExport_CrossProject_Target1_NoPrompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        promptEditor,
        grid,
        toc,
        listView,
        listViewAGGrid,
        share,
        sidebar,
        fullSearch,
        contentDiscovery,
        quickSearch,
        shareDossier,
        rsdGrid,
        textbox,
        rsdPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardExportToPDF.name,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardExportToExcel.name,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardExportToPDFWithPrompt.name,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardExportToExcelDiscardCurrentAnswer.name,
        });
        await setWindowSize({
            width: 1600,
            height: 1200,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await libraryPage.logoutClearCacheAndLogin(credentials);
    });

    it('[TC99198_01] Validate Run As Export for Dashboard - Run', async () => {
        // Home
        await since('RunAsExportToPDF icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isRunAsPDFIconPresent(dashboardExportToPDF.name))
            .toBe(true);
        await since('RunAsExportToExcel icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isRunAsExcelIconPresent(dashboardExportToExcel.name))
            .toBe(true);
        await libraryPage.openDossier(dashboardExportToPDF.name);
        await share.waitForDownloadComplete({ name: dashboardExportToPDF.name, fileType: '.pdf' });
        await since(`The PDF file for ${dashboardExportToPDF.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dashboardExportToPDF.name, fileType: '.pdf' }))
            .toBe(true);
        const filepath = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDF.name}.pdf`));

        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dashboardExportToPDF.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);

        // Search
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(dashboardExportToExcelDiscardCurrentAnswer.name);
        await quickSearch.waitForSuggestionResponse();
        await since('Recently Viewed, RunAsExportToPDF icon should be #{expected}, instead we have #{actual}')
            .expect(
                await quickSearch.isSearchSuggestionRunAsIconDisplayed(dashboardExportToExcelDiscardCurrentAnswer.name)
            )
            .toBe(true);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await since('In search result page, RunAsExportToPDF icon should be #{expected}, instead we have #{actual}')
            .expect(
                await fullSearch.isRunAsExcelIconPresentInSearchResults(dashboardExportToExcelDiscardCurrentAnswer.name)
            )
            .toBe(true);
        await fullSearch.openDossierFromSearchResults(dashboardExportToExcelDiscardCurrentAnswer.name);
        await libraryPage.switchToTab(1);
        await promptEditor.run();
        await share.waitForDownloadComplete({
            name: dashboardExportToExcelDiscardCurrentAnswer.name,
            fileType: '.xlsx',
        });
        await since(`The excel file for ${dashboardExportToExcelDiscardCurrentAnswer.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dashboardExportToExcelDiscardCurrentAnswer.name, fileType: '.xlsx' }))
            .toBe(true);
        // const filepath1 = path.join(downloadDirectory, `${dashboardExportToExcelDiscardCurrentAnswer.name}.xlsx`);
        // await expect(filepath1).toMatchExcel(
        //     path.join(baselineDirectory, `${dashboardExportToExcelDiscardCurrentAnswer.name}.xlsx`),
        //     {
        //         difference: path.join(downloadDirectory, `${dashboardExportToExcelDiscardCurrentAnswer.name}.xlsx`),
        //     }
        // );
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dashboardExportToExcelDiscardCurrentAnswer.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);
        await fullSearch.backToLibrary();

        // List View
        await listView.selectListViewMode();
        await listViewAGGrid.clickDossierRow(dashboardExportToExcel.name);

        await share.waitForDownloadComplete({
            name: dashboardExportToExcel.name,
            fileType: '.xlsx',
        });
        await since(`The Excel file for ${dashboardExportToExcel.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dashboardExportToExcel.name, fileType: '.xlsx' }))
            .toBe(true);
        // const filepath2 = path.join(downloadDirectory, `${dashboardExportToExcel.name}.xlsx`);
        // await expect(filepath2).toMatchExcel(path.join(baselineDirectory, `${dashboardExportToExcel.name}.xlsx`), {
        //     difference: path.join(downloadDirectory, `${dashboardExportToExcel.name}.xlsx`),
        // });
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dashboardExportToExcel.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);
        await since('RunAsExportToPDF icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isRunAsPDFIconPresent(dashboardExportToPDF.name))
            .toBe(true);
        await since('RunAsExportToExcel icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isRunAsExcelIconPresent(dashboardExportToExcel.name))
            .toBe(true);

        // content discovery
        await libraryPage.openCustomAppById({ id: 'A55BF2E39B37499BBAB1140F7A64751F' });
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            '_Web/Library - One-click PDF and Excel exports',
        ]);
        await since('RunAsExportToPDF icon for Content discovery should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isRunAsPDFIconPresent(dashboardExportToPDF.name))
            .toBe(true);
        await since('RunAsExportToExcel icon for Content discovery should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isRunAsExcelIconPresent(dashboardExportToExcel.name))
            .toBe(true);
        await listViewAGGrid.clickShareIconInGrid(dashboardExportToPDFWithPrompt.name);
        let url = await shareDossier.getLink();
        await since('Share Link should be #{expected}, instead we have #{actual}')
            .expect(url)
            .toBe(
                browser.options.baseUrl +
                    'app/' +
                    dashboardExportToPDFWithPrompt.project.id +
                    '/' +
                    dashboardExportToPDFWithPrompt.id +
                    '/export/pdf'
            );
        await shareDossier.closeDialog();
        await listViewAGGrid.clickContextMenuIconInGrid(dashboardExportToPDFWithPrompt.name);
        await libraryPage.clickDossierContextMenuItem('Open');
        await share.waitForDownloadComplete({
            name: dashboardExportToPDFWithPrompt.name,
            fileType: '.pdf',
        });
        await since(`The PDF file for ${dashboardExportToPDFWithPrompt.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dashboardExportToPDFWithPrompt.name, fileType: '.pdf' }))
            .toBe(true);
        const filepath3 = path.join(downloadDirectory, `${dashboardExportToPDFWithPrompt.name}.pdf`);
        await expect(filepath3).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDFWithPrompt.name}.pdf`), {
            tolerance: 0.02,
        });
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dashboardExportToPDFWithPrompt.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);
    });

    it('[TC99198_02] Validate Run As Export for Dashboard - Run By URL', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardExportToPDF.name,
        });
        const noParameterUrl =
            browser.options.baseUrl +
            'app/' +
            dashboardExportToPDF.project.id +
            '/' +
            dashboardExportToPDF.id +
            '/K53--K46/export/pdf';
        console.log('noParameterUrl' + noParameterUrl);
        await browser.url(noParameterUrl);
        const filepath = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDF.name}_NoParameter.pdf`));
        await deleteFile({
            name: dashboardExportToPDF.name,
            fileType: '.pdf',
        });

        // with filter prompt
        const withFilterPromptUrl =
            browser.options.baseUrl +
            'app/' +
            dashboardExportToPDFWithPrompt.project.id +
            '/' +
            dashboardExportToPDFWithPrompt.id +
            '/K53--K46/export/pdf?filters=%5B%7B%22key%22%3A%22W5F0B6AC7FAD14C3BB18D1DAB58B31D58%22%2C%22currentSelection%22%3A%7B%22elements%22%3A%5B%7B%22id%22%3A%22h2%3B8D679D3711D3E4981000E787EC6DE8A4%22%2C%22name%22%3A%22Electronics%22%7D%5D%2C%22selectionStatus%22%3A%22included%22%2C%22allSelected%22%3Afalse%7D%7D%5D&prompts=%5B%5B%7B%22key%22%3A%2234DF05924F261FC68D6450BC619EB31E%400%4010%22%2C%22values%22%3A%5B%22750%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D';
        console.log('withFilterPromptUrl' + withFilterPromptUrl);
        await browser.url(withFilterPromptUrl);
        const filepath1 = path.join(downloadDirectory, `${dashboardExportToPDFWithPrompt.name}.pdf`);
        await waitForFileExists(filepath1, 30000);
        await expect(filepath1).toMatchPdf(
            path.join(baselineDirectory, `${dashboardExportToPDFWithPrompt.name}_FilterPrompt.pdf`)
        );
        await deleteFile({
            name: `${dashboardExportToPDFWithPrompt.name}`,
            fileType: '.pdf',
        });

        // without pagekey
        const withoutPagekeyUrl =
            browser.options.baseUrl +
            'app/' +
            dashboardExportToPDF.project.id +
            '/' +
            dashboardExportToPDF.id +
            '/export/pdf';
        console.log('withoutPagekeyUrl' + withoutPagekeyUrl);
        await browser.url(withoutPagekeyUrl);
        const filepath2 = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        await waitForFileExists(filepath2, 30000);
        await expect(filepath2).toMatchPdf(path.join(baselineDirectory, `${dashboardExportToPDF.name}.pdf`));
        await deleteFile({
            name: dashboardExportToPDF.name,
            fileType: '.pdf',
        });
    });

    it('[TC99198_03] Validate Run As Export for Dashboard - Document Linking - Link Via Object', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentLinking,
        });
        await libraryPage.openDossier(documentLinking.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Link Via Object - open in new tab' });

        // Open In New Tab
        const promptUser = rsdGrid.getRsdGridByKey('W166A0EA3F4C94974828ABDD87F2EBC42');
        await rsdGrid.waitForGridLoaded();
        await promptUser.clickCell('Books');
        await libraryPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        const promptUserFilePath = path.join(downloadDirectory, `${documentLinkingTarget.name}.pdf`);
        await waitForFileExists(promptUserFilePath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(promptUserFilePath).toMatchPdf(path.join(baselineDirectory, `${documentLinkingTarget.name}.pdf`));
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: documentLinkingTarget.name,
            fileType: '.pdf',
        });

        // Open In current Tab
        const answerDynamically = rsdGrid.getRsdGridByKey('W5CACA32BA36F4018BFE4DFD03BF86F72');
        await rsdGrid.waitForGridLoaded();
        await answerDynamically.clickCell('Books');
        const answerDynamicallyFilePath = path.join(downloadDirectory, `${documentLinkingTarget.name}.pdf`);
        await waitForFileExists(answerDynamicallyFilePath, 30000);
        await expect(answerDynamicallyFilePath).toMatchPdf(
            path.join(baselineDirectory, `${documentLinkingTarget.name}.pdf`)
        );
        await dossierPage.goBackFromDossierLink();
        await deleteFile({
            name: documentLinkingTarget.name,
            fileType: '.pdf',
        });

        const selector = await rsdPage.findSelectorByName('Selector155');

        await selector.dropdown.clickDropdown();
        await selector.dropdown.selectItemByText('Business');
        await selector.dropdown.sleep(3000);
        await dossierPage.clickTextfieldByTitle('PassSelectorBySourceAttribute');
        const PassSelectorBySourceAttributeFilePath = path.join(downloadDirectory, `${targetSelector.name}.pdf`);
        await waitForFileExists(PassSelectorBySourceAttributeFilePath, 30000);
        await expect(PassSelectorBySourceAttributeFilePath).toMatchPdf(
            path.join(baselineDirectory, `${targetSelector.name}_PassSelectorBySourceAttribute.pdf`)
        );
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: targetSelector.name,
            fileType: '.pdf',
        });

        await dossierPage.clickTextfieldByTitle('PassSelectorByControlName');
        const PassSelectorByControlNameFilePath = path.join(downloadDirectory, `${targetSelector.name}.pdf`);
        await waitForFileExists(PassSelectorByControlNameFilePath, 30000);
        await expect(PassSelectorByControlNameFilePath).toMatchPdf(
            path.join(baselineDirectory, `${targetSelector.name}_PassSelectorByControlName.pdf`)
        );
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: targetSelector.name,
            fileType: '.pdf',
        });
    });

    it('[TC99198_04] Validate Run As Export for Dashboard - Document Linking - Link Via URL', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentLinking,
        });
        await libraryPage.openDossier(documentLinking.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Link Via URL' });

        await dossierPage.clickTextfieldByTitle('Library Link Via URL - Open In New Window');
        const filepath = path.join(downloadDirectory, `${targetFilter.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${targetFilter.name}.pdf`));
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: targetFilter.name,
            fileType: '.pdf',
        });

        await dossierPage.clickTextfieldByTitle('Library Link Via URL - Open In Current Window');
        const filepath2 = path.join(downloadDirectory, `${targetFilter.name}.pdf`);
        await waitForFileExists(filepath2, 30000);
        await expect(filepath2).toMatchPdf(path.join(baselineDirectory, `${targetFilter.name}.pdf`));
        await dossierPage.goBackFromDossierLink();
        await deleteFile({
            name: targetFilter.name,
            fileType: '.pdf',
        });
    });

    it('[TC99198_05] Validate Run As Export for Dashboard - Dashboard Linking', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboardLinking,
        });
        await libraryPage.openDossier(dashboardLinking.name);
        await toc.openPageFromTocMenu({ chapterName: 'dashboard linking', pageName: 'link via url' });
        await textbox.navigateLinkByText('Link Via Library URL - Open In New Tab');
        await libraryPage.switchToTab(1);
        const filepath = path.join(downloadDirectory, '(AUTO) RunAsExportToExcel.xlsx');
        await waitForFileExists(filepath, 30000);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: '(AUTO) RunAsExportToExcel',
            fileType: '.xlsx',
        });

        await toc.openPageFromTocMenu({ chapterName: 'dashboard linking', pageName: 'link via object' });
        await textbox.navigateLinkByText('Link Via Object - Open In Current Tab');
        await dossierPage.goBackFromDossierLink();
        const filepath2 = path.join(downloadDirectory, 'target_dossier_filter_year_dropdown.pdf');
        await waitForFileExists(filepath2, 30000);
        await deleteFile({
            name: 'target_dossier_filter_year_dropdown',
            fileType: '.pdf',
        });

        await toc.openPageFromTocMenu({ chapterName: 'dashboard linking', pageName: 'link cross project' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
        });
        await dossierPage.switchToTab(1);
        const filepath3 = path.join(downloadDirectory, `${targetCrossProject.name}.pdf`);
        await waitForFileExists(filepath3, 30000);
        await expect(filepath3).toMatchPdf(path.join(baselineDirectory, `${targetCrossProject.name}.pdf`));
        await libraryPage.switchToTab(0);
        await libraryPage.closeTab(1);
        await deleteFile({
            name: targetCrossProject.name,
            fileType: '.pdf',
        });
    });
});

export const config = specConfiguration;
