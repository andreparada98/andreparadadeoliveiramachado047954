import { isNone } from './is-none';

export function isDefined(value: any) {
    return !isNone(value);
}
