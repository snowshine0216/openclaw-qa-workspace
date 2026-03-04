import * as childProcess from 'node:child_process';

const GH_AUTH_ERROR = 'GitHub CLI (gh) is not authenticated. Please run `gh auth login`.';
let execRunner = childProcess.execSync;

/**
 * Checks if GitHub CLI is installed and authenticated.
 * @throws {Error} when gh is unavailable or not logged in.
 */
export function checkGhAuth() {
  try {
    execRunner('gh auth status', { stdio: 'ignore' });
  } catch {
    throw new Error(GH_AUTH_ERROR);
  }
}

/**
 * Fetch a file's raw content through gh api.
 * @param {string} gitHubApiUrl
 * @returns {Promise<string>}
 */
export async function fetchGitHubFileContent(gitHubApiUrl) {
  return execRunner(
    `gh api -H "Accept: application/vnd.github.raw" ${gitHubApiUrl}`,
    { encoding: 'utf8' }
  );
}

/**
 * List files/directories from gh api JSON response.
 * @param {string} gitHubApiUrl
 * @returns {Promise<Array<{name: string, path: string, type: string, url?: string}>>}
 */
export async function listGitHubDirectory(gitHubApiUrl) {
  const raw = execRunner(`gh api ${gitHubApiUrl}`, { encoding: 'utf8' });
  return JSON.parse(raw);
}

/** @internal test hook */
export function __setExecRunnerForTests(fn) {
  execRunner = fn;
}

/** @internal test hook */
export function __resetExecRunnerForTests() {
  execRunner = childProcess.execSync;
}
