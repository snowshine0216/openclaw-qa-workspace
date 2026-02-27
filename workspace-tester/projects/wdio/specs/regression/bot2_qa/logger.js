/**
 * Logging utilities
 * Provides a unified logger with configurable log levels
 */

import { testParams } from './param-provider.js';

// Log level: DEBUG < INFO < WARN < ERROR
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

let logLevelStr = testParams.logLevel.toUpperCase();
let currentLogLevel = LOG_LEVELS[logLevelStr];
if (currentLogLevel === undefined) {
    console.warn(`Invalid LOG_LEVEL '${logLevelStr}', falling back to INFO`);
    currentLogLevel = LOG_LEVELS.INFO;
}

/**
 * Unified logger with configurable log levels
 * Controlled by LOG_LEVEL environment variable (DEBUG|INFO|WARN|ERROR)
 */
export const logger = {
    debug: (...args) => {
        if (currentLogLevel <= LOG_LEVELS.DEBUG) {
            console.log('[DEBUG]', ...args);
        }
    },
    info: (...args) => {
        if (currentLogLevel <= LOG_LEVELS.INFO) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        if (currentLogLevel <= LOG_LEVELS.WARN) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        if (currentLogLevel <= LOG_LEVELS.ERROR) {
            console.error(...args);
        }
    },
};
