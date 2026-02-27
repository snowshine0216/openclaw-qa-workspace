/**
 * FeatureMapping.json is used for pre_merge full regression test.
 * This script is to check if all regression test files in web library team are placed in featureMapping.json
 */

import fs from 'fs';
import path from 'path';

const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);
const regressionDir = path.join(currentModuleDir, '../specs/regression');
const featureMappingPath = path.join(currentModuleDir, '../specs/regression/featureMapping.json');

const featureMapping = await fs.promises.readFile(featureMappingPath, 'utf-8').then(JSON.parse);

const unExecutedFileList =
    'AIchatbot,authentication,collaboration,config,customapp,export,GA,GuestMode,sharebookmarkGuest,shareBot,sharewithacl,teams,transaction';

// retrieve all .spec.js files from regression folder, excluded the foldes defined in unExecutedFileList
function readFiles(dir) {
    const files = fs.readdirSync(dir);
    let result = [];
    const unexecutedFolderNames = unExecutedFileList.split(',');

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!unexecutedFolderNames.includes(file)) {
                result = result.concat(readFiles(filePath));
            }
        } else if (file.endsWith('.spec.js')) {
            result.push(filePath);
        }
    });

    return result;
}

// check if all the retrieved .spec.js file are in featureMapping.json
function isFileInList(obj, target) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (Array.isArray(value)) {
                if (value.includes(target)) {
                    return true;
                }
            } else if (typeof value === 'object') {
                if (isFileInList(value, target)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Get all the .spec.js files which are currently not in featureMapping.json
function getMissingFiles() {
    const allFiles = readFiles(regressionDir);
    const missingFiles = [];

    allFiles.forEach((file) => {
        const fileName = path.basename(file);
        const result = isFileInList(featureMapping, fileName);
        if (!result) {
            missingFiles.push(fileName);
        }
    });

    return missingFiles;
}

const missingFiles = getMissingFiles();
console.log('Files not in featureMapping.json:', missingFiles);
