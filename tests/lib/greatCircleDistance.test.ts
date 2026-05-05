import { describe, it, expect } from 'vitest';
import { greatCircleDistance } from '../../src/lib/greatCircleDistance';

const closeTo = (a: number, b: number, tolKm: number) => Math.abs(a - b) < tolKm;

describe('greatCircleDistance', () => {
  it('returns 0 for identical points', () => {
    expect(greatCircleDistance(40, -74, 40, -74)).toBe(0);
  });

  it('NYC → LAX is ~3955 km (within 25 km)', () => {
    // NYC: 40.7128, -74.0060   LAX: 33.9416, -118.4085
    const d = greatCircleDistance(40.7128, -74.0060, 33.9416, -118.4085);
    expect(closeTo(d, 3955, 25)).toBe(true);
  });

  it('Tokyo → Kyoto is ~360 km (within 5 km)', () => {
    // Tokyo: 35.6762, 139.6503   Kyoto: 35.0116, 135.7681
    const d = greatCircleDistance(35.6762, 139.6503, 35.0116, 135.7681);
    expect(closeTo(d, 360, 5)).toBe(true);
  });
});
