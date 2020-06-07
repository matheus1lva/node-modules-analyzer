export function hasKey(object: object, key: string) {
    return Object.keys(object || {}).some((keyValue) => keyValue === key);
}