import path from 'path';
import util from 'util';

import fs from 'fs-extra';
import { glob } from 'glob';

import { errorLog, infoLog, successLog } from './consoleFormat.js';
import { downloadDirectory } from '../constants/index.js';
import { switchToMainWindow } from '../utils/index.js';

export const DOWNLOAD_ROOT = path.join(process.cwd(), 'downloads');

export function fullPath(name, fileType = '') {
    const ext = fileType ? fileType.replace(/^(?:\.)?(.+)/, '.$1') : '';
    return path.join(DOWNLOAD_ROOT, `${name}${ext}`);
}

export async function deleteFolderContents(dir, deleteCurDir) {
    const directoryExists = await fs.exists(dir);

    if (directoryExists) {
        const directoryFiles = await fs.readdir(dir);

        directoryFiles.forEach(async (file) => {
            const curDir = path.join(dir, file);
            const dirStats = await fs.lstat(curDir);
            if (dirStats.isDirectory()) {
                await deleteFolderContents(curDir);
            } else {
                const subDirectoryExists = await fs.exists(curDir);
                if (subDirectoryExists) {
                    try {
                        await fs.unlink(curDir);
                    } catch (e) {
                        errorLog(`Cleaning up the folder ${dir} has a minor issue.`);
                    }
                }
            }
        });

        if (deleteCurDir) {
            await fs.rmdir(dir);
        }
    }
}

export async function waitForFileToExist({ directory = downloadDirectory, name, fileType, timeout = 10000 }) {
    return new Promise(function (resolve, reject) {
        const filePath = path.join(directory, `${name}${fileType}`);
        let timer;

        let dir = path.dirname(filePath);
        let basename = path.basename(filePath);
        const watcher = fs.watch(dir, function (eventType, filename) {
            if (eventType === 'rename' && filename === basename) {
                timer && clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });

        timer = setTimeout(function () {
            watcher.close();
            reject(new Error(`File "${filePath}" did not exists and was not created during the timeout.`));
        }, timeout);

        try {
            fs.accessSync(filePath, fs.constants.R_OK);

            clearTimeout(timer);
            watcher.close();
            resolve();
        } catch (err) {
            //Do nothing
        }
    });
}

export async function deleteDirectoryFilesIncludingString(dir, fileString) {
    if (!dir) {
        return;
    }
    const directoryExists = await fs.exists(dir);
    if (directoryExists) {
        const directoryFiles = await fs.readdir(dir);
        directoryFiles.forEach(async (file) => {
            if (file.includes(fileString)) {
                const curFilePath = path.join(dir, file);
                try {
                    await fs.unlink(curFilePath);
                    successLog(`Deleted file: ${file}`);
                } catch (e) {
                    errorLog(`Had a minor issue deleting ${curFilePath}`);
                }
            }
        });
    }
}

function _validateParameters({ name, fileType, functionName }) {
    if (!name) {
        throw new Error(`The 'name' property is required for the ${functionName} function`);
    }

    if (!fileType) {
        throw new Error(`The 'fileType' property is required for the ${functionName} function`);
    }
}

export async function deleteFile({ directory = downloadDirectory, name, fileType }) {
    _validateParameters({ name, fileType, functionName: 'deleteFile' });
    let filePath = path.join(directory, `${name}${fileType}`);
    const fileExists = await fs.exists(filePath);
    if (fileExists) {
        await fs.unlink(filePath);
        return true;
    } else {
        return false;
    }
}

export async function getFileSize({ directory = downloadDirectory, name, fileType }) {
    _validateParameters({ name, fileType, functionName: 'getFileSize' });
    let filePath = path.join(directory, `${name}${fileType}`);
    const file = await fs.stat(filePath);
    return file.size;
}

export async function isFileNotEmpty({ name, fileType }) {
    const fileSize = await getFileSize({ name, fileType });
    if (fileSize) {
        return true;
    } else {
        return false;
    }
}

export async function findDownloadedFile({ directory = downloadDirectory, name, fileType }) {
    const fileNames = await glob(`${name}*${fileType}`, {
        cwd: directory,
    });

    if (fileNames.length <= 0) {
        return null;
    }

    let latestFileName = fileNames[0];
    let latestTime = fs.statSync(path.join(directory, latestFileName)).ctimeMs;
    for (let i = 1; i < fileNames.length; i++) {
        const ctime = fs.statSync(path.join(directory, fileNames[i])).ctimeMs;
        if (ctime >= latestTime) {
            latestTime = ctime;
            latestFileName = fileNames[i];
        }
    }

    return {
        directory,
        name: path.basename(latestFileName, fileType),
        fileType,
        fullPath: path.join(directory, latestFileName),
    };
}

export async function fixChromeDownloadDirectory() {
    if (browser.isChrome) {
        // Switch to the new tab
        const pages = await browser.getWindowHandles();
        await browser.switchToWindow(pages[pages.length - 1]);
        await browser.sendCommand('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDirectory,
        });
        // Switch back to the main window
        await switchToMainWindow();
    }

    if (browser.isEdge) {
        await browser.sendCommand('Browser.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDirectory,
        });
    }
}
