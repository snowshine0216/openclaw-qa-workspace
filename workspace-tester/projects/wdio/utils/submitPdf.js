import fs from 'fs';
import util from 'util';
import path from 'path';
import { convertPdf } from '@mstr/pdf-diff';

import { downloadDirectory } from '../constants/index.js';

const readFile = util.promisify(fs.readFile);

export default async function submitPdf(testCaseName, dossierName, dossierFile, size) {
    const prefix = `${testCaseName} - ${dossierName}`;

    const pageNum = await convertPdf(path.join(downloadDirectory, `${dossierFile.name}${dossierFile.fileType}`));
    const imageDir = path.join(downloadDirectory, dossierFile.name);
    for (const [i] of Array(pageNum).entries()) {
        const pagePath = path.join(imageDir, `${i + 1}.png`);
        const screenshot = await readFile(pagePath);
        await global.spectre.submitScreenshot(`${prefix} - Page ${i + 1}`, screenshot, 'pdf.js', size);
    }

    return pageNum;
}

export async function getPdfNum(testCaseName, dossierName, dossierFile, size) {
    const prefix = `${testCaseName} - ${dossierName}`;
    const pageNum = await convertPdf(path.join(downloadDirectory, `${dossierFile.name}${dossierFile.fileType}`));
    return pageNum;
}
