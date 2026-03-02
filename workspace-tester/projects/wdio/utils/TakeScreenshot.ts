import fs from 'fs';
import path from 'path';
import allure from '@wdio/allure-reporter';

export async function takeScreenshot(
    testCaseName: string,
    imageName: string,
    options?: {
        tolerance?: number;
    }
): Promise<void> {
    const screenShotName = `${testCaseName} - ${imageName}`;
    const result = await browser.compareScreenshot(screenShotName, options);
    await expect(result).toMatchBaseline();
}

export async function takeScreenshotByElement(
    ele: WebdriverIO.Element | WebdriverIO.$return,
    testCaseName: string,
    imageName: string,
    options?: {
        tolerance?: number;
    }
): Promise<void> {
    const resolvedElem = await ele;
    if (!resolvedElem.elementId) {
        throw new Error(`Element ${resolvedElem.selector} does not exist yet`);
    }

    const screenShotName = `${testCaseName} - ${imageName}`;
    
    const result = await browser.compareScreenshot(screenShotName, { element: resolvedElem, ...options });
    if (browsers.params.disableScreenshotAssertion) {
        result.pass = true;
    } else {
        await expect(result).toMatchBaseline();
    }
}

export async function checkScreenByImageComparison(testCaseName: string, imageName: string, tolerance?: number): Promise<void> {
    if (!tolerance) {
        tolerance = 0.5;
    }
    const testCaseDirs = testCaseName.split('/');
    const screenShotName = `${testCaseDirs[testCaseDirs.length - 1]} - ${imageName}`;
    let result = await browser.checkScreen(screenShotName, {
        baselineFolder: './baselineImage/' + testCaseName,
        actualFolder: './outputImage/' + 'actual/' + testCaseName,
        diffFolder: './outputImage/' + 'diff/' + testCaseName,
    });
    const pass = Number(result.misMatchPercentage) < Number(tolerance);
    if (!pass) {
        const fileExists = await fs.existsSync(result.folders.baseline.replace(imageName, imageName + '_Dup'));
        if (fileExists) {
            console.log('compare image fail and the exist duplicated baseline, try to check the duplicated image');
            result = await browser.checkScreen(screenShotName + '_Dup', {
                baselineFolder: './baselineImage/' + testCaseName,
                actualFolder: './outputImage/' + 'actual/' + testCaseName,
                diffFolder: './outputImage/' + 'diff/' + testCaseName,
            });
        }
    }
    expect({ result: result, tolerance: tolerance }).toMatchImageSnapshot();
}

export async function checkElementByImageComparison(ele: Promise<WebdriverIO.Element>, testCaseName: string, imageName: string, tolerance?: number): Promise<void> {
    const resolvedElem = await ele;
    if (!resolvedElem.elementId) {
        throw new Error(`Element ${resolvedElem.selector} does not exist yet`);
    }
    if (!tolerance) {
        tolerance = 0.5;
    }
    const testCaseDirs = testCaseName.split('/');
    const screenShotName = `${testCaseDirs[testCaseDirs.length - 1]} - ${imageName}`;
    let result = await browser.checkElement(resolvedElem, screenShotName, {
        baselineFolder: './baselineImage/' + testCaseName,
        actualFolder: './outputImage/' + 'actual/' + testCaseName,
        diffFolder: './outputImage/' + 'diff/' + testCaseName,
    });
    const pass = Number(result.misMatchPercentage) < Number(tolerance);
    if (!pass) {
        const imageNameModified = imageName.replace(/\s/g, '_'); // Replace spaces with underscores
        const filePath = result.folders.baseline.replace(imageNameModified, imageNameModified + '_Dup');
        const fileExists = await fs.existsSync(filePath);
        if (fileExists) {
            result = await browser.checkElement(resolvedElem, screenShotName + '_Dup', {
                baselineFolder: './baselineImage/' + testCaseName,
                actualFolder: './outputImage/' + 'actual/' + testCaseName,
                diffFolder: './outputImage/' + 'diff/' + testCaseName,
            });
        }
    }
    console.info(`Compare ImageSnapshot: ${imageName}`);
    expect({ result: result, tolerance: tolerance }).toMatchImageSnapshot();
}

export async function saveElementScreenshotLocal(element, relativeFilePath) {
    const fullPath = path.resolve(process.cwd(), relativeFilePath);
    const dir = path.dirname(fullPath);
    
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
    }
    
    await element.saveScreenshot(fullPath);
    console.log(`Screenshot saved at: ${fullPath}`);
}

export async function cleanFileInFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
    }
    fs.mkdirSync(folderPath, { recursive: true });
}

export async function takeScreenshotAndAttachToAllure(
    element: WebdriverIO.Element | WebdriverIO.$return,
    testCaseName: string,
    imageName: string
): Promise<void> {
    allure.startStep(`Taking screenshot: ${imageName}`); // Start an Allure step

    const resolvedElem = await element;
    if (!resolvedElem.elementId) {
        throw new Error(`Element ${resolvedElem.selector} does not exist yet`);
    }

    // Construct the relative file path using testCaseName and imageName
    const relativeFilePath = `./outputImage/actual/${testCaseName}/${imageName}.png`;
    const fullPath = path.resolve(process.cwd(), relativeFilePath);
    const dir = path.dirname(fullPath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
    }

    // Save the screenshot
    await resolvedElem.saveScreenshot(fullPath);
    console.log(`Screenshot saved at: ${fullPath}`);

    // Attach the screenshot to the Allure report
    const screenshotBuffer = fs.readFileSync(fullPath);
    allure.addAttachment(`Screenshot: ${imageName}`, screenshotBuffer, 'image/png');
    console.log(`Screenshot attached to Allure report: ${imageName}`);

    allure.endStep(); // End the Allure step
}
