import { calculateDifferenceInDays } from './calculate-difference-in-days';

describe('calculateDifferenceInDays', () => {
  it('should return 0 for same day', () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 1, 12, 0, 0);
    expect(calculateDifferenceInDays(d1, d2)).toBe(0);
  });

  it('should return correct difference for different days', () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 10);
    expect(calculateDifferenceInDays(d1, d2)).toBe(9);
  });

  it('should handle negative difference', () => {
    const d1 = new Date(2024, 0, 10);
    const d2 = new Date(2024, 0, 1);
    expect(calculateDifferenceInDays(d1, d2)).toBe(-9);
  });
});

