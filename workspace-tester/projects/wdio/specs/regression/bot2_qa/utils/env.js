/**
 * Environment variable utilities
 * Provides functions to safely read and parse environment variables
 */

/**
 * Get an environment variable value
 * @param {string} name - The environment variable name
 * @param {*} defaultValue - Default value if not set (optional)
 * @returns {string} The environment variable value
 * @throws {Error} If the variable is not set and no default provided
 */
export function getEnvVariable(name, defaultValue) {
    const value = process.env[name];
    if (value === undefined || value === null || value.trim() === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${name} is not set!`);
    }
    return value;
}

/**
 * Get a boolean environment variable value
 * @param {string} name - The environment variable name
 * @param {boolean} defaultValue - Default value if not set (default: false)
 * @returns {boolean} The parsed boolean value
 */
export function getBooleanEnvVariable(name, defaultValue = false) {
    const value = process.env[name];
    if (value === undefined || value === null || value.trim() === '') {
        return defaultValue;
    }
    return value.toLowerCase() === 'true';
}
