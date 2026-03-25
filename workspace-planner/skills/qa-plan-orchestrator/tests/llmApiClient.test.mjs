import test from 'node:test';
import assert from 'node:assert/strict';

import { callLlm } from '../benchmarks/qa-plan-v2/scripts/lib/llmApiClient.mjs';

const ORIGINAL_FETCH = globalThis.fetch;

function resetBenchmarkEnv() {
  delete process.env.OPENAI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.LLM_API_BASE_URL;
  delete process.env.BENCHMARK_LLM_MODEL;
  delete process.env.BENCHMARK_LLM_MAX_TOKENS;
  delete process.env.BENCHMARK_LLM_RETRY_ATTEMPTS;
  delete process.env.BENCHMARK_LLM_RETRY_BASE_DELAY_MS;
}

function installOpenAiCompatEnv() {
  process.env.OPENAI_API_KEY = 'test-key';
  process.env.LLM_API_BASE_URL = 'https://example.invalid';
  process.env.BENCHMARK_LLM_MODEL = 'gpt-5.2';
  process.env.BENCHMARK_LLM_RETRY_ATTEMPTS = '2';
  process.env.BENCHMARK_LLM_RETRY_BASE_DELAY_MS = '0';
  process.env.BENCHMARK_LLM_REQUEST_TIMEOUT_MS = '1';
}

test.afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  resetBenchmarkEnv();
});

test('callLlm retries transient 502 responses and eventually succeeds', async () => {
  installOpenAiCompatEnv();
  let calls = 0;

  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return {
        ok: false,
        status: 502,
        text: async () => JSON.stringify({
          error: {
            message: 'Upstream request failed',
            type: 'upstream_error',
          },
        }),
      };
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        choices: [{ message: { content: 'OK' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 3, completion_tokens: 1, total_tokens: 4 },
      }),
    };
  };

  const result = await callLlm({ prompt: 'Say OK.' });

  assert.equal(calls, 2);
  assert.equal(result.content, 'OK');
  assert.equal(result.usage.total_tokens, 4);
});

test('callLlm does not retry invalid 400 request errors', async () => {
  installOpenAiCompatEnv();
  let calls = 0;

  globalThis.fetch = async () => {
    calls += 1;
    return {
      ok: false,
      status: 400,
      text: async () => JSON.stringify({
        error: {
          message: 'Failed to parse request body',
          type: 'invalid_request_error',
        },
      }),
    };
  };

  await assert.rejects(
    () => callLlm({ prompt: 'Say OK.' }),
    /LLM API 400/,
  );
  assert.equal(calls, 1);
});

test('callLlm retries timeout-style abort errors and eventually succeeds', async () => {
  installOpenAiCompatEnv();
  let calls = 0;

  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      throw error;
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        choices: [{ message: { content: 'RECOVERED' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 4, completion_tokens: 2, total_tokens: 6 },
      }),
    };
  };

  const result = await callLlm({ prompt: 'Recover.' });

  assert.equal(calls, 2);
  assert.equal(result.content, 'RECOVERED');
  assert.equal(result.usage.total_tokens, 6);
});
