/**
 * This script is used to replace the file paths with our repo path in the coverage files.
 *
 * Usage:
 *   e.g. node ./scripts/coverageHelper.js --repo /Users/foo --coverage-dir .nyc_output
 *   --repo: Path to the web-dossier repo
 *   --coverage-dir: Path to the directory containing the coverage files
 */

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import yargs from 'yargs';

const NYC_OUTPUT_PATH = fileURLToPath(new URL('../.nyc_output', import.meta.url));

const argv = yargs(process.argv.slice(2))
    .option('repo', {
        describe: 'Path to the web-dossier repo',
        type: 'string',
        default: null,
    })
    .option('coverage-dir', {
        describe: 'Path to the coverage directory',
        type: 'string',
        default: null,
    }).argv;

const { repo, coverageDir } = argv;

if (!repo) {
    throw new Error('repo argument is required');
}

if (!coverageDir) {
    throw new Error('coverage-dir argument is required');
}

const coverageFiles = fs.readdirSync(NYC_OUTPUT_PATH).filter((f) => f.endsWith('.json'));
coverageFiles.forEach((f) => {
    const contentString = fs.readFileSync(`${NYC_OUTPUT_PATH}/${f}`, 'utf8');
    const content = JSON.parse(contentString);
    // /workspace/Library_Web/web-dossier_m2021_pullreq_build/production/src/react/src/admin/constants/AuthenticationModeConstants.js
    // => /repo/src/admin/constants/AuthenticationModeConstants.js
    const newContent = Object.entries(content).reduce((acc, [key, value]) => {
        // assume file path starts with production/src/react
        const regex = /(production\/src\/react.*)$/;
        const newKey = path.resolve(repo, regex.exec(key)[1]);
        const newValue = Object.assign(value, {
            path: path.resolve(repo, regex.exec(value.path)[1]),
        });
        acc[newKey] = newValue;
        return acc;
    }, {});

    fs.writeFileSync(`${NYC_OUTPUT_PATH}/${f}`, JSON.stringify(newContent));
});
