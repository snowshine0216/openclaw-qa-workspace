import AxeBuilder from '@axe-core/webdriverio';

/**
 * API to run accessibility scan for the specific html element with config
 * @param {Object} pageObject - current page object of the spec
 * @param {string} selector - The selector of the element which need to do the axe scan
 * @param {Object} config - Optional. The config file for the axe scan
 * @param {Array} config.tags - Optional. Use if there's specific WCAG level required
 * @param {Array} config.disabledRules - Optional. Use if there's specific roles want to disabled during the scan
 * @param {Array} config.ignoredImpact - Optional. Use if want to ignore the result with certain impact level
 * @param {boolean} warnOnly - Optional. False by default. Will only print the violation result instead of mark the TC as failed when set to true
 */
export function runAxe(pageObject, selector, config, warnOnly) {
    return axeAnalysis(pageObject, selector, config).then((formattedResults) => {
        if (formattedResults.length > 0) {
            if (warnOnly) {
                console.error(`Axe violations: ${formattedResults}`);
            } else {
                fail(`Axe violations: ${formattedResults}`);
            }
        } else {
            console.log(`Axe success: ${selector}`);
        }
    });
}

function axeAnalysis(pageObject, selector, config) {
    let builder = new AxeBuilder({ client: browser });
    if (config) {
        const { tags, disabledRules } = config;
        if (tags) {
            builder = builder.withTags(tags);
        }
        if (disabledRules) {
            builder = builder.disableRules(disabledRules);
        }
    }
    return builder
        .include(selector)
        .analyze()
        .then((value) => axeResultFilter(value.violations, config?.ignoredImpact))
        .then((filteredViolations) => axeResultFormatter(filteredViolations));
}

function axeResultFilter(violations, impact) {
    return violations.filter((violation) => (impact ? !impact.includes(violation?.impact) : true));
}

function axeResultFormatter(violations) {
    return violations.map(
        (violation) =>
            '\n' +
            '--------------------------------------------------------------------\n' +
            `description: ${violation.description}\n` +
            `help: ${violation.help}\n` +
            `helpUrl: ${violation.helpUrl}\n` +
            `id: ${violation.id}\n` +
            `impact: ${violation.impact}\n` +
            `tags: ${violation.tags}\n` +
            `html: ${violation.nodes.map((node) => node.html)}\n` +
            `failuresSummary: ${violation.nodes.map((node) => node.failureSummary)}\n`
    );
}
