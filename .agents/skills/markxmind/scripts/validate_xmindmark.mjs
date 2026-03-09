#!/usr/bin/env node
/**
 * Basic XMindMark syntax validation.
 * Usage: node validate_xmindmark.mjs <path-to.md>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const TAB_WIDTH = 4;

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node validate_xmindmark.mjs <path-to.md>');
    process.exit(2);
  }
  return resolve(args[0]);
}

function indentToSpaces(line) {
  let spaces = 0;
  for (const ch of line) {
    if (ch === '\t') spaces += TAB_WIDTH;
    else if (ch === ' ') spaces += 1;
    else break;
  }
  return spaces;
}

function validate(path) {
  const content = readFileSync(path, 'utf-8');
  const lines = content.split(/\r?\n/);
  const errors = [];
  const warnings = [];

  let centralTopicLine = -1;
  const relationshipSources = new Map();
  const relationshipTargets = new Map();
  let prevIndent = -1;
  let prevWasTopic = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip empty lines
    if (line.trim() === '') {
      prevWasTopic = false;
      continue;
    }

    // Central topic: first non-empty line, no leading - or *
    if (centralTopicLine === -1) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        errors.push({ line: lineNum, msg: 'First non-empty line should be central topic (no - or * prefix)' });
      }
      centralTopicLine = lineNum;
      prevIndent = 0;
      prevWasTopic = true;
      continue;
    }

    // Topic line: starts with - or *
    const isTopic = /^[\s]*[-*]\s+/.test(line) || /^[\s]*\[[BS]/.test(line);
    if (isTopic || /^[\s]*[-*]\s+/.test(line)) {
      const indent = indentToSpaces(line);
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (indent !== 0) {
          errors.push({ line: lineNum, msg: 'Main topics (first level) must have no indentation' });
        }
        const afterMarker = line.replace(/^[\s]*[-*]\s+/, '');
        if (afterMarker.length === 0) {
          warnings.push({ line: lineNum, msg: 'Topic has no content after - or *' });
        }
      }

      // Indentation consistency: subtopics should be indented more than parent
      if (prevWasTopic && indent > 0 && prevIndent >= 0 && indent <= prevIndent) {
        warnings.push({ line: lineNum, msg: `Indent ${indent} may be inconsistent (expected > ${prevIndent})` });
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        prevIndent = indent;
      }
      prevWasTopic = true;
    } else {
      prevWasTopic = false;
    }

    // Relationship markers: [n] and [^n]
    const sourceMatch = line.match(/\[(\d+)\](?!\^)/g);
    const targetMatch = line.match(/\[\^(\d+)\](?:\([^)]*\))?/g);
    if (sourceMatch) {
      for (const m of sourceMatch) {
        const n = m.replace(/[^\d]/g, '');
        relationshipSources.set(n, (relationshipSources.get(n) || 0) + 1);
      }
    }
    if (targetMatch) {
      for (const m of targetMatch) {
        const n = m.replace(/[^\d]/g, '').replace('^', '');
        relationshipTargets.set(n, (relationshipTargets.get(n) || 0) + 1);
      }
    }
  }

  // Orphaned relationship markers
  for (const [n, count] of relationshipSources) {
    if (!relationshipTargets.has(n)) {
      warnings.push({ line: 0, msg: `Relationship source [${n}] has no matching target [^${n}]` });
    }
  }
  for (const [n, count] of relationshipTargets) {
    if (!relationshipSources.has(n)) {
      warnings.push({ line: 0, msg: `Relationship target [^${n}] has no matching source [${n}]` });
    }
  }

  // Boundary/Summary format: [B], [B1], [S], [S1], [B]: title, [S]: title
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const badMarker = line.match(/\[(B|S)\s*[:\s]/);
    if (badMarker && !/\[[BS]\d*\]:?\s/.test(line)) {
      const m = line.match(/\[[BS]\d*[^\]]*\]/g);
      if (m && m.some(x => /\[[BS]\s/.test(x))) {
        warnings.push({ line: lineNum, msg: 'Boundary/Summary marker should be [B], [B1], [S], [S1] or [B]: Title' });
      }
    }
  }

  return { errors, warnings, centralTopicLine };
}

function main() {
  const path = parseArgs();
  let result;
  try {
    result = validate(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`File not found: ${path}`);
      process.exit(1);
    }
    throw e;
  }

  const { errors, warnings } = result;

  if (errors.length > 0) {
    console.error('Errors:');
    for (const { line, msg } of errors) {
      console.error(`  Line ${line}: ${msg}`);
    }
  }
  if (warnings.length > 0) {
    console.warn('Warnings:');
    for (const { line, msg } of warnings) {
      console.warn(`  ${line > 0 ? `Line ${line}: ` : ''}${msg}`);
    }
  }

  if (errors.length > 0) {
    process.exit(1);
  }
  console.log('Validation passed.');
}

main();
