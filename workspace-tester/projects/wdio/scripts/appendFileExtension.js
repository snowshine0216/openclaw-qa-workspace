/**
 * Replace relative import paths with file extension
 * Because in nodejs ESM, relative import paths need full extensions
 * (e.g we have to write import "./foo.js" instead of import "./foo")
 *
 * To run this script:
 *      node ./scripts/appendFileExtension.js
 *
 * Example output:
 * in /Users/yaqzhu/dev/web-dossier/production/src/react/test/wdio/api/createGroup.js
 * from '../config/consoleFormat' ->
 * from '../config/consoleFormat.js'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryToScan = path.join(__dirname, '../');

function processFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // import { errorLog, successLog } from '../config/consoleFormat';
    // import { errorLog, successLog } from './config/consoleFormat';
    let modifiedContent = fileContent.replace(/from\s+(['"])([.]+[^'"]+)\1/g, (match, _, importPath) => {
        if (path.extname(importPath) === '') {
            const replacer = `from ${_}${importPath}.js${_}`;
            console.log(`in ${filePath}\n${match} ->\n${replacer}`);
            return replacer;
        }
        return match;
    });

    // import users from '../../../testData/users.json';
    modifiedContent = modifiedContent
        .replace(/from\s+(['"])([.]+[^'"]+)\.json\1([;\n])/g, (match, _, importPath, last) => {
            const replacer = `from ${_}${importPath}.json${_} assert { type: 'json' }${last}`;
            console.log(`in ${filePath}\n${match} ->\n${replacer}`);
            return replacer;
        })
        .replace('browser.baseUrl', 'browser.options.baseUrl');

    if (fileContent !== modifiedContent) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
        if (file === 'node_modules') return;

        const filePath = path.join(directory, file);
        if (filePath === __filename) return;

        const stat = fs.statSync(filePath);
        if (stat.isFile() && (path.extname(file) === '.js' || path.extname(file) === '.ts')) {
            processFile(filePath);
        } else if (stat.isDirectory()) {
            processDirectory(filePath);
        }
    });
}

processDirectory(directoryToScan);
