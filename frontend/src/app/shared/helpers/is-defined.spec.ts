import { isDefined } from './is-defined';

describe('isDefined', () => {
  it('should return true for valid values', () => {
    expect(isDefined('test')).toBeTruthy();
    expect(isDefined(123)).toBeTruthy();
    expect(isDefined({ a: 1 })).toBeTruthy();
  });

  it('should return false for none values', () => {
    expect(isDefined(null)).toBeFalsy();
    expect(isDefined(undefined)).toBeFalsy();
    expect(isDefined('')).toBeFalsy();
    expect(isDefined({})).toBeFalsy();
  });
});

