import { formatDate } from './format-date';

describe('formatDate', () => {
  it('should format Date object to DD/MM/YYYY', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDate(date)).toBe('15/01/2024');
  });

  it('should format string date to DD/MM/YYYY', () => {
    const dateStr = '2024-12-31T00:00:00';
    expect(formatDate(dateStr)).toBe('31/12/2024');
  });

  it('should pad single digits with zero', () => {
    const date = new Date(2024, 4, 5); // May 5, 2024
    expect(formatDate(date)).toBe('05/05/2024');
  });
});

