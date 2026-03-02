import os from 'os';

export function isMac() {
    return os.platform() === 'darwin';
}
