import { HttpParams } from '@angular/common/http';
import { toHttpParams } from './transform-http-params';

describe('toHttpParams', () => {
  it('should convert object to HttpParams', () => {
    const obj = { name: 'Pink Floyd', year: 1973 };
    const params = toHttpParams(obj);
    
    expect(params.get('name')).toBe('Pink Floyd');
    expect(params.get('year')).toBe('1973');
  });

  it('should handle Date objects', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const params = toHttpParams({ date });
    
    expect(params.get('date')).toBe(date.toISOString());
  });

  it('should ignore null and undefined values', () => {
    const params = toHttpParams({ a: 1, b: null, c: undefined });
    
    expect(params.has('a')).toBeTruthy();
    expect(params.has('b')).toBeFalsy();
    expect(params.has('c')).toBeFalsy();
  });
});

