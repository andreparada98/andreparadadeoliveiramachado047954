import { isAllValuesNull } from './is-all-values-null';

describe('isAllValuesNull', () => {
  it('should return true if all values are null, undefined or empty string', () => {
    const obj = { a: null, b: undefined, c: '' };
    expect(isAllValuesNull(obj)).toBeTruthy();
  });

  it('should return false if at least one value is valid', () => {
    const obj = { a: null, b: 'value', c: '' };
    expect(isAllValuesNull(obj)).toBeFalsy();
  });

  it('should return true for empty object', () => {
    expect(isAllValuesNull({})).toBeTruthy();
  });
});

