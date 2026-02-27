/**
 * Scroll an element into view, make it visible
 * @param {ElementFinder} el The element needs to scroll
 * @param {boolean|ScrollIntoViewOptions} [option] The option, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 */
export async function scrollIntoView(el, option) {
    const script = 'return arguments[0].scrollIntoView(arguments[1])';
    await browser.execute(script, await el, option);
}

/**
 * Scroll the passed element to the specified position
 * @param {ElementFinder} el The element needs to scroll
 * @param {number} toPosition The position in pixel, e.g. 100
 */
export async function scrollElement(el, toPosition) {
    await browser.execute('arguments[0].scrollTop = arguments[1];', await el, toPosition);
}

export async function getScrollTopValue(el) {
    return await browser.execute('return arguments[0].scrollTop;', await el);
}

// toPosition > 0, scroll bar to right
export async function scrollHorizontally(el, toPosition) {
    await browser.execute('arguments[0].scrollLeft = arguments[1];', await el, toPosition);
}

export async function scrollHorizontallyToNextSlice(el, number) {
    await browser.execute('arguments[0].scrollLeft = arguments[0].scrollWidth * arguments[1];', await el, number);
}


export async function scrollElementToNextSlice(el, number) {
    await browser.execute('arguments[0].scrollTop = arguments[0].offsetHeight * arguments[1];', await el, number);
}

/**
 * Scroll the passed element to the middle
 * @param {ElementFinder} el The element needs to scroll
 */
export async function scrollElementToMiddle(el) {
    await browser.execute('arguments[0].scrollTop = arguments[0].scrollHeight / 2;', await el);
}

/**
 * Scroll the passed element to the bottom
 * @param {ElementFinder} el The element needs to scroll
 */
export async function scrollElementToBottom(el) {
    await browser.execute('arguments[0].scrollTop = arguments[0].scrollHeight;', await el);
}


/**
 * Scroll the passed element to the top
 * @param {ElementFinder} el The element needs to scroll
 */
export async function scrollElementToTop(el) {
    await scrollElement(el, 0);
}
