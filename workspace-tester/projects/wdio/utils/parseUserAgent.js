/* eslint-disable no-case-declarations */
import UAParser from 'ua-parser-js';

const macOSNames = {
    10.12: 'Sierra',
    10.13: 'High Sierra',
    10.14: 'Mojave',
    10.15: 'Catalina',
    '11.x': 'Big Sur',
};

function parseOS({ name, version }) {
    switch (name) {
        case 'Windows':
            let versionStr;
            if (version === '8') {
                versionStr = '8.x';
            } else if (version === '10') {
                versionStr = '10';
            } else if (version === '7' || version === 'NT 6.1' || version === 'NT 6.0') {
                versionStr = 'Server 2008 R2 SP1';
            } else {
                return 'N/A';
            }
            return `Microsoft Windows ${versionStr}`;
        case 'Mac OS':
            let shortVersion = version.split('.').slice(0, 2).join('.');
            if (version.split('.')[0] === '11') {
                shortVersion = '11.x';
            }
            const versionName = macOSNames[shortVersion];
            return `Mac OS ${shortVersion} ${versionName}`;
        case 'Linux':
            return 'Docker (Linux on Linux)';
        default:
            return 'N/A';
    }
}

module.exports = function parseUserAgent(userAgent) {
    const result = UAParser(userAgent);
    return {
        clientOS: parseOS(result.os),
    };
};
