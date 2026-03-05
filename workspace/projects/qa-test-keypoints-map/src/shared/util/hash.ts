import { createHash } from 'node:crypto';

export function stableId(seed: string, length = 10): string {
  return createHash('sha256').update(seed).digest('hex').slice(0, length);
}
