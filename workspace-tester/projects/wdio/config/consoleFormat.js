import chalk from 'chalk';

function errorLog(text) {
    console.error(chalk.red(text));
}

function groupLog(labelName = '') {
    labelName = labelName.trimStart();
    labelName = labelName.charAt(0).toUpperCase() + labelName.slice(1);

    console.group(labelName);
}

function groupLogEnd() {
    console.groupEnd();
}

function infoLog(text) {
    console.info(chalk.gray(text));
}

function successLog(text) {
    console.log(text);
}

export { errorLog, groupLog, groupLogEnd, infoLog, successLog };
