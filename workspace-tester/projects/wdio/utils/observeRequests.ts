import type BasePage from '../pageObjects/base/BasePage.js';
import { type ElementObserver } from './observeElements.js';

interface RequestObserver {
    waitForFinish(): Promise<{ startTime: Date; endTime: Date }>;
}

type PromisePropName = `__mstrdRequestObserver${number}`;
declare global {
    interface Window {
        [prop: PromisePropName]: Promise<{ startTime: number; endTime: number }> | undefined;
    }
}

let lastObserverId = 0;
/**
 * The observer will start when the first request that meets `matches` is sent.
 *
 * If `until` is specified, the observer will stop when the element appears. The end time would be the one of the last request that meets `matches`.
 *
 * If `until` is not specified, the observer will stop when every item in `matches` has been met.
 */
export async function observeRequests(
    this: BasePage,
    matches: string[],
    until?: ElementObserver,
    timeout: number = this.DEFAULT_API_TIMEOUT
): Promise<RequestObserver> {
    const promisePropName: PromisePropName = `__mstrdRequestObserver${lastObserverId++}`;
    const elementObserverPromisePropName = until?.promisePropName;

    if (matches.length === 0) {
        throw new Error('No matches provided');
    }
    await browser.execute(
        function (promisePropName, matches, elementObserverPromisePropName, timeout) {
            window[promisePropName] = new Promise((resolve, reject) => {
                let startTime: number | null = null;
                let timeoutId = -1;
                let perfObserverCallback: PerformanceObserverCallback;
                if (elementObserverPromisePropName == null) {
                    perfObserverCallback = (entries) => {
                        for (const e of entries.getEntries()) {
                            const matchedIndex = matches.findIndex((m) => {
                                return e.name.includes(m);
                            });
                            if (matchedIndex < 0) {
                                continue;
                            }
                            matches.splice(matchedIndex, 1);
                            if (startTime === null) {
                                startTime = e.startTime;
                            }
                            // stop when every item in `matches` has been met.
                            if (matches.length === 0) {
                                clearTimeout(timeoutId);
                                perfObserver.disconnect();
                                resolve({
                                    startTime: performance.timeOrigin + startTime,
                                    endTime: performance.timeOrigin + e.startTime + e.duration,
                                });
                                return;
                            }
                        }
                    };
                } else {
                    // elementObserverPromisePropName != null
                    let lastMatchedEntry: PerformanceEntry | null = null;
                    const elementObserverPromise = window[elementObserverPromisePropName];
                    if (elementObserverPromise === undefined) {
                        reject('ElementObserver not found');
                        return;
                    }
                    elementObserverPromise
                        .then(() => {
                            clearTimeout(timeoutId);
                            perfObserver.disconnect();
                            if (startTime === null || lastMatchedEntry === null) {
                                // TODO: PerformanceObserver may emit the entry of the request after the element appears
                                // In this case we should resolve in the observer callback
                                reject('The until element appears but no request matched');
                                return;
                            }
                            // stop when the element appear
                            resolve({
                                startTime: performance.timeOrigin + startTime,
                                endTime:
                                    performance.timeOrigin + lastMatchedEntry.startTime + lastMatchedEntry.duration,
                            });
                        })
                        .catch((err) => {
                            clearTimeout(timeoutId);
                            perfObserver.disconnect();
                            reject(err);
                        });
                    perfObserverCallback = (entries) => {
                        for (const e of entries.getEntries()) {
                            const isMatched = matches.some((m) => e.name.includes(m));
                            if (!isMatched) {
                                continue;
                            }
                            if (startTime === null) {
                                startTime = e.startTime;
                            }
                            lastMatchedEntry = e;
                        }
                    };
                }
                const perfObserver = new PerformanceObserver(perfObserverCallback);
                timeoutId = window.setTimeout(() => {
                    perfObserver.disconnect();
                    reject(
                        elementObserverPromisePropName == null
                            ? `Request(s) ${JSON.stringify(matches)} did not load within ${timeout / 1000}s`
                            : `'until' element didn't appear within ${timeout / 1000}s`
                    );
                }, timeout);
                perfObserver.observe({ type: 'resource' });
            });
        },
        promisePropName,
        matches,
        elementObserverPromisePropName,
        timeout
    );
    return {
        async waitForFinish() {
            const result: { startTime: number; endTime: number } | string = await browser.executeAsync(
                function waitForFinishScript(promisePropName, done) {
                    const promise = window[promisePropName];
                    if (promise === undefined) {
                        done('waitForFinish is called more than once');
                        return;
                    }
                    delete window[promisePropName];
                    promise.then((result) => done(result)).catch((e) => done(e.toString()));
                },
                promisePropName
            );
            if (typeof result === 'string') {
                throw new Error(result);
            }
            return {
                startTime: new Date(result.startTime),
                endTime: new Date(result.endTime),
            };
        },
    };
}
