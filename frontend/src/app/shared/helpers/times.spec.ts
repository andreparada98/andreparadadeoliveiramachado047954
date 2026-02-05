import * as Times from './times';

describe('Times Constants', () => {
  it('should have correct values for time units', () => {
    expect(Times.SECOND).toBe(1000);
    expect(Times.MINUTE).toBe(60 * 1000);
    expect(Times.HOUR).toBe(60 * 60 * 1000);
    expect(Times.DAY).toBe(24 * 60 * 60 * 1000);
  });

  it('should have correct day in minutes', () => {
    expect(Times.DAY_IN_MINUTES).toBe(1440);
    expect(Times.TWO_DAY_IN_MINUTES).toBe(2880);
  });
});

