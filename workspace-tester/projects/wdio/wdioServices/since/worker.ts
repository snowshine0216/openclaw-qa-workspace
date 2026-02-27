// This is a fork from https://github.com/avrelian/jasmine2-custom-message
import type { Services } from '@wdio/types';
import allureReporter from '@wdio/allure-reporter';
import { Status } from 'allure-js-commons';

interface ServiceOptions {}

type ExpectionResult = {
    matcherName: string;
    actual: string;
    expected: string;
    message: string;
};
type MessageType = string | (() => string);

const ofType = function (val: unknown, ...rest: string[]) {
    const types = rest;
    const valType = val === null ? 'null' : typeof val;
    return types.indexOf(valType) > -1;
};

const formatString = function (data: ExpectionResult, message: string) {
    return message
        .replace(/#\{actual\}/g, data.actual)
        .replace(/#\{expected\}/g, data.expected)
        .replace(/#\{message\}/g, data.message);
};

const getMessage = function (data: ExpectionResult, message: MessageType) {
    while (!ofType(message, 'string', 'number', 'boolean')) {
        switch (true) {
            case ofType(message, 'undefined', 'null'):
                message = data.message || 'You cannot use `' + message + '` as a custom message';
                break;
            case ofType(message, 'function'):
                message = (message as () => string).call(data);
                break;
            case message && ofType(message.toString, 'function') && message.toString().indexOf('[object ') !== 0:
                message = message.toString();
                break;
            case JSON && ofType(JSON.stringify, 'function'):
                message = JSON.stringify(message);
                break;
            default:
                message = 'N/A';
        }
    }

    if (ofType(message, 'string')) {
        return formatString(data, message as string);
    }

    return message.toString();
};

const wrapAddExpectationResult = function (originalAddExpectationResult, customMessage: MessageType) {
    return function (passed: boolean, data: ExpectionResult) {
        data.message = getMessage(data, customMessage);
        if (passed) {
            let text = data.message;
            const index = text.indexOf(',');
            if (index > -1) {
                text = text.substring(0, index);
            }
            allureReporter.addStep(`${text}`, {}, Status.PASSED);
        } else {
            allureReporter.addStep(`${data.message}`, {}, Status.FAILED);
        }

        originalAddExpectationResult(passed, data);
    };
};

const wrapExpect = function (expectAsync: ExpectWebdriverIO.Expect, customMessage: MessageType) {
    return function (actual: unknown | Promise<unknown>) {
        const asyncExpection = expectAsync(actual);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const expector = (asyncExpection as any).expector;
        expector.addExpectationResult = wrapAddExpectationResult(expector.addExpectationResult, customMessage);
        return asyncExpection;
    };
};

export default class SinceWorkerService implements Services.ServiceInstance {
    options: ServiceOptions;
    constructor(serviceOptions: ServiceOptions) {
        this.options = Object.assign({}, serviceOptions);
    }

    async before(): Promise<void> {
        global.since = function (customMessage: MessageType) {
            return {
                /**
                 * Please note that here `expect` is actually `jasmine.expectAsync`.
                 * This is what `expect-webdriverio` do to add async matchers such as `toBeSelected`
                 * so that we can use like this
                 *
                 * ```javascript
                 * const elem = await $('#elem');
                 * await expect(elem).toBeSelected()
                 * ```
                 */
                expect: wrapExpect(expect, customMessage),
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    }
}
