export function expectResult<T>(desc: string, actual: T) {
    if (!desc.includes('#{expected}')) {
        desc += `, Expected: #{expected}`;
    }
    if (!desc.includes('#{actual}')) {
        desc += `, Actual: #{actual}`;
    }
    return since(desc).expect(actual);
}
