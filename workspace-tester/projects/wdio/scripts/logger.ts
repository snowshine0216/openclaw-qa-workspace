import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function getLogger(namespace: string) {
    const warn = function (message: string): void {
        console.log(`${namespace}${chalk.ansi256(208)(message)}`);
    };
    const error = function (message: string): void {
        console.log(`${namespace}${chalk.bold.red(message)}`);
    };
    const info = function (message: string): void {
        if (namespace) {
            console.log(`${namespace}${chalk.bold.blue(message)}`);
        } else {
            console.log(`${chalk.bold.blue(message)}`);
        }
    };
    const gray = function (message: string): void {
        console.log(`${namespace}${chalk.gray(message)}`);
    };
    const log = function (message: string): void {
        console.log(`${namespace}${message}`);
    };

    return {
        warn,
        error,
        info,
        gray,
        log,
    };
}
