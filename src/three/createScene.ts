import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  ACESFilmicToneMapping,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { createOutlinePass } from './passes/outlinePassFactory';

export interface SceneBundle {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  composer: EffectComposer;
  smaa: SMAAPass;
  taa: TAARenderPass;
  outline: OutlinePass;
  resize: (w: number, h: number) => void;
  dispose: () => void;
}

export function createScene(canvas: HTMLCanvasElement): SceneBundle {
  const scene = new Scene();
  scene.background = new Color(0x0a0a0a);

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.6);

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const composer = new EffectComposer(renderer);

  const taa = new TAARenderPass(scene, camera);
  taa.sampleLevel = 2;
  taa.unbiased = true;
  taa.enabled = true;
  composer.addPass(taa);

  const outline = createOutlinePass(scene, camera, window.innerWidth, window.innerHeight);
  composer.addPass(outline);

  const smaa = new SMAAPass(window.innerWidth, window.innerHeight);
  composer.addPass(smaa);

  composer.addPass(new OutputPass());

  function resize(w: number, h: number) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
  }

  function dispose() {
    composer.dispose();
    const gl = renderer.getContext();
    const loseContextExt = gl.getExtension('WEBGL_lose_context');
    loseContextExt?.loseContext();
    renderer.dispose();
  }

  return { scene, camera, renderer, composer, smaa, taa, outline, resize, dispose };
}
