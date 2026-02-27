"use strict";
/** 
 * Class with methods that can be used in steps
 */
class Utils {
    /**
     * Used on mojo
     * @param {string} objectTypeName
     * @param {string} prefix
     * @example prefix = 'item unit ic' in dataset panel; prefix = 'item ic' in hidden objects menu 
     */
    static objectTypeIdExtended(objectTypeName, prefix) {
        switch (objectTypeName.toLocaleLowerCase()) {
            case 'metric': return prefix + 4; break;
            case 'derived metric': return prefix + 4 + 'd'; break;
            case 'attribute': return prefix + 12; break;
            case 'derived attribute': return prefix + 12 + 'd'; break;
            case 'geo attribute': return prefix + 12 + 'g'; break;
            case 'time attribute': return prefix + 12 + 't'; break;
            case 'derived element': return prefix + 12 + 'de'; break;
            case 'consolidation': return prefix + 47; break;
            case 'custom group': return prefix + 1; break; 
            case 'new derived element': return prefix + 47 + ' st12033'; break; 
            case 'hierarchy object': return prefix + 14; break;
            case 'parameter': return prefix + 10 + 'prm'; break;
            case 'fact metric': return prefix + 4 + ' st1033'; break;
            default: return '';
        }
    }

    /**
     * Get the expected color code
     * @param {string} expectedColor 
     */
    async getRgbaColorCode(expectedColor) {
        switch(expectedColor.toLowerCase()) {
            case "red":
                return "rgba(255, 0, 0, 1)";
            case "black":
                return "rgba(0, 0, 0, 1)";
            default:
                throw 'Invalid Color';
        }
    }

    static containsExactClass(cls) {
        return `contains(concat(' ', normalize-space(@class), ' '), ' ${cls} ')`;
    }

    /**
     * Get the text of an element. If there is a single quote in the string, handle it
     * a bit differently
     * @param {string} text 
     */
    static getElementText(text) {
        // If there's a single quote in the string, we need to wrap it with double quotes instead
        if (text.includes("'")) {
            return `text() = "${text}"`
        }
        return `text() = '${text}'`
    }
}

export default Utils;