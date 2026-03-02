import { createHash } from 'node:crypto';
export function stableId(seed, length = 10) {
    return createHash('sha256').update(seed).digest('hex').slice(0, length);
}
//# sourceMappingURL=hash.js.map