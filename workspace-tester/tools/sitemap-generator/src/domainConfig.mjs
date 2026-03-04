import domainsConfig from '../config/domains.json' with { type: 'json' };

/**
 * Get domains in deterministic config order.
 * @returns {string[]}
 */
export function getDomainKeysInOrder() {
  return Object.keys(domainsConfig.domains);
}

/**
 * Convert a domain key to title case words.
 * @param {string} domainKey
 * @returns {string}
 */
export function titleCaseDomain(domainKey) {
  return domainKey
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Resolve display name with fallback when alias is not configured.
 * @param {string} domain
 * @param {{ displayName?: string }} entry
 * @returns {string}
 */
export function resolveDisplayName(domain, entry = {}) {
  const candidate = typeof entry.displayName === 'string' ? entry.displayName.trim() : '';
  return candidate || titleCaseDomain(domain);
}

/**
 * Validate all domain configuration entries.
 * @param {Record<string, any>} [domains]
 * @returns {string[]}
 */
export function validateDomainsConfig(domains = domainsConfig.domains) {
  const errors = [];
  for (const [domain, entry] of Object.entries(domains)) {
    if (!Array.isArray(entry?.pomPaths)) {
      errors.push(`${domain}.pomPaths must be an array`);
    }
    if (!Array.isArray(entry?.specPaths)) {
      errors.push(`${domain}.specPaths must be an array`);
    }
    if (typeof entry?.navigationHint !== 'string' || entry.navigationHint.trim() === '') {
      errors.push(`${domain}.navigationHint must be a non-empty string`);
    }
    if (!Array.isArray(entry?.keyEntryPoints)) {
      errors.push(`${domain}.keyEntryPoints must be an array`);
    }
    if (entry?.displayName !== undefined && typeof entry.displayName !== 'string') {
      errors.push(`${domain}.displayName must be a string when provided`);
    }
  }
  return errors;
}

/**
 * Throw if domain configuration violates required contract.
 */
export function assertValidDomainsConfig() {
  const errors = validateDomainsConfig();
  if (errors.length === 0) {
    return;
  }
  throw new Error(`Invalid domains config:\n- ${errors.join('\n- ')}`);
}

/**
 * Get one domain config entry.
 * @param {string} domain
 * @returns {{
 *   displayName?: string,
 *   pomPaths: string[],
 *   specPaths: string[],
 *   navigationHint: string,
 *   keyEntryPoints: string[],
 *   componentOverrides?: Record<string, { cssRoot?: string }>
 * } | undefined}
 */
export function getDomainConfigEntry(domain) {
  return domainsConfig.domains[domain];
}
