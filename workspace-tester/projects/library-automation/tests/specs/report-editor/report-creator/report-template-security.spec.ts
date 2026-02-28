/**
 * Migrated from WDIO: ReportEditor_reportTemplateSecurity.spec.js
 * Phase 2c - Report Creator Security Test.
 * Test 3844_01 migrated. 3844_02-04 skipped (need reportMenubar, reportPage.saveAsDialog, etc.).
 * Uses reportTemplateNoExecuteUser, reportTemplateUser, reportTestPassword from .env.report
 */
import { test, expect, reportCreatorData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { projects, templates } = reportCreatorData;

test.describe('Report Creator Security Test', () => {
  test.beforeEach(async ({ page, libraryPage }) => {
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.logout();
    await libraryPage.openDefaultApp();
  });

  test('[BCIN-3844_01] Show report template when having execute ACL', async ({
    page,
    libraryPage,
    loginPage,
    dossierCreator,
  }) => {
    await libraryPage.logout();
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportTemplateNoExecuteUser || reportCreatorData.reportTemplateNoExecuteAclUser.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});

    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.searchTemplate(templates.withPageBy);
    const noResult = dossierCreator.getNoResultWarning();
    await expect(noResult).toBeVisible({ timeout: 5000 });

    await dossierCreator.switchToListView();
    await expect(noResult).toBeVisible();

    await libraryPage.logout();
    await libraryPage.openDefaultApp();
    const reportEnv = getReportEnv();
    await loginPage.login({
      username: reportEnv.reportTemplateUser || reportCreatorData.reportTemplateTestUser.username,
      password: reportEnv.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});

    await dossierCreator.resetLocalStorage();
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.searchTemplate(templates.withPageBy);
    await expect(noResult).not.toBeVisible();
  });

  test.skip('[BCIN-3844_02] No write acl to report', () => {
    // Needs reportMenubar
  });

  test.skip('[BCIN-3844_03] No set template privilege', () => {
    // Needs reportMenubar, reportPage.saveAsDialog
  });

  test.skip('[BCIN-3844_04] unset default customized template', () => {
    // Needs reportMenubar, reportPage (getConfirmDialog, getConfirmMessage, getTemplateIcon)
  });
});
