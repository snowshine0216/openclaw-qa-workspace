import path from 'path';
import fs from 'fs';
import { downloadDirectory } from '../constants/index.js';
import { clipboard } from 'clipboard-sys';

export async function waitForFileExists(filePath, timeout) {
    return new Promise((resolve, reject) => {
        var timer = setTimeout(() => {
            watcher.close();
            reject(new Error('File did not exists and was not created during the timeout.'));
        }, timeout);

        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (!err) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });

        const dir = path.dirname(filePath);
        const basename = path.basename(filePath);
        const watcher = fs.watch(dir, (eventType, filename) => {
            if (eventType === 'rename' && filename === basename) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });
    });
}

export async function checkDownloadedImage(downloadedName, testCaseName, baselineName, options) {
    const filepath = path.join(downloadDirectory, `${downloadedName}.png`);
    await waitForFileExists(filepath, 5000);
    const image = fs.readFileSync(filepath, (err, data) => {
        if (err) {
            throw err;
        }
        return Buffer.from(data, 'binary').toString('base64');
    });
    // Delete downloaded file after get.
    fs.unlinkSync(filepath);

    const result = await browser.compareImageWithBaseline(image, `${testCaseName} - ${baselineName}`, options);
    await expect(result).toMatchBaseline();
}

export async function checkCopiedImage(testCaseName, baselineName, options) {
    const copiedImage = await clipboard.readImage();
    const result = await browser.compareImageWithBaseline(copiedImage, `${testCaseName} - ${baselineName}`, options);
    await expect(result).toMatchBaseline();
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
    console.log(filePath);
    const fileExists = await fs.existsSync(filePath);
    if (fileExists) {
        await fs.unlinkSync(filePath);
        return true;
    } else {
        return false;
    }
}

export async function renameFile(folderPath, currentName, newName) {
    const currentPath = path.join(folderPath, currentName);
    const newPath = path.join(folderPath, newName);
    return new Promise((resolve, reject) => {
      fs.rename(currentPath, newPath, (err) => {
        if (err) {
          reject(`Error renaming file: ${err.message}`);
        } else {
          resolve();
        }
      });
    });
  }