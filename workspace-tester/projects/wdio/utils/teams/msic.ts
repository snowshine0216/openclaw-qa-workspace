import * as cp from 'child_process';
import pkg from 'lodash';
const { isArray } = pkg;

/**
 * call different function baased on platform
 * @param windows  run this function if it is windows platform
 * @param macOS run this function if it is mac platform
 * @returns
 */
export function OSSwitch<T>(windows: () => T, macOS: () => T): T {
    if (process.platform === 'win32') {
        if (windows !== null) return windows();
    } else if (process.platform === 'darwin') {
        if (macOS !== null) return macOS();
    } else {
        throw new Error(`Platform '${process.platform}' is not supported!`);
    }
}

export function killProcessByName(processName: string): void {
    const cmd = OSSwitch(
        () => `taskkill /F /IM ${processName}`,
        () => `killall -9 "${processName}"`
    );
    try {
        //logger.info(`killing process name ${processName}`)
        cp.execSync(cmd);
    } catch (e) {
        console.log(e.message);
    }
}

export function killProcessByPid(pid: number): void {
    const cmd = OSSwitch(
        () => `taskkill /F /PID ${pid}`,
        () => `kill -9 ${pid}`
    );
    try {
        //logger.info(`killing process name ${pid}`)
        cp.execSync(cmd);
    } catch (e) {
        console.log(e.message);
    }
}
