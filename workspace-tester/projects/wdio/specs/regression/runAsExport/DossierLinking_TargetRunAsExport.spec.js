import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import { isFileNotEmpty } from '../../../config/folderManagement.js';
import '../../../utils/toMatchExcel.js';
import '../../../utils/toMatchPdf.js';
import path from 'path';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';

const specConfiguration = { ...customCredentials('_runasexport') };

describe('Run As Export', () => {
    const dossierLinking_source = {
        id: '435F24644C66B29CE87C1485BFBDE9CD',
        name: '(Auto) Dossier linking_pass filters to pdf/excel',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierLinking_target_pdf = {
        id: '3F38C7244B3403EC3D7CA0A6509799A7',
        name: 'target_dossier_filter_year_dropdown',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.pdf',
    };

    const dossierLinking_target_excel = {
        id: 'B68F2D4048A1B77A9B9AB288FAFBDB5F',
        name: 'target_dossier_filter_year_dropdown_Excel',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.xlsx',
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
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await resetDossierState({
            credentials: credentials,
            dossier: dossierLinking_source.name,
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

    it('[TC99198_06] Validate dossier linking of passing filter to target run as export', async () => {

        const filename_currentFilter = `${dossierLinking_target_pdf.name}` +'_currentFilter' + `${dossierLinking_target_pdf.fileType}`;
        const filepath = path.join(downloadDirectory, `${dossierLinking_target_pdf.name}.pdf`);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        const filename_viewFilter = `${dossierLinking_target_pdf.name}` +'_2014' + `${dossierLinking_target_pdf.fileType}`;

        const url = browser.options.baseUrl + `app/${dossierLinking_source.project.id}/${dossierLinking_source.id}/`;
        await libraryPage.openDossierByUrl(url.toString());

        //pass single filter for pdf
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: current filter', pageName: 'PDF' });

        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });

        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));

        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);

        // from grid cell of year '2014'
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
        });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file 
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);

        // pass single filter for excel
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: current filter', pageName: 'Excel' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_excel.name, fileType: '.xlsx' });
        await since(`The Excel file for ${dossierLinking_target_excel.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dossierLinking_target_excel.name, fileType: '.xlsx' }))
            .toBe(true);
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_excel.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);

        // pass single + view filter
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: current filter + view filter', pageName: 'PDF' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);

        // from grid cell of year '2014'
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
        });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_viewFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);

        // pass single + view filter for excel
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: current filter + view filter', pageName: 'Excel' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_excel.name, fileType: '.xlsx' });
        await since(`The Excel file for ${dossierLinking_target_excel.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dossierLinking_target_excel.name, fileType: '.xlsx' }))
            .toBe(true);
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_excel.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);

        // pass all filter to pdf
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: all', pageName: 'PDF' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Year' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);
        // from grid cell of year '2014'
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
        });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);
        // pass all filter to excel
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: all', pageName: 'Excel' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Year' });     
        await share.waitForDownloadComplete({ name: dossierLinking_target_excel.name, fileType: '.xlsx' });
        await since(`The Excel file for ${dossierLinking_target_excel.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dossierLinking_target_excel.name, fileType: '.xlsx' }))
            .toBe(true);
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_excel.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);

        // pass no filter to pdf
        await toc.openPageFromTocMenu({ chapterName: 'NOT pass filter', pageName: 'PDF' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_currentFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);
        // from grid cell of year '2014'
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
        });
        await share.waitForDownloadComplete({ name: dossierLinking_target_pdf.name, fileType: '.pdf' });
        // check data in the downloaded file
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, filename_viewFilter));
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_pdf.name,
            fileType: '.pdf',
        });
        await libraryPage.closeTab(1);
        // pass no filter to excel
        await toc.openPageFromTocMenu({ chapterName: 'NOT pass filter', pageName: 'Excel' });
        // from header
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await share.waitForDownloadComplete({ name: dossierLinking_target_excel.name, fileType: '.xlsx' });
        await since(`The Excel file for ${dossierLinking_target_excel.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: dossierLinking_target_excel.name, fileType: '.xlsx' }))
            .toBe(true);
        await libraryPage.switchToTab(0);
        await deleteFile({
            name: dossierLinking_target_excel.name,
            fileType: '.xlsx',
        });
        await libraryPage.closeTab(1);
    });


    
});

export const config = specConfiguration;
