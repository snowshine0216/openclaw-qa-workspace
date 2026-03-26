#!/usr/bin/env node

const GENERIC_AREAS = new Set([
  '',
  'general',
  'unknown',
  'n/a',
  'na',
  'feature',
  'story',
  'epic',
  'defect',
  'bug',
  'issue',
  'task',
]);

const AREA_RULES = [
  {
    area: 'Information Window',
    patterns: [/\binformation window\b/i, /\bifw\b/i],
  },
  {
    area: 'Rich Text & Narrative Content',
    patterns: [/\brich text\b/i, /\btext box\b/i, /\bmarkdown\b/i, /\bsummary\b/i],
  },
  {
    area: 'Image Handling',
    patterns: [/\bimage\b/i, /\bheic\b/i],
  },
  {
    area: 'Object Selection & Binding',
    patterns: [/\bselector\b/i, /\bselection\b/i, /\bobject\b/i, /\bbreak by\b/i, /\btrend\b/i],
  },
  {
    area: 'Layout & Positioning',
    patterns: [
      /\blayout\b/i,
      /\breposition\b/i,
      /\bposition\b/i,
      /\bsize\b/i,
      /\btitle bar\b/i,
      /\btitle size\b/i,
      /\bcontainer\b/i,
      /\bfont\b/i,
      /\btheme\b/i,
    ],
  },
  {
    area: 'Save / Save-As Flows',
    patterns: [/\bsave-as\b/i, /\bsave as\b/i, /\bsave\b/i, /\boverwrite\b/i, /\btemplate\b/i],
  },
  {
    area: 'Prompt Handling',
    patterns: [/\bprompt\b/i, /\breport builder\b/i, /\bpause mode\b/i],
  },
  {
    area: 'Localization / i18n',
    patterns: [/\bi18n\b/i, /\blocaliz/i, /\btranslated\b/i, /\blocale\b/i, /\bchinese\b/i],
  },
  {
    area: 'Session & Dialog Handling',
    patterns: [/\bsession timeout\b/i, /\bconfirm to close\b/i, /\bpopup\b/i, /\bdialog\b/i],
  },
  {
    area: 'Toolbar & Menus',
    patterns: [/\btoolbar\b/i, /\bmenu\b/i, /\bview menu\b/i, /\bformat menu\b/i],
  },
  {
    area: 'Performance',
    patterns: [/\bperformance\b/i, /\bslow\b/i, /\blatency\b/i, /\btakes \d+s\b/i],
  },
  {
    area: 'Action Reliability',
    patterns: [/\bunsupported action\b/i, /\binconsistent\b/i, /\bdoes not work\b/i, /\bfail(?:s|ed)?\b/i],
  },
];

// Strip attachment filenames (image-XXXX.ext, media-XXXX.ext) from ADF JSON payloads
// to prevent keyword rules from matching artifact noise like "image-20260324-021922.png".
function stripAdfArtifacts(text) {
  return text
    .replace(/\b(?:image|media|attachment)-[\w.-]+\.\w{2,5}\b/gi, '')
    .replace(/"type"\s*:\s*"media[^"]*"/gi, '');
}

function isMeaningfulArea(value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    return false;
  }
  return !GENERIC_AREAS.has(normalized.toLowerCase());
}

function classifyByText(text) {
  for (const rule of AREA_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return rule.area;
    }
  }
  if (/\bauto dash\b/i.test(text)) {
    return 'Auto Dash Core Flow';
  }
  return 'General';
}

export function inferFunctionalArea(defect = {}) {
  const explicitArea = [defect.area, defect.functional_area, defect.component].find(isMeaningfulArea);
  if (explicitArea) {
    return String(explicitArea).trim();
  }

  const rawText = `${defect.summary ?? ''} ${defect.description ?? ''}`.trim();
  const text = stripAdfArtifacts(rawText);
  if (!text) {
    return 'General';
  }
  return classifyByText(text);
}

