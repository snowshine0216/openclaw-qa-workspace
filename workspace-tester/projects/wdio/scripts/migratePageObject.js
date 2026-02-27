/* eslint-disable prettier/prettier */
/**
 * Migrate Protractor Pattern to webdriver IO one for page objects including below patterns
 * 1 .first() -> [0]
 * 2 (browserInstance) -> ()
 * 3 isPresent() -> isDisplayed()
 * 4 waitForElementPresent() -> waitForElementVisible()
 * 5 this.get(index) -> this[index]
 * 5 this.wait(this.EC.xxx -> this.waitForElementxxx()


 *
 * Example output:
 * File successfully updated with modified lines. -> /Users/xinhu/Documents/LibraryAutomation/production/src/react/test/wdio/pageObjects/library/winkytest2.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryToScan = path.join(__dirname, '../');

function processFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    lines.forEach((line, index) => {
        // for each line, replace .first()->[0],
        if (!line.trim().startsWith('//') && line != '') {
            line = line
                .replace(/\.first\(\)/g, '[0]')
                .replace(/\(browserInstance\)/g, '()')
                .replace(/isPresent\(\)/g, 'isDisplayed()')
                .replace(/waitForElementPresent/g, 'waitForElementVisible')
                .replace(/waitForElementAppear/g, 'waitForElementVisible')
                .replace(/this.brwsr.executeScript/g, 'this.executeScript')
                .replace(/getCssValue/g, 'getCSSProperty')
                .replace('.count()', '.length')
                .replace(/.element\(by\.xpath\((.*)\)\)/g, '.$(' + '$1' + ')')
                .replace(/.element\(by\.css\((.*)\)\)/g, '.$(' + '$1' + ')')
                .replace('constants.js', 'constants/index.js')
                .replace('browserInstance,', '')
                .replace('browser.sleep', 'this.sleep')
                //.replace(/(await|return)(.*).clear\(\);/g, '$1 ' + 'this.clear({elem: ' + '$2' +' });')
                .replace(/\.get\(((.(?!,|\())*?)\)/g, '['+'$1'+']')
                .replace(/await\s+this\.click\((?!\{)(.*)\);/g, 'await this.click({ elem: $1 });')
                .replace(/await\s+this\.hover\((?!\{)(.*)\);/g, 'await this.hover({ elem: $1 });')
                .replace(/await\s+this\.rightClick\((?!\{)(.*)\);/g, 'await this.rightClick({ elem: $1 });')
                .replace(/await\s+this\.doubleClick\((?!\{)(.*)\);/g, 'await this.doubleClick({ elem: $1 });')
                .replace(/await\s+this\.ctrlClick\((?!\{)(.*)\);/g, 'await this.ctrlClick({ elem: $1 });')
                .replace('../BasePage', '../base/WebBasePage')
                .replace(/\/components\/(.*)\//g, '/components/web_'+'$1'+ '/')
                .replace('../components/','')
                .replace('../../../utils.js', '../../utils/index.js')
                .replace('../BaseComponent.js', '../base/BaseComponent.js');
            //console.log(v.length);
            let modifiedLine = line;
            modifiedLine = replaceEC(line);
            modifiedLine = replaceRawDollar(modifiedLine);

            //replace with sendkeys
            if (modifiedLine.indexOf('browser.keys') >= 0 && modifiedLine.toUpperCase().indexOf('KEY.ENTER') <= 0) {
                modifiedLine += 'flag: no need to merge';
            } else if (
                modifiedLine.indexOf('protractor.Key') >= 0 &&
                modifiedLine.indexOf('protractor.Key.ENTER') < 0
            ) {
                modifiedLine = modifiedLine.replace(
                    /(await|return) *.*.(sendKeys|setValue)\((.*?)\)/g,
                    '$1' + ' browser.keys(' + '$3' + ')'
                ).replace('.perform()', '');
            } else if (modifiedLine.toUpperCase().indexOf('KEY.ENTER') >= 0) {
                modifiedLine = modifiedLine.replace(/(await|return) *.*/g, '$1' + ' this.enter();');
            } else {
                modifiedLine = modifiedLine.replace(/.sendKeys\((.*)\)/g, '.setValue(' + '$1' + ')');
            }

            lines[index] = modifiedLine.replace('protractor.', '');
        }
    });

    // now merge browser.keys from multi-line to one line
    let keys = [];
    lines.forEach((line, index) => {
        if (!line.trim().startsWith('//') && line.indexOf('flag: no need to merge') <= 0) {
            // fine the line of await browser.keys(Key.BACK_SPACE);
            let updateline = line.replace(/await *browser.keys\((.*)\) *;/g, '$1');
            // if find one, add the keys into keys array
            if (updateline !== line) {
                keys.push(updateline.trim());
            } else {
                // if new line was found, merge the keys， then empty the keys array
                if (keys.length > 0) {
                    const keyValue = keys.join(', ');
                    lines[index - 1] = lines[index - 1].replace(
                        /(await|return) *.*.;/g,
                        '$1' + ' browser.keys([' + keyValue + '])'
                    );
                    // empty all lines for merged ones
                    for (let i = 1; i < keys.length; i++) {
                        lines[index - i - 1] = '';
                    }
                    keys.length = 0;
                }
            }
        }
        line = line.replace('flag: no need to merge', '');
        lines[index] = line;
    });

    const modifiedFileContent = lines.join('\n');
    // console.log(modifiedFileContent);

    try {
        if (fileContent !== modifiedFileContent) {
            // console.log(modifiedFileContent);
            fs.writeFileSync(filePath, modifiedFileContent, 'utf8');
            console.log('File successfully updated with modified lines. -> ' + filePath);
        }
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

function processSpecFile(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = fileContent.replace(/constants.js/g, 'constants/index.js')
        .replace(/browser.params.credentials/g, 'browsers.params.credentials')
        .replace('browserInstance: browsers.browser1,', '');
    // add loginPage variable in pageObj for pattern let {} = browsers.pageObj1;
    const reg = /\slet *((.|\n)*) *= *browsers.pageObj1;/g;
    const matches = modifiedContent.match(reg);
    if ((matches !== null) && !matches[0].includes('loginPage')) {
        const variableReg = /\slet *{((.|\n)*)} *= *browsers.pageObj1;/g;
        let variables = matches[0].replace(variableReg, '$1');
        const variableArray = variables.split(',');
        const prefix = variableArray[0].replace(/\\n/g,'\n').match(/((.|\n)+?)(\w.*)/)[0].replace(/\\n/g,'\n').replace(/((.|\n)+?)(\w.*)/, '$1');
        const value = variableArray[0];
        variableArray.unshift(variableArray[0].replace(value, prefix + 'loginPage'));
        if (!prefix.includes('\n') && variableArray.length > 2) {
            const prefix2 = variableArray[2].replace(/\\n/g,'\n').match(/((.|\n)+?)(\w.*)/)[0].replace(/\\n/g,'\n').replace(/((.|\n)+?)(\w.*)/, '$1');
            variableArray[1] = variableArray[1].replace(value, prefix2 + value);
        }
        const modifiedvariables = variableArray.join(',');
        modifiedContent = modifiedContent.replace(variables, modifiedvariables);
    }
    // add loginPage variable in pageObj for pattern let xxx , ({} = browsers.pageObj1);
    const reg2 = /\(( *{((.|\n)*)} *= *browsers.pageObj1)\);/g;
    const matches2 = modifiedContent.match(reg2);
    // search for the variables and delete them then
    if ( (matches2 !== null) && !matches2[0].includes('loginPage')) {
        const variables2 = matches2[0].replace(reg2, '$2');
        const variableArray2 = variables2.split(',');
        // search for let params defenitions. then delete all definition outside pageObj1
        const letmatches = modifiedContent.match(/\slet *((.|\n)*?);/g);
        letmatches.forEach((item) => {
            const letVarible = item.replace(/\slet *((.|\n)*?);/g, '$1');
            const letArray = letVarible.split(',');
            const tempArray = letArray.slice();
            let modifiedItem = item;
            for (let i = 0; i < variableArray2.length; i++) {
                const value = variableArray2[i].replace(/( *|\n)+?(\w.*)/g, '$2').replace('\n', '').trim();
                let index;
                for (index =0 ;index < tempArray.length; index ++) {
                    const tempValue = tempArray[index].replace(/( *|\n)+?(\w.*)/g, '$2').replace('\n', '').trim();
                    if (tempValue === value) {
                        tempArray.splice(index, 1);
                        break;
                    } 
                };
                if (tempArray.length === 0) break;

            }
            if (tempArray.length == 0) {
                modifiedItem = '';
            } else if (JSON.stringify(tempArray) !== JSON.stringify(letArray)) {
                modifiedItem = item.replace(letArray.join(','), tempArray.join(','));
            }
            modifiedContent = modifiedContent.replace(item, modifiedItem);
        });

        // then add login page param in pageObj1 defenition
        const prefix2 = variableArray2[0].replace(/\\n/g,'\n').match(/((.|\n)+?)(\w.*)/)[0].replace(/\\n/g,'\n').replace(/((.|\n)+?)(\w.*)/, '$1');
        const value2 = variableArray2[0];
        variableArray2.unshift(variableArray2[0].replace(value2, prefix2 + 'loginPage'));
        const modifiedvariables2 = variableArray2.join(',');
        modifiedContent = modifiedContent.replace(variables2, modifiedvariables2);
    }
    // add let for browsers.pageObj1);
    modifiedContent = modifiedContent.replace(reg2, 'let ' + '$1' + ';');

    // remove browsers.pageObj1 from beforeAll section
    if (modifiedContent.indexOf("beforeAll") >= 0) {
        const beforeSectionReg = /beforeAll *\(async *\(\) *=> *{((.|\n)*?)}\);/g;
        const matches = modifiedContent.match(beforeSectionReg);
        if (matches[0].includes('browsers.pageObj1;')) {
            const letReg = /(let.*{((.|\n)*) *= *browsers.pageObj1;)/g;
            const letExpression = matches[0].match(letReg);
            //remove the letExpression in beforeAll section
            modifiedContent = modifiedContent.replace(letReg, '');
            modifiedContent = modifiedContent.replace('beforeAll', letExpression + '\n'  + '\n' +'    beforeAll');
        }

    }

    // add login method on beforeAll section
    let credentials = 'credentials';
    if( modifiedContent.match(/{.*credentials.*}/g) === null) {
        credentials = 'browsers.params.credentials';
    }
    if (modifiedContent.indexOf("beforeAll") >= 0) {
        const beforeSectionReg = /beforeAll *\(async *\(\) *=> *{((.|\n)*?)}\);/g;
        const matches = modifiedContent.match(beforeSectionReg);
        const beforeSection = matches[0].replace(/\\n/g,'\n').replace(/beforeAll *\(async *\(\) *=> *{((.|\n)*?)}\);/g, '$1');
        let modifiedbeforeSection = beforeSection;
        if (beforeSection.indexOf('loginPage.login(') <= 0) {
            const beforeArray = beforeSection.split(';');
            if (beforeArray[0].match(/((.|\n)+?)(\w.*)/) == null) {
                beforeArray.unshift('\n' + `        await loginPage.login(${credentials})`);
            } else {
                const v1 = beforeArray[0].replace(/\\n/g,'\n');
                const prefix = v1.match(/((.|\n)+?)(\w.*)/)[0].replace(/\\n/g,'\n').replace(/((.|\n)+?)(\w.*)/, '$1');
                const value = beforeArray[0];
                beforeArray.unshift(beforeArray[0].replace(value, prefix + `await loginPage.login(${credentials})`));
            }
            modifiedbeforeSection = beforeArray.join(';')
        }
        modifiedContent = modifiedContent.replace(beforeSection, modifiedbeforeSection);
       
    } else {
        // if no before all section, add this section and add login
        if (modifiedContent.indexOf("beforeEach") >= 0) {
            modifiedContent = modifiedContent.replace('beforeEach', `beforeAll(async () => {
                await loginPage.login(${credentials});
            });` + `\n
            beforeEach`);
        } else if (modifiedContent.indexOf("afterEach") >= 0) {
            modifiedContent = modifiedContent.replace('afterEach', `beforeAll(async () => {
                await loginPage.login(${credentials});
            });` + `\n
            afterEach`);
        }
        
    }

    // write back to the file
    try {
            if (fileContent !== modifiedContent) {
                //  console.log(modifiedContent);
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                console.log('File successfully updated with modified lines. -> ' + filePath);
            }
        
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

function processWebSpecFile(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = fileContent.replace(/utils.js/g, 'utils/index.js')
        .replace(/browser.params.credentials/g, 'browsers.params.credentials')
        .replace('browserInstance: browsers.browser1,', '')
        .replace('../../../utils/constants.js', '../../../constants/index.js')
        .replace(/await\s+takeScreenshot\(\s*(.*)\s*,\s*(.*)\s*,\s*\{\s*element:\s*(.*?)\s*\}\s*\);/g, 'await takeScreenshotByElement( '+ 'await $3' + ', ' +'$1' +', ' +'$2' +');')
        .replace('waitForTitleContains', 'waitForPageLoadByTitle')
        .replace('selectedItemsText', 'getSelectedObjectListText');

    // add login method on beforeAll section
    let credentials = 'credentials';
    if( modifiedContent.match(/{.*credentials.*}/g) === null) {
        credentials = 'browsers.params.credentials';
    }
    if (modifiedContent.indexOf("beforeAll") >= 0) {
        const beforeSectionReg = /beforeAll *\(async *\(\) *=> *{((.|\n)*?)}\);/g;
        const matches = modifiedContent.match(beforeSectionReg);
        const beforeSection = matches[0].replace(/\\n/g,'\n').replace(/beforeAll *\(async *\(\) *=> *{((.|\n)*?)}\);/g, '$1');
        let modifiedbeforeSection = beforeSection;
        
        // add loginPage
        if (modifiedbeforeSection.indexOf('webLoginPage.loginToHome(') <= 0) {
            const beforeArray = modifiedbeforeSection.split(';');
            if (beforeArray[0].match(/((.|\n)+?)(\w.*)/) == null) {
                beforeArray.unshift('\n' + `  await webLoginPage.loginToHome({`
                +'\n' + `            username: specConfiguration.credentials.username,`
                +'\n' + `            password: specConfiguration.credentials.password,`
                +'\n' + `        })`);
            } else {
                const v1 = beforeArray[0].replace(/\\n/g,'\n');
                const prefix = v1.match(/((.|\n)+?)(\w.*)/)[0].replace(/\\n/g,'\n').replace(/((.|\n)+?)(\w.*)/, '$1');
                const value = beforeArray[0];
                beforeArray.unshift(beforeArray[0].replace(value, prefix  
                +'\n'+`        await webLoginPage.loginToHome({`
                +'\n' + `            username: specConfiguration.credentials.username,`
                +'\n' + `            password: specConfiguration.credentials.password,`
                +'\n' + `        })`));
            }
            modifiedbeforeSection = beforeArray.join(';')
        }
        modifiedContent = modifiedContent.replace(beforeSection, modifiedbeforeSection);
       
    } else {
        // if no before all section, add this section and add login
        if (modifiedContent.indexOf("beforeEach") >= 0) {
            modifiedContent = modifiedContent.replace('beforeEach', `beforeAll(async () => {    `
            +'\n' + `        await webLoginPage.loginToHome({`
            +'\n' + `            username: specConfiguration.credentials.username,`
            +'\n' + `            password: specConfiguration.credentials.password,`
            +'\n' + `        });`
            +'\n' + `    });`+ `\n`
            + `\n` + `    beforeEach`);
        } else if (modifiedContent.indexOf("afterEach") >= 0) {
            modifiedContent = modifiedContent.replace('afterEach', `beforeAll(async () => {   `
                +'\n' + `        await webLoginPage.loginToHome({`
                +'\n' + `            username: specConfiguration.credentials.username,`
                +'\n' + `            password: specConfiguration.credentials.password,`
                +'\n' + `        });`
                +'\n' + `    });`  + `\n`
                +`\n`+`    afterEach`);
        }
        
    }

    // write back to the file
    try {
            if (fileContent !== modifiedContent) {
                //   console.log(modifiedContent);
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                console.log('File successfully updated with modified lines. -> ' + filePath);
            }
        
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
        const filePath = path.join(directory, file);
        if (!(filePath.includes('pageObjects') || filePath.includes('specs'))) return;
        const stat = fs.statSync(filePath);
        if (
            stat.isFile() &&
            (path.extname(file) === '.js' || path.extname(file) === '.ts') &&
            filePath.includes('pageObjects') &&
            !filePath.includes('BasePage.js') &&
            !filePath.includes('Select.js') 
        ) {
            //console.log('file path is' + filePath);
            processFile(filePath);
        } else if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (stat.isFile() && path.extname(file) === '.js' && filePath.includes('specs') && !filePath.includes('web_regression')) {
            //console.log(filePath);
            //processSpecFile(filePath);
        } else if (stat.isFile() && path.extname(file) === '.js' && filePath.includes('specs') && filePath.includes('web_regression')) {
            processWebSpecFile(filePath);
        }
    });
}

// this func is to replace the EC of the line with standard base method

function replaceEC(line) {
    let firstmodifiedline = line;
    let secondmodifiedLine = line;
    // regular expression to fillout locator/timeout/msg replaced with this.waitForElementVisible() method

    const removewaitRegex = /this\.wait\((.*)\)/g;
    const removeECRegex =
        /this\.EC\.(visibilityOf|presenceOf|invisibilityOf|stalenessOf|elementToBeClickable|textToBePresentInElement|textToBePresentInElementValue)\((.*)\)/g;
    firstmodifiedline = line.replace(removewaitRegex, '$1');
    if (firstmodifiedline != line) {
        firstmodifiedline = firstmodifiedline.replace(removeECRegex, '$2');
        let replacement = '';
        // judge whether the line matched the regular expression
        if (firstmodifiedline != line && firstmodifiedline.indexOf('this.EC') < 0) {
            firstmodifiedline = firstmodifiedline.split(';')[0].replace(/(.*){msg:(.+)\}/g, '$1$2');
            const res = firstmodifiedline.split(',');
            const argsRegex = normalizeArgsRegex(res.length);
            if (line.indexOf('visibilityOf') >= 0 || line.indexOf('presenceOf' >= 0)) {
                replacement = normalizeReplacementString('waitForElementVisible', res.length);
            }
            if (line.indexOf('invisibilityOf') >= 0) {
                replacement = normalizeReplacementString('waitForElementInvisible', res.length);
            }
            if (line.indexOf('stalenessOf') >= 0) {
                replacement = normalizeReplacementString('waitForElementStaleness', res.length);
            }
            if (line.indexOf('elementToBeClickable') >= 0) {
                replacement = normalizeReplacementString('waitForElementClickable', res.length);
            }
            if (line.indexOf('textToBePresentInElement') >= 0 && line.indexOf('textToBePresentInElementValue') < 0) {
                replacement = normalizeReplacementString('waitForTextAppearInElement', res.length);
            }
            if (line.indexOf('textToBePresentInElementValue') >= 0) {
                replacement = normalizeReplacementString('waitForTextPresentInElementValue', res.length);
            }
            secondmodifiedLine = firstmodifiedline.replace(argsRegex, replacement);
        }
    }

    return secondmodifiedLine;
}

/**
 * Normalizes the replacement string for usage in the context of "this" keyword.
 * @param {string} replacement - The original replacement string.
 * @param {number} length - The number of arguments in the replacement string.
 * @returns {string} - The normalized replacement string with appropriate method call and arguments.
 */

function normalizeReplacementString(replacement, length) {
    let normalizedReplacement = 'await this.' + replacement;

    if (length == 1) {
        normalizedReplacement += '($2);';
    }

    if (length == 2) {
        normalizedReplacement += '($2, {msg: $3});';
    }

    if (length == 3) {
        normalizedReplacement += '($2, {timeout: $3, msg: $4});';
    }

    if (length == 4) {
        normalizedReplacement += '($2, $3, {timeout: $4, msg: $5});';
    }

    return normalizedReplacement;
}

/**
 * Generates a regular expression pattern to match and extract arguments from a given function call based on the specified length.
 * @param {number} length - The number of arguments in the function call.
 * @returns {RegExp} - The regular expression pattern for extracting function call arguments.
 */
function normalizeArgsRegex(length) {
    let normalizedArgsRegex = '';

    if (length == 1) {
        normalizedArgsRegex = /(return|await)\s+([^,]+)/g;
    }

    if (length == 2) {
        normalizedArgsRegex = /(return|await)\s+([^,]+),\s*([^,]+)/g;
    }

    if (length == 3) {
        normalizedArgsRegex = /(return|await)\s+([^,]+),\s*([^,]+),\s*(.+)/g;
    }

    if (length == 4) {
        normalizedArgsRegex = /(return|await)\s+([^,]+),\s*([^,]+),\s*(.+),\s*(.+)/g;
    }

    return normalizedArgsRegex;
}

function replaceRawDollar(line) {
    let modifiedLine = line;
    // replace $().$() to this.$().$()
    const singleDollarlocators = line.split('$(');
    if (
        singleDollarlocators.length > 1 &&
        !singleDollarlocators[0].includes('.') &&
        !singleDollarlocators[0].includes('$')
    ) {
        singleDollarlocators[0] += 'this.';
    }
    modifiedLine = singleDollarlocators.join('$(');

    // replace $$()[0].$() to this.$$()[0].$()
    const multiDollarlocators = modifiedLine.split('$$(');
    if (multiDollarlocators.length > 1 && !multiDollarlocators[0].includes('.')) {
        multiDollarlocators[0] += 'this.';
    }
    modifiedLine = multiDollarlocators.join('$$(');

    return modifiedLine;
}
processDirectory(directoryToScan);
