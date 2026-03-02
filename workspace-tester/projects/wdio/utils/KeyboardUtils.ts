export function getKey(key: string) {
    switch (key.toLowerCase()) {
        case 'left':
            return '\uE012'; // ArrowLeft
        case 'right':
            return '\uE014'; // ArrowRight
        case 'up':
            return '\uE013'; // ArrowUp
        case 'down':
            return '\uE015'; // ArrowDown
        case 'control':
            if (process.platform.includes('darwin')) {
                return '\uE03D'; //on macOS
            } else if (process.platform.includes('win32')) {
                return '\uE009'; //on windows
            }
            break;
        case 'shift':
            return '\uE008'; // Shift
        case 'alt':
            return '\uE00A'; // Alt
        default:
            throw 'Invalid key';
    }
}
