import * as THREE from 'three';
import { ThreeScene } from './three-scene';
import { DualRenderer } from './three-renderer';
import { createDefaultCamera } from './three-camera';

export class ThreeEngine {
  private scene: ThreeScene;
  private renderer: DualRenderer;
  private camera: THREE.PerspectiveCamera;
  private lastTime: number;

  private miliseconds = 16.666; // frame time delta (~60fps = 16.6ms)

  constructor(container_editor: HTMLElement, containerRun: HTMLElement) {
    this.scene = new ThreeScene();
    this.renderer = new DualRenderer(container_editor, containerRun);
    this.camera = createDefaultCamera();
    this.lastTime = performance.now();

    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = (now - this.lastTime) / this.miliseconds;
    this.lastTime = now;

    this.scene.update(delta);
    this.renderer.render(this.scene.scene, this.camera);
  };
}
