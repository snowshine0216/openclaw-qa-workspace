const isString = (s) => {
    return typeof s === 'string' || s instanceof String;
};

/**
 * Compare versions
 * @param {String} v1
 * @param {String} v2
 * @return:
 *        -1, if v1 < v2
 *         0, if v1 = v2
 *         1, if v1 > v2
 *        -2, if v1 or v2 is invalid
 */
export const compareVersion = (v1, v2) => {
    if (!isString(v1) || !isString(v2)) {
        return -2;
    }

    const s1 = v1?.split('.') ?? '';
    const s2 = v2?.split('.') ?? '';

    for (let i = 0; i < Math.max(s1.length, s2.length); i += 1) {
        const n1 = i < s1.length ? parseInt(s1[i], 10) : 0;
        const n2 = i < s2.length ? parseInt(s2[i], 10) : 0;
        if (Number.isNaN(n1) || Number.isNaN(n2)) {
            return -2;
        }

        if (n1 < n2) {
            return -1;
        }

        if (n1 > n2) {
            return 1;
        }
    }

    return 0;
};
