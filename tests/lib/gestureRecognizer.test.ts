import { describe, it, expect } from 'vitest';
import {
  isPinching,
  pinchPosition,
  type HandLandmark,
} from '../../src/lib/gestureRecognizer';

// Build a 21-landmark hand where landmarks 4 (thumb tip) and 8 (index tip) are placed at given points.
// All other landmarks are zeroed — they don't matter for pinch detection.
function landmarksWithThumbIndex(
  thumb: { x: number; y: number; z?: number },
  index: { x: number; y: number; z?: number },
): HandLandmark[] {
  const arr: HandLandmark[] = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));
  arr[4] = { x: thumb.x, y: thumb.y, z: thumb.z ?? 0 };
  arr[8] = { x: index.x, y: index.y, z: index.z ?? 0 };
  return arr;
}

describe('isPinching', () => {
  it('returns true when thumb and index are within threshold', () => {
    const lm = landmarksWithThumbIndex({ x: 0.5, y: 0.5 }, { x: 0.51, y: 0.51 });
    expect(isPinching(lm, 0.05)).toBe(true);
  });

  it('returns false when thumb and index are far apart', () => {
    const lm = landmarksWithThumbIndex({ x: 0.5, y: 0.5 }, { x: 0.7, y: 0.5 });
    expect(isPinching(lm, 0.05)).toBe(false);
  });

  it('considers the z axis (3D distance, not just 2D)', () => {
    // x/y are identical but z differs → should NOT be pinching.
    const lm = landmarksWithThumbIndex({ x: 0.5, y: 0.5, z: 0 }, { x: 0.5, y: 0.5, z: 0.2 });
    expect(isPinching(lm, 0.05)).toBe(false);
  });
});

describe('pinchPosition', () => {
  it('returns the midpoint of thumb and index tips', () => {
    const lm = landmarksWithThumbIndex({ x: 0.4, y: 0.6 }, { x: 0.6, y: 0.4 });
    const p = pinchPosition(lm);
    expect(p.x).toBeCloseTo(0.5);
    expect(p.y).toBeCloseTo(0.5);
  });
});
