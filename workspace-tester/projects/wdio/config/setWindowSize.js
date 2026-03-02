import chalk from 'chalk';
import { groupLog, groupLogEnd } from './consoleFormat.js';
import allureReporter from '@wdio/allure-reporter';

export async function getWindowSize() {
    let browserSize = await browser.getWindowSize();
    const innerHeight = await browser.execute('return window.innerHeight')
    if (innerHeight < browserSize.height) {
        browserSize.height = innerHeight;
    }
    return browserSize;
}

export function getBrowserVersion() {
    const browserVersion = browser.capabilities.browserVersion;
    return browserVersion;
}

export default async function setWindowSize({ width, height }) {
    const boldTheme = chalk.bold;
    let newHeight = height;
    const innerHeight = await browser.execute('return window.innerHeight');
    console.log(`The inner height is ${innerHeight}`);
    const version = await getBrowserVersion();
    // add 139 pixel here to solve chrome 128 difference
    if (browser.capabilities.browserName === 'chrome' && version.split('.')[0] >= '128') {
        console.log('add 139 pixels to the height');
        newHeight += 139;
    }
    await browser.setWindowSize(width, newHeight);

    groupLog('resize window size');
    console.info(`Setting browser window size to ${boldTheme(width)} by ${boldTheme(height)}...`);
    const newSize = await getWindowSize();
    console.log(`The window size has been set to ${boldTheme(newSize.width)} by ${boldTheme(newSize.height)}`);
    groupLogEnd();
    allureReporter.addStep(`setWindowSize to ${width} * ${height}`);
    return browser.pause(1000);
}
