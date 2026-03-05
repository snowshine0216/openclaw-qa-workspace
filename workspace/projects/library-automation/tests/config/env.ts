/**
 * Per-environment config. Load from .env.report (or .env.report.{REPORT_ENV}) with mapping:
 *   reportTestUrl  -> base URL for MicroStrategy Library
 *   reportTestUser -> test user
 *   reportTestPassword -> test password (shared for all users; empty allowed per WDIO)
 *
 * Optional reportCreator suite users (WDIO: constants/report.js):
 *   reportCubePrivUser, reportSubsetUser, reportTemplateNoExecuteUser, reportTemplateUser
 * When unset, getReportEnv() returns fallbacks (re_nic, re_ss, etc.); specs may also use
 * reportCreatorData as fallback for new users.
 *
 * Usage: REPORT_ENV=dev npx playwright test  # loads .env.report.dev
 *        npx playwright test                 # loads .env.report
 */
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

const envSuffix = process.env.REPORT_ENV ? `.${process.env.REPORT_ENV}` : '';
const defaultEnvFile = `.env.report${envSuffix}`;
const testsConfigEnvFile = `tests/config/.env.report${envSuffix}`;
const envFile = process.env.ENV_FILE || defaultEnvFile;
const envPath = path.resolve(process.cwd(), envFile);
const altPath = path.resolve(process.cwd(), testsConfigEnvFile);
// Prefer tests/config/ when default path doesn't exist (migration layout)
const pathToLoad = envFile === defaultEnvFile && !fs.existsSync(envPath) && fs.existsSync(altPath)
  ? altPath
  : envPath;
config({ path: pathToLoad });

export interface ReportEnvConfig {
  reportTestUrl: string;
  reportTestUser: string;
  reportTestPassword: string;
  /** createByCubePrivilege (WDIO: reportTestUserWithoutDefineCubePrivilege) */
  reportCubePrivUser: string;
  /** createByCube (WDIO: reportSubsetTestUser) */
  reportSubsetUser: string;
  /** reportTemplateSecurity (WDIO: reportTemplateNoExecuteAclUser) */
  reportTemplateNoExecuteUser: string;
  /** reportTemplateSecurity (WDIO: reportTemplateTestUser) */
  reportTemplateUser: string;
  /** reportScopeFilter (WDIO: reportScopeFilterUser) */
  reportScopeFilterUser: string;
  /** reportCancel (WDIO: cancelReportExecutionUser) */
  reportCancelUser: string;
}

function parseBaseUrl(url: string): string {
  let u = url;
  if (u.includes('?')) u = u.substring(0, u.indexOf('?'));
  if (u.includes('#')) u = u.substring(0, u.indexOf('#'));
  if (u.includes('app/config/')) u = u.substring(0, u.indexOf('app/config/'));
  if (!u.endsWith('/')) u += '/';
  return u;
}

export function getReportEnv(): ReportEnvConfig {
  const url = process.env.reportTestUrl || process.env.REPORT_TEST_URL || '';
  const user = process.env.reportTestUser || process.env.REPORT_TEST_USER || 'tqmsuser';
  const password = process.env.reportTestPassword ?? process.env.REPORT_TEST_PASSWORD ?? '';

  return {
    reportTestUrl: parseBaseUrl(url),
    reportTestUser: user,
    reportTestPassword: password,
    reportCubePrivUser: process.env.reportCubePrivUser || process.env.REPORT_CUBE_PRIV_USER || 're_nic',
    reportSubsetUser: process.env.reportSubsetUser || process.env.REPORT_SUBSET_USER || 're_ss',
    reportTemplateNoExecuteUser:
      process.env.reportTemplateNoExecuteUser || process.env.REPORT_TEMPLATE_NO_EXEC_USER || 'ret_ne',
    reportTemplateUser: process.env.reportTemplateUser || process.env.REPORT_TEMPLATE_USER || 're_template',
    reportScopeFilterUser: process.env.reportScopeFilterUser || process.env.REPORT_SCOPE_FILTER_USER || 'resfc',
    reportCancelUser: process.env.reportCancelUser || process.env.REPORT_CANCEL_USER || 'cre',
  };
}
