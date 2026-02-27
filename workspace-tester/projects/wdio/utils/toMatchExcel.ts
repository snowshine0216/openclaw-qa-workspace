import fs from 'fs';
import fsp from 'fs/promises';
import cp from 'child_process';
import path from 'path';
import type { Readable } from 'stream';
import allureReporter from '@wdio/allure-reporter';

interface ExcelMatcherOptions {
    /**
     * When Excel files are different, it will generate a difference file.
     */
    difference?: string;

    /**
     * Automatically update the baseline file if it does not exist. (Default: `false`)
     */
    autoUpdate?: boolean;
}

declare global {
    namespace ExpectWebdriverIO {
        interface Matchers<R, T> {
            /**
             * Compare 2 Excel files.
             *  - It requires `com.microstrategy.poi.poi-diff` and JRE >= 17 installed.
             * @param actual actual output
             * @param difference difference output. It does not exist if the two files are the same.
             */
            toMatchExcel(expected: string, options?: ExcelMatcherOptions): R;
        }
    }
}

async function readStream(stream: Readable): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
}

async function exited(child: cp.ChildProcess): Promise<number> {
    return new Promise((resolve, reject) => {
        child.once('exit', resolve);
        child.once('error', reject);
    });
}

const mimeType = 'application/vnd.ms-excel';

async function compare(actual: string, expected: string, options: ExcelMatcherOptions = {}) {
    if (!fs.existsSync(actual)) {
        return {
            pass: false,
            message: `The file does not exist: ${actual}`,
        };
    }

    allureReporter.addAttachment(path.basename(actual), await fsp.readFile(actual), mimeType);

    if (!fs.existsSync(expected)) {
        const { autoUpdate = !process.env.CI } = options;
        if (!autoUpdate) {
            return {
                pass: false,
                message: `The baseline does not exist: ${expected}`,
            };
        }

        await fsp.copyFile(actual, expected);
        return {
            pass: true,
            message: `The baseline does not exist. Automatically updated to ${expected}`,
        };
    }

    const { difference } = options;
    if (difference && fs.existsSync(difference)) {
        await fsp.unlink(difference);
    }
    const args: string[] = [
        expected,
        actual,
    ];
    if (difference) {
        args.push(difference);
    }
    const child = cp.spawn('poi-diff', args.map((arg) => `"${arg}"`), {
        shell: true,
    });
    const stdout = await readStream(child.stdout);
    const stderr = await readStream(child.stderr);
    const exitCode = await exited(child);
    if (exitCode !== 0) {
        if (difference && fs.existsSync(difference)) {
            allureReporter.addAttachment(path.basename(difference), await fsp.readFile(difference), mimeType);
        }
        return {
            pass: false,
            message: `${stdout ?? 'Failed to match Excel files.'} Exit Code: ${exitCode}. ${stderr}`,
        };
    }
    return {
        pass: true,
    };
}

beforeAll(() => {
    jasmine.addAsyncMatchers({
        toMatchExcel() {
            return {
                compare,
            };
        },
    });
});
