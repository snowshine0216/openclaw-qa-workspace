const REQUIRED_FIELDS = ['agent_id', 'mode', 'runtime', 'task'];

function assertObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }
}

function assertString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

function normalizeAttachments(attachments = []) {
  if (!Array.isArray(attachments)) {
    throw new Error('attachments must be an array');
  }

  attachments.forEach((attachment, index) => {
    assertObject(attachment, `attachments[${index}] must be an object`);
    assertString(attachment.name, `attachments[${index}].name`);
    if (!attachment.path && !attachment.content) {
      throw new Error(`attachments[${index}] must include path or content`);
    }
  });

  return attachments;
}

function buildNormalizedRequest(request, index, source, expectedOutputs = []) {
  const label = request.label?.trim() || `spawn-request-${index + 1}`;
  return {
    request: { ...request, label, attachments: normalizeAttachments(request.attachments) },
    openclaw: {
      tool: 'sessions_spawn',
      args: {
        task: request.task,
        agentId: request.agent_id,
        label,
        mode: request.mode,
        runtime: request.runtime,
        attachments: normalizeAttachments(request.attachments),
        thread: Boolean(request.thread),
      },
    },
    handoff: {
      label,
      session_key_hint: `spawn-agent-session:${label}`,
      result_contract: {
        kind: 'structured-result',
        expected_outputs: expectedOutputs,
        success_field: 'session_result',
        error_field: 'session_error',
      },
    },
    source,
  };
}

export function normalizeSpawnInput(input) {
  assertObject(input, 'Spawn input must be an object');
  REQUIRED_FIELDS.forEach((fieldName) => assertString(input[fieldName], fieldName));
  const request = buildNormalizedRequest(
    { ...input, attachments: input.attachments || [] },
    0,
    input.source || { kind: 'canonical', index: 0 },
    input.expected_outputs || []
  );
  return {
    version: 1,
    source_kind: input.source_kind || 'canonical',
    count: 1,
    requests: [request],
  };
}
