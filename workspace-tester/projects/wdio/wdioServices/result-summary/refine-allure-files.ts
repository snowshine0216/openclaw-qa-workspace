import fs from 'fs-extra';
import path from 'path';
import getLogger from '../../scripts/logger.js';
import chalk from 'chalk';
import { REPORTS_FOR_ALLUER } from '../../constants/wdioConfig.js';

const allureRawPath = path.join(process.cwd(), REPORTS_FOR_ALLUER);
const logger = getLogger('[allure-cleaner] ');
/**
 * If a spec failed in before all, all its it blocks will be marked as failed, therefore, no need to keep
 * the beforeAll step in allure report, spec status will show by its test cases in it()
 */
const stepsToSkip = ['"before all" hook'];

export default async function clearUpAllureResultFiles(): Promise<void> {
    // remove .json files under allureRawPath which has status = skipped in its json content
    const files = await fs.readdir(allureRawPath);
    const filesToBeRemoved = [];
    logger.info(`Started to scan ${REPORTS_FOR_ALLUER} folder...`);
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const filePath = path.join(allureRawPath, file);
        const content = await fs.readJSON(filePath);
        if (content.status === 'skipped') {
            filesToBeRemoved.push(filePath);
        }
        if (stepsToSkip.includes(content.name) && content.status === 'failed') {
            filesToBeRemoved.push(filePath);
        }
    }
    if (filesToBeRemoved.length > 0) {
        logger.info(
            `Found ${chalk.bold.red(filesToBeRemoved.length.toString())} skipped test result files, removing...`
        );
        await Promise.all(filesToBeRemoved.map((file) => fs.remove(file)));
        logger.info(`Skipped files, removed`);
    }
}
