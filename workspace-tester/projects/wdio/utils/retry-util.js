import getLogger from '../scripts/logger.js';
const logger = getLogger({ name: 'retry-util' });
/**
 * retry the void function, if it throw exception, retry it.
 * @param yourFunction  your function, void type.
 * @param maxRetry  maxRetry, default is 5
 * @param interval  the interval between retry, ms, default is 2000ms
 */
export async function retryAsync(func, maxRetry = 5, interval = 2000) {
    let retry = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            var err = new Error();
            var caller = err.stack.split('\n')[2];
            if (caller.includes('(')) {
                caller = caller.match(/\(([^)]+)\)/)?.[1];
            } else {
                caller = caller.split('at ')[1];
            }
            caller = caller.replace('file:///', '').replace(process.cwd().replaceAll('\\', '/'), '').substring(1);
            logger.info(`try the function at [${caller}] for ${retry} time`);
            const res = await func();
            return res;
        } catch (err) {
            logger.error(err.message);
            retry = retry + 1;
            await sleep(interval);
            if (retry > maxRetry) {
                throw new Error(`retried ${maxRetry} times and still get failed.... timeout...`);
            }
        }
    }
}

export async function sleep(ms, note) {
    if (typeof note === 'undefined') {
        note = 'sleep note not provided, better provide one';
    }
    var err = new Error();
    var caller = err.stack.split('\n')[2];
    if (caller.includes('(')) {
        caller = caller.match(/\(([^)]+)\)/)?.[1];
    } else {
        caller = caller.split('at ')[1];
    }
    caller = caller.replace('file:///', '').replace(process.cwd().replaceAll('\\', '/'), '').substring(1);
    logger.info(`start sleep at [${caller}] for ${ms} ms, ${note}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, ms);
    });
}
