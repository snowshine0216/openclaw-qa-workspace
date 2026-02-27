/**
 * Workaround for: isExisting on chained child element with missing parent throws error
 * Related issue: https://github.com/webdriverio/webdriverio/issues/4394
 *
 * The idea is to provide findOne() and findAll() method that return a proxy object.
 * These methods keep the same API as the original $() and $$() methods, but they
 * return false immediately when calling some methods (e.g. isExisting, isDisplayed, etc)
 * on a non-existing element.
 *
 * The implementation refers to the official webdriverio shim:
 * https://github.com/webdriverio/webdriverio/blob/v8.13.4/packages/wdio-utils/src/shim.ts
 */

import createLogger from '@wdio/logger';
import iterators from 'p-iteration';

const ELEMENT_QUERY_COMMANDS = [
    '$',
    '$$',
    'custom$',
    'custom$$',
    'shadow$',
    'shadow$$',
    'react$',
    'react$$',
    'nextElement',
    'previousElement',
    'parentElement',
];
const ELEMENT_PROPS = ['elementId', 'error', 'selector', 'parent', 'index', 'isReactElement', 'length'];
const PROMISE_METHODS = ['then', 'catch', 'finally'];
const FAIL_ON_NOT_FOUND_METHODS = [
    'waitForDisplayed',
    'waitForExist',
    'waitForClickable',
    'waitForEnabled',
    'isExisting',
    'isDisplayed',
    'isClickable',
    'waitUntil',
    'waitFor',
];

const METHODS_RETURNING_ELEMENT = ['find', 'findSeries'];
const METHODS_RETURNING_ELEMENT_ARRAY = ['map', 'mapSeries', 'filter', 'filterSeries'];

const logger = createLogger('patched-selector');

/**
 * @param {string} selector The selector to find element
 * @returns {WebdriverIO.$return} $
 */
export function findOne(selector) {
    const query = $(selector).then((res) => {
        // The returned element should be proxied so that the $ method on the element chain can be patched, e.g.:
        // const elem = await findOne('.foo')
        // const isDisplayed = elem.$('.non-existing').$('.whatever').isDisplayed()
        return proxyQueryResult(res);
    });

    // The returned query should be proxied so that the $ method on the query chain can be patched, e.g.:
    // const isDisplayed = await findOne('.non-existing').$('.whatever').isDisplayed()
    // The code above should not wait for the element to be found, but should return false immediately
    return proxyElementQuery(query, { failOnNotFound: false });
}

/**
 * @param {string} selector The selector to find element
 * @returns {WebdriverIO.$$return} $$
 */
export function findAll(selector) {
    const query = $$(selector).then((res) => {
        return proxyQueryResult(res);
    });
    query.selector = selector;
    return proxyElementArrayQuery(query, { failOnNotFound: false });
}

// findOne() and findAll() share some common properties and methods
// This function is used to proxy them
function tryProxySharedProps(target, prop) {
    if (PROMISE_METHODS.includes(prop)) {
        return target[prop].bind(target);
    }

    if (ELEMENT_PROPS.includes(prop)) {
        return target.then((res) => {
            // Queries like `$('.foo').$('.bar').parent` or `$('.foo').$$('.bar').parent` should be resolved as a proxy object
            if (prop === 'parent') {
                return proxyQueryResult(res);
            }
            return res[prop];
        });
    }
}

// Proxy the chained element query commands, the $ and $$ methods
// on the return value of findOne()
// This function will throw an error to stop waiting for the elements to exist
// if the failOnNotFound flag is set to true
function tryProxyElementQueryCommand(target, prop, sharedArgs) {
    if (!ELEMENT_QUERY_COMMANDS.includes(prop)) {
        return;
    }

    return (...args) => {
        const query = Promise.resolve(target).then((currentElement) => {
            if (currentElement.error && sharedArgs.failOnNotFound) {
                const err = new Error(`Element with selector "${currentElement.selector}" was not found`);
                err.element = currentElement;
                throw err;
            }

            return currentElement[prop](...args).then((res) => {
                return proxyQueryResult(res);
            });
        });

        if (prop.endsWith('$$')) {
            query.selector = args[0];
            query.parent = target;
            return proxyElementArrayQuery(query, sharedArgs);
        }

        return proxyElementQuery(query, sharedArgs);
    };
}

// Proxy the methods that should return false immediately when the element is not found
// This function will set the failOnNotFound flag to true to tell the query commands
// to throw an error if the element is not found
// It will catch the error and return false instead
function tryProxyFailOnNotFoundCommand(target, prop, sharedArgs) {
    if (!FAIL_ON_NOT_FOUND_METHODS.includes(prop)) {
        return;
    }

    return async (...args) => {
        sharedArgs.failOnNotFound = true;

        try {
            const elem = await target;
            return await elem[prop](...args);
            // const fn = elem[prop];
            // console.log('+'.repeat(100), fn, typeof fn === 'function');
            // if (typeof fn === 'function') {
            //     return fn.bind(elem)(...args);
            // }

            // console.warn(`elem["${prop}"] is not a function.`);
        } catch (err) {
            if (prop.startsWith('is')) {
                logger.info(`${prop}(): ${err.message || err} - returning false`);
                return false;
            }

            if (prop.startsWith('waitFor')) {
                const { reverse = false, timeoutMsg, timeout } = args[0] || {};
                // If the reverse flag is set to true, the waitFor command should not throw an error
                // to align the behavior with Protractor
                if (reverse) {
                    logger.info(`${prop}({ reverse: true, ... }): ${err.message || err} - not throwing error`);
                    return;
                }
                if (err.element) {
                    return err.element[prop](...args);
                }
            }

            throw err;
        }
    };
}

// Proxy the methods on the chained query command, e.g.:
// findOne().$(), findOne().$$(), or findOne().parentElement()
// findOne().isExisting(), findOne().$().isDisplayed(), etc.
function proxyElementQuery(query, sharedArgs) {
    const ret = new Proxy(query, {
        get(target, prop) {
            const handler =
                tryProxySharedProps(target, prop) ||
                tryProxyElementQueryCommand(target, prop, sharedArgs) ||
                tryProxyFailOnNotFoundCommand(target, prop, sharedArgs);

            if (handler) {
                return handler;
            }

            return async (...args) => {
                const elem = await target;
                if (!elem) {
                    throw new Error('Element could not be found');
                }
                return elem[prop](...args);

                // const fn = elem[prop];

                // if (typeof fn === 'function') {
                //     return fn.bind(elem)(...args);
                // }

                // console.warn(`elem["${prop}"] is not a function.`);
            };
        },
    });

    ret.__id = 'proxyElementQuery';

    return ret;
}

// Proxy the methods on the element, e.g.:
// const elem = await findOne('.foo')
// elem.$(), elem.$$(), elem.parentElement()
// elem.isExisting(), elem.isDisplayed(), etc.
function proxySingleElement(elem) {
    const sharedArgs = { failOnNotFound: false };
    const ret = new Proxy(elem, {
        get(target, prop) {
            const handler =
                tryProxyElementQueryCommand(target, prop, sharedArgs) ||
                tryProxyFailOnNotFoundCommand(target, prop, sharedArgs);

            if (handler) {
                return handler;
            }

            // element.parent should return a proxy object
            if (prop === 'parent') {
                return proxyQueryResult(target[prop]);
            }

            if (typeof target[prop] === 'function') {
                return target[prop].bind(target);
            }

            return target[prop];
        },
    });

    ret.__id = 'proxySingleElement';

    return ret;
}

// Proxy the methods or properties on the query that returns an array of elements, e.g.:
// findAll()[1], findOne().$$()[0], etc.
function proxyElementArrayQuery(queryArray, sharedArgs) {
    const ret = new Proxy(queryArray, {
        get(target, prop) {
            const sharedProp = tryProxySharedProps(target, prop);
            if (sharedProp) {
                return sharedProp;
            }

            // async iterator
            if (prop === Symbol.asyncIterator) {
                return async function* () {
                    for (const elem of await target) {
                        yield elem;
                    }
                };
            }

            const numberProp = Number(prop);
            if (!isNaN(numberProp)) {
                const query = target.then(async (res) => {
                    let result = res[numberProp];
                    if (!result) {
                        // Workaround from https://webdriver.io/docs/autowait#limitations
                        result = await browser.waitUntil(async () => {
                            const { parent, selector } = target;
                            let elements;
                            if (parent) {
                                const parentElement = await parent;
                                elements = await parentElement.$$(selector);
                            } else {
                                elements = await $$(selector);
                            }

                            if (elements.length <= numberProp) {
                                return false;
                            }
                            return elements[numberProp];
                        });
                    }

                    return proxyQueryResult(result);
                });
                return proxyElementQuery(query, sharedArgs);
            }

            if (typeof iterators[prop] === 'function') {
                return (...args) => {
                    const query = target.then((res) => {
                        return iterators[prop](res, ...args);
                    });

                    if (METHODS_RETURNING_ELEMENT.includes(prop)) {
                        return proxyElementQuery(query, sharedArgs);
                    }

                    if (METHODS_RETURNING_ELEMENT_ARRAY.includes(prop)) {
                        return proxyElementArrayQuery(query, sharedArgs);
                    }

                    return query;
                };
            }

            return target[prop];
        },
    });

    ret.__id = 'proxyElementArrayQuery';

    return ret;
}

// Proxy the query result, which can be a single element or an array of elements
function proxyQueryResult(elem) {
    if (!elem) {
        return elem;
    }

    if (Array.isArray(elem)) {
        return elem.map((elem) => {
            return proxySingleElement(elem);
        });
    }

    return proxySingleElement(elem);
}
