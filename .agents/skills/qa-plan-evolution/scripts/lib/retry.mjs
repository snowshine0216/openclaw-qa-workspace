/**
 * Async retry helper for flaky IO or subprocess boundaries.
 */
export async function withRetry(fn, options = {}) {
  const {
    retries = 3,
    delayMs = 100,
    onRetry = () => {},
  } = options;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt === retries) break;
      onRetry(attempt + 1, e);
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}
