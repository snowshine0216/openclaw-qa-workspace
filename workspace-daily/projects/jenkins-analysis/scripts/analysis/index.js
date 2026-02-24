const { buildFingerprint } = require('./fingerprint');
const {
  fetchUrl,
  parseSpectreData,
  fetchSpectreData,
  parseSpectreUrl,
  classifySpectreResult
} = require('./spectre');
const {
  analyzeFailure,
  heuristicAnalysis,
  buildAnalysisResult,
  extractFailureDetails
} = require('./ai_analyzer');
const {
  checkPreviousBuilds,
  countConsecutiveFailures
} = require('./history');

module.exports = {
  buildFingerprint,
  fetchUrl,
  parseSpectreData,
  fetchSpectreData,
  parseSpectreUrl,
  classifySpectreResult,
  analyzeFailure,
  heuristicAnalysis,
  buildAnalysisResult,
  extractFailureDetails,
  checkPreviousBuilds,
  countConsecutiveFailures
};
