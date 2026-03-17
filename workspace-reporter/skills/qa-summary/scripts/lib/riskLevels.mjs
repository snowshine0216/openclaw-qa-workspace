#!/usr/bin/env node
/**
 * Canonical risk-level normalization and comparison helpers.
 */

const RISK_STRENGTH = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export function normalizeRiskLevel(value, defaultValue = null) {
  const normalized = String(value || '').trim().toUpperCase();
  if (['LOW'].includes(normalized)) return 'LOW';
  if (['MEDIUM', 'MODERATE', 'P2'].includes(normalized)) return 'MEDIUM';
  if (['HIGH', 'CRITICAL', 'BLOCKER', 'HIGHEST', 'P0', 'P1'].includes(normalized)) {
    return 'HIGH';
  }
  return defaultValue;
}

export function strongerRisk(current, next) {
  const currentRisk = normalizeRiskLevel(current);
  const nextRisk = normalizeRiskLevel(next);
  if (!currentRisk) return nextRisk;
  if (!nextRisk) return currentRisk;
  return (RISK_STRENGTH[nextRisk] ?? 0) > (RISK_STRENGTH[currentRisk] ?? 0)
    ? nextRisk
    : currentRisk;
}
