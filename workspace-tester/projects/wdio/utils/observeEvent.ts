import type BasePage from '../pageObjects/base/BasePage.js';

interface EventObserver {
    waitForOccur(): Promise<Date>;
}

type PromisePropName = `__mstrdEventObserver${number}`;
declare global {
    interface Window {
        [prop: PromisePropName]: Promise<number> | undefined;
    }
}

let lastObserverId = 0;
export async function observeEvent(
    this: BasePage,
    target: string | WebdriverIO.Element | PromiseLike<WebdriverIO.Element>,
    eventName: string,
    timeout: number = this.DEFAULT_API_TIMEOUT
): Promise<EventObserver> {
    const promisePropName: PromisePropName = `__mstrdEventObserver${lastObserverId++}`;
    await browser.execute(
        function (promisePropName, target, eventName, timeout) {
            window[promisePropName] = new Promise((resolve, reject) => {
                let isTargetMatched: (evtTarget: Element) => boolean;
                if (typeof target === 'string') {
                    isTargetMatched = (evtTarget) => evtTarget.closest(target) !== null;
                } else if (target instanceof Element) {
                    isTargetMatched = (evtTarget) => target.contains(evtTarget);
                } else {
                    reject('Target is not a string or Element');
                    return;
                }
                const abortController = new AbortController();
                const timeoutId = setTimeout(() => {
                    abortController.abort();
                    reject(`Event ${eventName} did not occur within ${timeout}ms`);
                }, timeout);
                window.addEventListener(
                    eventName,
                    (evt) => {
                        if (evt.target instanceof Element && isTargetMatched(evt.target)) {
                            abortController.abort();
                            clearTimeout(timeoutId);
                            resolve(performance.timeOrigin + evt.timeStamp);
                        }
                    },
                    { capture: true, signal: abortController.signal }
                );
            });
        },
        promisePropName,
        await target,
        eventName,
        timeout
    );
    return {
        async waitForOccur() {
            const result: number | string = await browser.executeAsync(function (promisePropName, done) {
                const promise = window[promisePropName];
                if (promise === undefined) {
                    done('waitForOccur is called more than once');
                    return;
                }
                delete window[promisePropName];
                promise.then((result) => done(result)).catch((e) => done(e.toString()));
            }, promisePropName);
            if (typeof result === 'string') {
                throw new Error(result);
            }
            return new Date(result);
        },
    };
}
