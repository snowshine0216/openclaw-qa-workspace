/**
 * Migrated from WDIO: ReportEditor_createByCubePrivilege.spec.js
 * Phase 2c - Create Report by Cube Security.
 * Uses reportCubePrivUser from .env.report (default: re_nic)
 */
import { test, expect, reportCreatorData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { projects } = reportCreatorData;

test.describe('Create Report by Cube Security', () => {
  test.beforeAll(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportCubePrivUser || reportCreatorData.reportTestUserWithoutDefineCubePrivilege.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});
  });

  test.beforeEach(async ({ dossierCreator, libraryPage }) => {
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6915_01] No define intelligent cube report privilege for some of the projects', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Select Template');

    await dossierCreator.switchToCubesTab();
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Cubes');

    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Select Template');

    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6915_02] No use ACL dataset cannot be selected', async ({
    dossierCreator,
    page,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('TC99021');
    await dossierCreator.sortDataByHeaderName('Date Created');
    await dossierCreator.selectReportCube({ name: 'TC99021_05_only_execute', isWait: false });
    await page.waitForTimeout(2000);

    expect(await dossierCreator.isCreateButtonEnabled()).toBe(false);

    await dossierCreator.selectReportCube({ name: 'TC99021_05_only_use' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);

    await dossierCreator.closeNewDossierPanel();
  });
});
