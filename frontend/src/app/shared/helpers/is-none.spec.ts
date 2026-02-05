import { isNone } from './is-none';

describe('isNone', () => {
  it('should return true for null or undefined', () => {
    expect(isNone(null)).toBeTruthy();
    expect(isNone(undefined)).toBeTruthy();
  });

  it('should return true for empty string', () => {
    expect(isNone('')).toBeTruthy();
    expect(isNone('   ')).toBeTruthy();
  });

  it('should return true for empty object or array', () => {
    expect(isNone({})).toBeTruthy();
    expect(isNone([])).toBeTruthy();
  });

  it('should return false for valid values', () => {
    expect(isNone('test')).toBeFalsy();
    expect(isNone(123)).toBeFalsy();
    expect(isNone({ a: 1 })).toBeFalsy();
    expect(isNone([1])).toBeFalsy();
    expect(isNone(new Date())).toBeFalsy();
  });
});

