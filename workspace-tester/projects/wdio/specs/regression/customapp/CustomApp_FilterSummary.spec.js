import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('Custom App - Granular Control - Filter,TOC,recipient in email, new dossier/report', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, toc, reportSummary, reportPage, reportFilter, filterPanel } =
        browsers.pageObj1;

    let customAppIdDisableFilterSummary,
        customAppIdEnableFilterSummaryOn,
        customAppIdDisableFilterSummaryOff,
        customAppIdEnableFilterSummaryOnAllowOff,
        customAppIdEnableFilterSummaryOnAllowOffHideOn,
        customAppIdDisableFilterSummaryOffAllowOnHideOn;

    beforeEach(async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.financialAnalysisDossier,
        });
    });

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        // await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdDisableFilterSummary,
                customAppIdEnableFilterSummaryOn,
                customAppIdDisableFilterSummaryOff,
                customAppIdEnableFilterSummaryOnAllowOff,
                customAppIdEnableFilterSummaryOnAllowOffHideOn,
                customAppIdDisableFilterSummaryOffAllowOnHideOn,
            ],
        });
    });

    // verify disable filter summary in dossier and report
    it('[TC90188_01] Check disalbe filter summary in dossier and report', async () => {
        // create app
        customAppIdDisableFilterSummary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableFilterSumary,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableFilterSummary });
        //  run consts.financialAnalysisDossier and switch to Financial Statements
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });

        await filterPanel.openFilterPanel();
        // verify filter summary is disabled in dossier
        await since('Filter summary in dossier  is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
        // show filter summary
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Show Filter Summary');
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);

        // hide filter summary
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Hide Filter Summary');
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);

        // go to library home page
        await dossierPage.goToLibrary();

        // run testRSD ------ question: click show filter summary -> change settings?
        await libraryPage.openDossier(consts.simpleReport.name);
        await reportPage.waitForReportLoading();
        await since('Filter summary in report is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
    });

    // verify enabled filter summary with allow on and hide on in dossier and report
    it('[TC90188_02] Check enabled filter summary with allow on and hide on in dossier and report', async () => {
        // create app
        customAppIdEnableFilterSummaryOn = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.enableFilterSumaryOn,
        });
        await libraryPage.openCustomAppById({ id: customAppIdEnableFilterSummaryOn });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);
        // hide filter summary
        await filterPanel.openFilterPanel();
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Hide Filter Summary');
        await since(
            'After hide filter summary, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);

        // show filter summary
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Show Filter Summary');
        await since(
            'After show filter summary, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);

        // clear all filters
        // await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since(
            'After clear all filters, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
    });

    // verify enabled filter summary with allow off and hide off in dossier and report
    it('[TC90188_03] Check enabled filter summary with allow off in dossier and report', async () => {
        // create app
        customAppIdEnableFilterSummaryOnAllowOff = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.enableFilterSumaryOnAllowOff,
        });
        await libraryPage.openCustomAppById({ id: customAppIdEnableFilterSummaryOnAllowOff });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);
        // no setting icon
        await filterPanel.openFilterPanel();
        await since('After open filter panel, setting icon is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportFilter.getSettingIcon().isDisplayed())
            .toBe(false);
        // clear all filters
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since(
            'After clear all filters, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);
    });

    // verify enabled filter summary with allow off and hide on in dossier and report
    it('[TC90188_04] Check enabled filter summary with allow off and hide on in dossier and report', async () => {
        // create app
        customAppIdEnableFilterSummaryOnAllowOffHideOn = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.enableFilterSumaryOnAllowOffHideOn,
        });
        await libraryPage.openCustomAppById({ id: customAppIdEnableFilterSummaryOnAllowOffHideOn });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);
        // no setting icon
        await filterPanel.openFilterPanel();
        await since('After open filter panel, setting icon is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportFilter.getSettingIcon().isDisplayed())
            .toBe(false);
        // clear all filters
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since(
            'After clear all filters, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
    });

    // verify disabled filter summary with allow on and hide on in dossier and report
    it('[TC90188_05] Check disabled filter summary with allow on and hide on in dossier and report', async () => {
        // create app
        customAppIdDisableFilterSummaryOffAllowOnHideOn = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableFilterSumaryOffAllowOnHideOn,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableFilterSummaryOffAllowOnHideOn });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
        // show filter summary
        await filterPanel.openFilterPanel();
        await reportFilter.clickSettingIcon();
        await reportFilter.selectSetting('Show Filter Summary');
        await since(
            'After show filter summary, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(true);

        // clear all filters
        // await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since(
            'After clear all filters, Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);
    });

    // verify disabled filter summary with allow off and hide off in dossier and report
    it('[TC90188_06] Check disabled filter summary with allow off and hide off in dossier and report', async () => {
        // create app
        customAppIdDisableFilterSummaryOff = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableFilterSumaryOff,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableFilterSummaryOff });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.financialAnalysisDossier.chapter,
            pageName: consts.financialAnalysisDossier.page,
        });
        await since('Filter summary in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportSummary.isSummaryBarPresent())
            .toBe(false);

        await filterPanel.openFilterPanel();
        await since('After open filter panel, setting icon is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reportFilter.getSettingIcon().isDisplayed())
            .toBe(false);
    });
});
