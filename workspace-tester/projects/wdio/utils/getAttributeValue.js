export async function getAttributeValue(el, attrName) {
    return browser.execute(`return arguments[0].${attrName}`, await el);
}

export async function getInputValue(el) {
    return browser.execute('return arguments[0].value', await el);
}

export async function getCheckedStatus(el) {
    return browser.execute('return arguments[0].checked', await el);
}

export async function getDisabledStatus(el) {
    return browser.execute('return arguments[0].disabled', await el);
}

export async function getRowText(el) {
    return browser.execute('return arguments[0].textContent', await el);
}

export async function getAccAtributesOfElement(parentElement, attributes) {
    let values = [];
    const childNodes = await parentElement.$$('*').filter(async (item) => {
        const isDisplayed = await item.isDisplayed();
        const tabindex = await getAttributeValue(item, 'tabIndex');
        return isDisplayed && parseInt(tabindex) !== -1;
    });
    for (let i = 0; i < childNodes.length; i++) {
        const element = childNodes[i];
        const attributeValues = [];
        for (const attribute of attributes) {
            const value = await getAttributeValue(element, attribute);
            attributeValues.push(`${value}`);
        }
        values.push(attributeValues);
    }
    return values.join('\n');
}

export async function getAtributesValueOfElement(el, attributes) {
    const attributeValues = [];
    for (const attribute of attributes) {
        const value = await getAttributeValue(el, attribute);
        attributeValues.push(`${value}`);
    }
    return attributeValues;
}
