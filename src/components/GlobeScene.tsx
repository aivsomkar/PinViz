import { useEffect, useRef } from 'react';
import {
  Raycaster,
  Vector2,
  type Intersection,
  type Object3D,
} from 'three';
import { createScene } from '../three/createScene';
import { createGlobe } from '../three/createGlobe';
import { createStarField } from '../three/createStarField';
import { createPhotoNode } from '../three/createPhotoNode';
import { setupControls } from '../three/controls';
import { latLngToVec3 } from '../lib/latLngToVec3';

const GLOBE_RADIUS = 1;

// A few smoke-test stops so we can see the outline pass working.
const DEMO_STOPS: Array<{ id: string; lat: number; lng: number }> = [
  { id: 'tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 'kyoto', lat: 35.0116, lng: 135.7681 },
  { id: 'osaka', lat: 34.6937, lng: 135.5023 },
  { id: 'reykjavik', lat: 64.1466, lng: -21.9426 },
  { id: 'nyc', lat: 40.7128, lng: -74.006 },
];

export function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const bundle = createScene(canvas);
    const { scene, camera, composer, outline, resize } = bundle;

    const globe = createGlobe(GLOBE_RADIUS);
    scene.add(globe.group);

    const stars = createStarField();
    scene.add(stars.points);

    // Place demo nodes as children of the globe group so they rotate with it.
    const nodeMeshes = DEMO_STOPS.map((stop) => {
      // Position node slightly outside the globe radius so it sits on the surface.
      const pos = latLngToVec3(stop.lat, stop.lng, GLOBE_RADIUS * 1.005);
      const node = createPhotoNode(pos, stop.id);
      globe.group.add(node.mesh);
      return node;
    });

    const controlsBundle = setupControls(camera, canvas);

    // Initial size + resize listener
    const onResize = () => resize(window.innerWidth, window.innerHeight);
    onResize();
    window.addEventListener('resize', onResize);

    // Hover / raycast → outline pass
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('pointermove', onPointerMove);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      controlsBundle.update();
      globe.update(camera.position);

      raycaster.setFromCamera(pointer, camera);
      const targets: Object3D[] = nodeMeshes.map((n) => n.mesh);
      const hits: Intersection[] = raycaster.intersectObjects(targets, false);
      outline.selectedObjects = hits.length > 0 ? [hits[0].object] : [];

      composer.render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      controlsBundle.dispose();
      nodeMeshes.forEach((n) => n.dispose());
      stars.dispose();
      globe.dispose();
      bundle.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}
