const OPERATOR_REGEX = /^(?<key>[A-Za-z_][A-Za-z0-9_-]*)(?<op>:|>=|<=)(?<raw>.+)$/;

export function parseFilterQuery(query) {
  const tokens = tokenize(query);
  const filters = {};
  const errors = [];

  tokens.forEach((token, index) => {
    const parsed = parseToken(token, index);
    if (parsed.error) {
      errors.push(parsed.error);
      return;
    }

    filters[parsed.key] = {
      op: parsed.op,
      value: coerceValue(parsed.rawValue)
    };
  });

  return { filters, errors };
}

function tokenize(query) {
  if (typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  const tokens = [];
  let buffer = '';
  let inQuotes = false;

  for (let i = 0; i < query.length; i += 1) {
    const char = query[i];
    const prev = i > 0 ? query[i - 1] : '';
    const isEscapedQuote = char === '"' && prev === '\\';

    if (char === '"' && !isEscapedQuote) {
      inQuotes = !inQuotes;
      buffer += char;
      continue;
    }

    if (!inQuotes && /\s/.test(char)) {
      if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = '';
      }
      continue;
    }

    buffer += char;
  }

  if (buffer.length > 0) {
    tokens.push(buffer);
  }

  return tokens;
}

function parseToken(token, index) {
  const match = token.match(OPERATOR_REGEX);
  if (!match?.groups) {
    return {
      error: {
        token,
        index,
        reason: 'Unsupported token format'
      }
    };
  }

  const { key, op, raw } = match.groups;

  if (raw.length === 0) {
    return {
      error: {
        token,
        index,
        reason: 'Missing value'
      }
    };
  }

  return {
    key,
    op,
    rawValue: unquote(raw)
  };
}

function unquote(value) {
  if (value.length < 2 || value[0] !== '"' || value[value.length - 1] !== '"') {
    return value;
  }

  const body = value.slice(1, -1);
  return body
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function coerceValue(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
}
