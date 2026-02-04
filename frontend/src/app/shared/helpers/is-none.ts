export function isNone(value: any) {
    if (value == null) return true;
    if (value === '') return true;
    if (typeof value == 'string' && value.trim() == '') return true;
    if (value instanceof Date) return false;
    if (value instanceof Object) return Object.keys(value).length == 0;
    if (value instanceof Array) return value.length == 0;
    return false;
}
