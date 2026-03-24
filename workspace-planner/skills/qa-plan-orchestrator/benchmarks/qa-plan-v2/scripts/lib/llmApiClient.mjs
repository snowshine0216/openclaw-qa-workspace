/**
 * Minimal LLM API client for benchmark runner/grader.
 * Zero external dependencies — uses Node built-in fetch.
 *
 * Provider resolution (first found key wins):
 *   OPENAI_API_KEY    → OpenAI  (default model: gpt-4o)
 *   ANTHROPIC_API_KEY → Anthropic (default model: claude-opus-4-5)
 *   GEMINI_API_KEY    → Gemini  (default model: gemini-2.5-pro)
 *
 * Base URL override:
 *   LLM_API_BASE_URL  → Redirect all calls to an OpenAI-compatible endpoint.
 *                       When set, provider-specific formats (Anthropic headers,
 *                       Gemini URL scheme) are bypassed; all calls use the
 *                       OpenAI /v1/chat/completions format.
 *                       Use for: Azure OpenAI, local Ollama, LiteLLM proxies.
 *                       Example: LLM_API_BASE_URL=http://localhost:11434
 *
 * Optional tuning:
 *   BENCHMARK_LLM_MODEL      → override model name
 *   BENCHMARK_LLM_MAX_TOKENS → max output tokens (default 16384)
 */

const DEFAULT_MAX_TOKENS = 16384;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_BASE_DELAY_MS = 1000;
const DEFAULT_REQUEST_TIMEOUT_MS = 45000;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function getMaxTokens() {
  const raw = process.env.BENCHMARK_LLM_MAX_TOKENS;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_TOKENS;
}

function getRetryAttempts() {
  const raw = Number(process.env.BENCHMARK_LLM_RETRY_ATTEMPTS);
  return Number.isFinite(raw) && raw >= 1
    ? Math.floor(raw)
    : DEFAULT_RETRY_ATTEMPTS;
}

function getRetryBaseDelayMs() {
  const raw = Number(process.env.BENCHMARK_LLM_RETRY_BASE_DELAY_MS);
  return Number.isFinite(raw) && raw >= 0
    ? raw
    : DEFAULT_RETRY_BASE_DELAY_MS;
}

function getRequestTimeoutMs() {
  const raw = Number(process.env.BENCHMARK_LLM_REQUEST_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0
    ? raw
    : DEFAULT_REQUEST_TIMEOUT_MS;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function detectProvider() {
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY, defaultModel: 'gpt-4o' };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY, defaultModel: 'claude-opus-4-5' };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY, defaultModel: 'gemini-2.5-pro' };
  }
  throw new Error(
    'No LLM API key found. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY in .env or environment.',
  );
}

export function resolveModel(defaultModel) {
  return process.env.BENCHMARK_LLM_MODEL || defaultModel;
}

function buildHttpError(status, text) {
  const error = new Error(`LLM API ${status}: ${text.slice(0, 500)}`);
  error.status = status;
  error.responseText = text;
  return error;
}

function isRetryableLlmError(error) {
  if (RETRYABLE_STATUS_CODES.has(Number(error?.status))) {
    return true;
  }
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('fetch failed')
    || message.includes('network error')
    || message.includes('timed out')
    || message.includes('upstream request failed')
    || message.includes('upstream stream ended')
    || message.includes('econnreset')
    || error?.name === 'AbortError'
  );
}

async function withRetry(operation) {
  const attempts = getRetryAttempts();
  const baseDelayMs = getRetryBaseDelayMs();
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !isRetryableLlmError(error)) {
        throw error;
      }
      const sleepMs = baseDelayMs * (2 ** (attempt - 1));
      if (sleepMs > 0) {
        await delay(sleepMs);
      }
    }
  }

  throw lastError;
}

async function postJson(url, headers, body) {
  return withRetry(async () => {
    let response;
    const controller = new AbortController();
    const timeoutMs = getRequestTimeoutMs();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      const wrapped = new Error(
        error?.name === 'AbortError'
          ? `LLM request timed out after ${timeoutMs}ms`
          : `LLM fetch failed: ${error.message}`,
      );
      wrapped.name = error?.name || 'Error';
      wrapped.cause = error;
      throw wrapped;
    } finally {
      clearTimeout(timeoutId);
    }

    const text = await response.text();
    if (!response.ok) {
      throw buildHttpError(response.status, text);
    }
    return JSON.parse(text);
  });
}

/**
 * OpenAI /v1/chat/completions format.
 * Also used when LLM_API_BASE_URL is set (all providers fall back here).
 */
async function callOpenAiCompat({ apiKey, model, systemPrompt, prompt, jsonMode, maxTokens }) {
  const baseUrl = (process.env.LLM_API_BASE_URL || 'https://api.openai.com').replace(/\/$/, '');
  const url = `${baseUrl}/v1/chat/completions`;
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const body = { model, messages, max_tokens: maxTokens };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const data = await postJson(url, { Authorization: `Bearer ${apiKey}` }, body);
  const content = data.choices?.[0]?.message?.content ?? '';
  const usage = data.usage ?? {};
  return {
    content,
    usage: {
      input_tokens: usage.prompt_tokens ?? 0,
      output_tokens: usage.completion_tokens ?? 0,
      total_tokens: usage.total_tokens ?? 0,
    },
  };
}

async function callAnthropic({ apiKey, model, systemPrompt, prompt, jsonMode, maxTokens }) {
  const url = 'https://api.anthropic.com/v1/messages';
  const body = {
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  };
  const system = systemPrompt || (jsonMode ? 'Return only valid JSON.' : '');
  if (system) {
    body.system = system;
  }

  const data = await postJson(
    url,
    { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body,
  );
  const content = data.content?.[0]?.text ?? '';
  const usage = data.usage ?? {};
  return {
    content,
    usage: {
      input_tokens: usage.input_tokens ?? 0,
      output_tokens: usage.output_tokens ?? 0,
      total_tokens: (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0),
    },
  };
}

async function callGemini({ apiKey, model, systemPrompt, prompt, jsonMode, maxTokens }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const parts = [];
  if (systemPrompt) {
    parts.push({ text: `${systemPrompt}\n\n` });
  }
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { maxOutputTokens: maxTokens },
  };
  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const data = await postJson(url, {}, body);
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const usage = data.usageMetadata ?? {};
  return {
    content,
    usage: {
      input_tokens: usage.promptTokenCount ?? 0,
      output_tokens: usage.candidatesTokenCount ?? 0,
      total_tokens: usage.totalTokenCount ?? 0,
    },
  };
}

/**
 * Call the configured LLM provider.
 *
 * When LLM_API_BASE_URL is set, all providers use the OpenAI-compatible
 * /v1/chat/completions format against that base URL, regardless of which
 * API key was detected.
 *
 * @param {object} options
 * @param {string} options.prompt
 * @param {string} [options.systemPrompt]
 * @param {string} [options.model]       - Override model name
 * @param {boolean} [options.jsonMode]   - Request structured JSON output
 * @param {number} [options.maxTokens]
 * @returns {Promise<{ content: string, usage: { input_tokens, output_tokens, total_tokens } }>}
 */
export async function callLlm({
  prompt,
  systemPrompt = '',
  model: modelOverride = '',
  jsonMode = false,
  maxTokens = getMaxTokens(),
}) {
  const { provider, apiKey, defaultModel } = detectProvider();
  const model = modelOverride || resolveModel(defaultModel);
  const callArgs = { apiKey, model, systemPrompt, prompt, jsonMode, maxTokens };

  // When a custom base URL is set, always use OpenAI-compatible format.
  if (process.env.LLM_API_BASE_URL) {
    return callOpenAiCompat(callArgs);
  }

  if (provider === 'openai') return callOpenAiCompat(callArgs);
  if (provider === 'anthropic') return callAnthropic(callArgs);
  if (provider === 'gemini') return callGemini(callArgs);
  throw new Error(`Unknown provider: ${provider}`);
}
