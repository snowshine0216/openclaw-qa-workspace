/**
 * Per-environment config. Load from .env.report (or .env.report.{REPORT_ENV}) with mapping:
 *   reportTestUrl  -> base URL for MicroStrategy Library
 *   reportTestUser -> test user
 *   reportTestPassword -> test password (empty allowed)
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
  };
}
