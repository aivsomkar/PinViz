export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandData {
  landmarks: HandLandmark[];
  handedness: 'Left' | 'Right';
}

export interface HandFrame {
  hands: HandData[];
  timestamp: number;
}

const THUMB_TIP = 4;
const INDEX_TIP = 8;

export function isPinching(landmarks: HandLandmark[], threshold: number): boolean {
  const t = landmarks[THUMB_TIP];
  const i = landmarks[INDEX_TIP];
  const dx = t.x - i.x;
  const dy = t.y - i.y;
  const dz = t.z - i.z;
  return dx * dx + dy * dy + dz * dz < threshold * threshold;
}

export function pinchPosition(landmarks: HandLandmark[]): { x: number; y: number } {
  const t = landmarks[THUMB_TIP];
  const i = landmarks[INDEX_TIP];
  return { x: (t.x + i.x) / 2, y: (t.y + i.y) / 2 };
}
