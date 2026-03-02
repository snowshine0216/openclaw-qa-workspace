import { colorOfIcons } from '../../constants/bot.js';

export function createXPathForElementSvg(type) {
    let color;

    if (type === 'attribute') {
        color = colorOfIcons.attributeColor;
    } else if (type === 'metric') {
        color = colorOfIcons.metricColor;
    } else throw new Error(`Incorrect type provided.`);
    return `*[local-name() = "svg"][*[local-name() = "path"][@fill="${color}"]]`;
}
