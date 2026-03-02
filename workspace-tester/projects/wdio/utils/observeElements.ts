import type BasePage from '../pageObjects/base/BasePage.js';

export interface ElementObserver {
    waitForAppear(): Promise<Date>;
    get promisePropName(): PromisePropName;
}

export type PromisePropName = `__mstrdElementObserver${number}`;

declare global {
    interface Window {
        [prop: PromisePropName]: Promise<number> | undefined;
    }
}

type TargetMatcher =
    | string
    | {
          selector: string;
          contains?: string | null;
      };

let lastObserverId = 0;

/**
 * Observes `root`, and ends when every item in `steps` has been met in its order.
 * Items in `steps` are arrays of `TargetMatcher`s. A step is met when every `TargetMatcher` in it is met.
 */
export async function observeElements(
    this: BasePage,
    root: string | WebdriverIO.Element | PromiseLike<WebdriverIO.Element>,
    steps: TargetMatcher[][],
    timeout: number = this.DEFAULT_LOADING_TIMEOUT
): Promise<ElementObserver> {
    const rootElement: WebdriverIO.Element = typeof root === 'string' ? await this.$(root) : await root;
    const promisePropName: PromisePropName = `__mstrdElementObserver${lastObserverId++}`;

    await browser.execute(
        function (promisePropName, steps, rootElement, timeout) {
            window[promisePropName] = new Promise((resolve, reject) => {
                if (!(rootElement instanceof Element)) {
                    reject('Root element not found');
                    return;
                }
                function isTargetVisible(rootElement: Element, matcher: TargetMatcher): boolean {
                    if (typeof matcher === 'string') {
                        for (const element of rootElement.querySelectorAll(matcher)) {
                            if (element instanceof HTMLElement && element?.offsetParent != null) {
                                return true;
                            }
                        }
                        return false;
                    }
                    for (const element of rootElement.querySelectorAll(matcher.selector)) {
                        if (
                            element instanceof HTMLElement &&
                            element?.offsetParent != null &&
                            (matcher.contains == null || element.textContent?.includes(matcher.contains))
                        ) {
                            return true;
                        }
                    }
                    return false;
                }

                function check(rootElement: Element): boolean {
                    while (steps.length > 0) {
                        const matches = steps[0];
                        if (matches.every((target) => isTargetVisible(rootElement, target))) {
                            steps.shift();
                        } else {
                            return false;
                        }
                    }
                    return true;
                }

                if (check(rootElement)) {
                    resolve(performance.timeOrigin + performance.now());
                    return;
                }
                const timeoutId = setTimeout(() => {
                    observer.disconnect();
                    reject(`Element(s) ${JSON.stringify(steps[0])} did not become visible within ${timeout}ms`);
                }, timeout);
                const observer = new MutationObserver(() => {
                    if (check(rootElement)) {
                        observer.disconnect();
                        clearTimeout(timeoutId);
                        setTimeout(() => {
                            // Wait for event loop to be idle
                            resolve(performance.timeOrigin + performance.now());
                        }, 0);
                    }
                });
                observer.observe(rootElement, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                });
            });
        },
        promisePropName,
        steps,
        rootElement,
        timeout
    );
    return {
        async waitForAppear() {
            const result: number | string = await browser.executeAsync(function (promisePropName, done) {
                const promise = window[promisePropName];
                if (promise === undefined) {
                    done('waitForAppear is called more than once');
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
        promisePropName,
    };
}
