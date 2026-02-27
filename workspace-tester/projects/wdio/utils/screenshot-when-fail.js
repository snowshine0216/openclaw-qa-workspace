import allureReporter from '@wdio/allure-reporter';
import { Status } from 'allure-js-commons';

export default async function attachScreenshotWhenFail(errorMessage) {
    const screenshot = await browser.takeScreenshot();
    allureReporter.startStep(`Screenshot when fail >>>`);
    allureReporter.addAttachment(`${errorMessage}`, Buffer.from(screenshot, 'base64'), 'image/png');
    allureReporter.endStep(Status.FAILED);
}
