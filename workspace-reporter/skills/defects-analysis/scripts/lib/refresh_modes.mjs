#!/usr/bin/env node

const EXPLICIT_REFRESH_MODES = new Set(['smart_refresh', 'full_regenerate']);

export function isExplicitRefreshMode(mode) {
  return EXPLICIT_REFRESH_MODES.has(mode);
}

export function selectReleaseChildAction(defaultAction, explicitMode) {
  return isExplicitRefreshMode(explicitMode) ? explicitMode : defaultAction;
}
