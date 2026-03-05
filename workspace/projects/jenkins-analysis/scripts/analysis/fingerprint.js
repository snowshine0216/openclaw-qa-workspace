const crypto = require('crypto');

/**
 * Build fingerprint for failure matching across builds
 * Now includes fileName for uniqueness
 */
const buildFingerprint = (fileName, tcId, stepId, stepName, failureType) => {
  const payload = [fileName, tcId, stepId, stepName, failureType].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
};

module.exports = {
  buildFingerprint
};
