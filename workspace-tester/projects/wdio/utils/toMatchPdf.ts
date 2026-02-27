import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { compare as comparePdf } from '@pixdif/core';
import type { TestPoint } from '@pixdif/model';
import allureReporter from '@wdio/allure-reporter';
import { Status } from 'allure-js-commons';

interface PdfMatcherOptions {
    /**
     * Tolerance for the comparison, a number between 0 and 1
     */
    tolerance?: number;

    /**
     * Automatically update the baseline image if it does not exist.
     */
    autoUpdate?: boolean;
}

declare global {
    namespace ExpectWebdriverIO {
        interface Matchers<R, T> {
            /**
             * Compare 2 Pdf files.
             * @param actual actual output
             * @param options Pdf matcher options
             */
            toMatchPdf(expected: string, options?: PdfMatcherOptions): R;
        }
    }
}

async function compare(actual: string, expected: string, options: PdfMatcherOptions = {}) {
    const { tolerance = 0.001 } = options;
    if (!fs.existsSync(expected)) {
        const { autoUpdate = !process.env.CI } = options;
        if (!autoUpdate) {
            return {
                pass: false,
                message: `The baseline does not exist: ${expected}`,
            };
        }
        const dir = path.dirname(expected);
        if (!fs.existsSync(dir)) {
            await fsp.mkdir(dir, { recursive: true });
        }
        await fsp.copyFile(actual, expected);
        return {
            pass: true,
            message: `The baseline does not exist. Automatically updated to ${expected}`,
        };
    }
    const fileName = path.basename(actual);
    const imageDir = await fsp.mkdtemp('wdio');
    const diffs = await comparePdf(actual, expected, { imageDir: imageDir });
    const pass = !diffs.some((image: TestPoint) => image.ratio > tolerance);
    const pdfFile = await fsp.readFile(actual);
    if (!pass) {
        allureReporter.startStep(`Compare ${fileName} failed, at least one page has a misMatchPercentage greater than ${tolerance * 100}%`);
        for (const image of diffs) {
            if (image.ratio > tolerance && image.diff) {
                const actual = await fsp.readFile(image.actual);
                const expected = await fsp.readFile(image.expected);
                const diff = await fsp.readFile(image.diff);

                allureReporter.startStep(`Compare ${image.name} failed, the misMatchPercentage is ${image.ratio * 100}%`);
                allureReporter.addAttachment('diff', diff, 'image/png');
                allureReporter.addAttachment('actual', actual, 'image/png');
                allureReporter.addAttachment('expected', expected, 'image/png');
                allureReporter.endStep(Status.FAILED);
            }
        }
        allureReporter.addAttachment(`${fileName}`, pdfFile, 'application/pdf');
        allureReporter.endStep(Status.FAILED);
    } else {
        allureReporter.startStep(
            `Compare ${fileName} pass, the misMatchPercentage for every page is less than ${tolerance * 100}%`
        );
        allureReporter.addAttachment(`${fileName}`, pdfFile, 'application/pdf');
        allureReporter.endStep(Status.PASSED);
    }
    await fsp.rm(imageDir, { recursive: true, force: true });
    return {
        pass,
    };
}

beforeAll(() => {
    jasmine.addAsyncMatchers({
        toMatchPdf() {
            return {
                compare,
            };
        },
    });
});
