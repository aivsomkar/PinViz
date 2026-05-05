import { Vector3 } from 'three';

export function latLngToVec3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (lat * Math.PI) / 180;       // latitude in radians
  const theta = (lng * Math.PI) / 180;      // longitude in radians
  return new Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(theta),
  );
}
