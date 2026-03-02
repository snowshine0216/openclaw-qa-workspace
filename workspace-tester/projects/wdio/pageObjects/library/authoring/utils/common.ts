import { browser, $ } from '@wdio/globals'
import { addAttachment } from '@wdio/allure-reporter'
import fs from 'fs'

function addAttachmentSafely(name: string, filePath: string, type: string) {
    try {
        if (fs.existsSync(filePath)) {
            addAttachment(name, fs.readFileSync(filePath), type)
        }
    } catch (error) {
        console.error(error)
    }
}

export async function checkElement(elementOrSelector: string | any, imageName: string) {
    let elememt : any;
    if (typeof elementOrSelector === 'string') {
        elememt = await this.$(elementOrSelector)
    } else {
        elememt = elementOrSelector
    }
    await elememt.waitForDisplayed({timeout: 600000})

    const checkResult = await browser.checkElement(elememt, imageName, {}) // TODO: add tolerance

    const result = `result/actual/desktop_chrome/${imageName}.png`;
    addAttachmentSafely(`${imageName} result`, result, 'image/png');

    if (checkResult !== 0) {
        const baseline = `baselines/desktop_chrome/${imageName}.png`;
        const diffImagePath = `result/diff/desktop_chrome/${imageName}.png`;
        addAttachmentSafely(`${imageName} baseline`, baseline, 'image/png');
        addAttachmentSafely(`${imageName} comparison diff`, diffImagePath, 'image/png');
    }

    return checkResult
}