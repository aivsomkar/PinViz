import { describe, it, expect } from 'vitest';
import { latLngToVec3 } from '../../src/lib/latLngToVec3';

const RADIUS = 1;
const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

describe('latLngToVec3', () => {
  it('places (0, 0) on the +X axis', () => {
    const v = latLngToVec3(0, 0, RADIUS);
    expect(close(v.x, 1)).toBe(true);
    expect(close(v.y, 0)).toBe(true);
    expect(close(v.z, 0)).toBe(true);
  });

  it('places the north pole on +Y', () => {
    const v = latLngToVec3(90, 0, RADIUS);
    expect(close(v.x, 0)).toBe(true);
    expect(close(v.y, 1)).toBe(true);
    expect(close(v.z, 0)).toBe(true);
  });

  it('places (0, 90) on -Z (east)', () => {
    const v = latLngToVec3(0, 90, RADIUS);
    expect(close(v.x, 0)).toBe(true);
    expect(close(v.y, 0)).toBe(true);
    expect(close(v.z, -1)).toBe(true);
  });

  it('respects the radius', () => {
    const v = latLngToVec3(0, 0, 3);
    expect(close(v.length(), 3)).toBe(true);
  });
});
