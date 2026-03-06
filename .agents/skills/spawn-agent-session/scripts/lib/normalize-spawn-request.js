const REQUIRED_FIELDS = ['agent_id', 'mode', 'runtime', 'task'];
const LEGACY_REQUIRED_OPTIONS = ['agentId', 'mode', 'runtime', 'taskTemplate'];

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const assertObject = (value, message) => {
  if (!isObject(value)) {
    throw new Error(message);
  }
};

const assertString = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
};

const assertBoolean = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    throw new Error(`${fieldName} must be a boolean`);
  }
};

const assertArray = (value, fieldName) => {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
};

const assertAttachmentValue = (value, fieldName) => {
  if (value === undefined) {
    return;
  }

  assertString(value, fieldName);
};

const validateAttachment = (attachment, index) => {
  assertObject(attachment, `attachments[${index}] must be an object`);
  assertString(attachment.name, `attachments[${index}].name`);
  assertAttachmentValue(attachment.path, `attachments[${index}].path`);
  assertAttachmentValue(attachment.content, `attachments[${index}].content`);

  if (!attachment.path && !attachment.content) {
    throw new Error(`attachments[${index}] must include path or content`);
  }
};

const validateAttachments = (attachments) => {
  assertArray(attachments, 'attachments');
  attachments.forEach(validateAttachment);
};

const toLabel = (label, index) => {
  if (typeof label === 'string' && label.trim() !== '') {
    return label.trim();
  }

  return `spawn-request-${index + 1}`;
};

const toThread = (thread) => {
  if (thread === undefined) {
    return false;
  }

  assertBoolean(thread, 'thread');
  return thread;
};

const buildResultContract = (expectedOutputs) => ({
  kind: 'structured-result',
  expected_outputs: expectedOutputs,
  success_field: 'session_result',
  error_field: 'session_error',
});

const buildHandoff = (label, expectedOutputs) => ({
  label,
  session_key_hint: `spawn-agent-session:${label}`,
  result_contract: buildResultContract(expectedOutputs),
});

const buildOpenClawArgs = (request, label) => ({
  task: request.task,
  agentId: request.agent_id,
  label,
  mode: request.mode,
  runtime: request.runtime,
});

const buildOpenClawPayload = (request, label) => ({
  tool: 'sessions_spawn',
  args: buildOpenClawArgs(request, label),
});

const buildNormalizedRequest = (request, index, source, expectedOutputs = []) => {
  const normalizedRequest = { ...request, label: toLabel(request.label, index), thread: toThread(request.thread) };
  return {
    request: normalizedRequest,
    openclaw: buildOpenClawPayload(normalizedRequest, normalizedRequest.label),
    handoff: buildHandoff(normalizedRequest.label, expectedOutputs),
    source,
  };
};

const validateCanonicalRequest = (request) => {
  assertObject(request, 'Spawn input must be a JSON object');
  REQUIRED_FIELDS.forEach((fieldName) => assertString(request[fieldName], fieldName));

  if (request.attachments !== undefined) {
    validateAttachments(request.attachments);
  }

  if (request.thread !== undefined) {
    assertBoolean(request.thread, 'thread');
  }
};

const normalizeCanonicalRequest = (request, index) => {
  validateCanonicalRequest(request);
  const attachments = request.attachments ?? [];
  return buildNormalizedRequest({ ...request, attachments }, index, { kind: 'canonical', index });
};

const resolveTemplateValue = (values, key) => {
  if (values[key] === undefined) {
    throw new Error(`Unknown template placeholder: ${key}`);
  }

  return values[key];
};

const replaceTemplate = (template, values) => template.replace(
  /{{\s*([\w_]+)\s*}}/g,
  (_, key) => String(resolveTemplateValue(values, key)),
);

const assertLegacyOptions = (options) => {
  LEGACY_REQUIRED_OPTIONS.forEach((fieldName) => assertString(options[fieldName], fieldName));
};

const buildLegacyRequest = (entry, options) => ({
  agent_id: options.agentId,
  mode: options.mode,
  runtime: options.runtime,
  task: replaceTemplate(options.taskTemplate, entry),
  attachments: [{ name: options.attachmentName ?? 'input.json', path: entry.input_file }],
  label: replaceTemplate(options.labelTemplate ?? 'spawn-{{issue_key}}', entry),
  thread: options.thread ?? false,
});

const normalizeLegacyEntry = (entry, index, options) => {
  assertObject(entry, `rca_inputs[${index}] must be an object`);
  assertString(entry.issue_key, `rca_inputs[${index}].issue_key`);
  assertString(entry.input_file, `rca_inputs[${index}].input_file`);

  if (entry.output_file !== undefined) {
    assertString(entry.output_file, `rca_inputs[${index}].output_file`);
  }

  const request = buildLegacyRequest(entry, options);
  const expectedOutputs = entry.output_file ? [entry.output_file] : [];
  const source = { kind: 'legacy-rca-manifest', issue_key: entry.issue_key, input_file: entry.input_file };
  return buildNormalizedRequest(request, index, source, expectedOutputs);
};

const normalizeLegacyManifest = (manifest, options) => {
  assertObject(manifest, 'Legacy manifest must be a JSON object');
  assertArray(manifest.rca_inputs, 'rca_inputs');
  assertLegacyOptions(options);
  return manifest.rca_inputs.map((entry, index) => normalizeLegacyEntry(entry, index, options));
};

const detectSourceKind = (input) => (Array.isArray(input?.rca_inputs) ? 'legacy-rca-manifest' : 'canonical');

const normalizeSpawnInput = (input, options = {}) => {
  const sourceKind = detectSourceKind(input);
  const requests = sourceKind === 'legacy-rca-manifest'
    ? normalizeLegacyManifest(input, options)
    : [normalizeCanonicalRequest(input, 0)];

  return { version: 1, source_kind: sourceKind, count: requests.length, requests };
};

module.exports = {
  normalizeSpawnInput,
};
