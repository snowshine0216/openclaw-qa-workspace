#!/usr/bin/env bash
# lib/logging.sh — Pure logging helpers. Source this file; do not execute directly.

log_info()  { echo "[INFO]  $(date -u +%FT%TZ) $*" >&2; }
log_error() { echo "[ERROR] $(date -u +%FT%TZ) $*" >&2; }
log_step()  { echo ""; echo "=== $* ===" >&2; echo "" >&2; }
