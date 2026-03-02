import deleteSession from "../../api/deleteSession.js";
import BasePage from "../base/BasePage.js";

export default class Telemetry extends BasePage{
    constructor() {
        super();
    }

    async getTelemetry() {
        return this.executeScript('return window.telemetry');
    }

    // recordsBuffer definition
    // https://github.com/mstr-modules/telemetry/blob/next/production/src/telemetry/RecordsBuffer.ts
    async getRecordsBuffer() {
        return this.executeScript('return window.telemetry.recordsBuffer');
    }

    async getExecutionBuffer() {
        return this.executeScript('return window.telemetry.recordsBuffer.getExecution("winId")');
    }

    async getManipulationBuffer() {
        return this.executeScript('return window.telemetry.recordsBuffer.getManipulation("winId")');
    }

    // record definition
    // https://github.com/mstr-modules/telemetry/blob/c9f3fa77844fd32165515bb7640a6ceff684979e/production/src/telemetry/objects/models.ts#L55
    async getExecutionRecord() {
        return this.executeScript('return window.telemetry.recordsBuffer.getExecution("winId")?.record');
    }

    async getManipulationRecord() {
        return this.executeScript('return window.telemetry.recordsBuffer.getManipulation("winId").record');
    }

    async getEnabledProjects() {
        return this.executeScript('return window.telemetry.enabledProjects');
    }

    async deleteSession() {
        const cookies = await browser.getCookies();
        const baseUrl = browser.options.baseUrl;
        await deleteSession(baseUrl, cookies);
    }

    async closeTabByScript(index) {
        await this.sleep(2000); // wait new page
        const handles = await browser.getWindowHandles();
        if (handles.length > 1) {
            await browser.switchToWindow(handles[index]);
            await this.executeScript('window.close()');
            // if the closed index is 0, we need to switch to index 1
            const newIndex = index > 0 ? index - 1 : 1;
            await browser.switchToWindow(handles[newIndex]);
        } else {
            throw new Error('Please make sure there are at least two browser widnows');
        }
    }

    // Assertion helper

    async isSupported() {
        //TODO
    }

    async isEnabled() {
        return true;
    }

    async isEnabledAssersion() {
        const isEnabled = await this.isEnabled();
    }
}
