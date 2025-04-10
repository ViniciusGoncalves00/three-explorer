import * as THREE from 'three';

export class DualRenderer {
  private renderer1: THREE.WebGLRenderer;
  private renderer2: THREE.WebGLRenderer;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer1 = new THREE.WebGLRenderer();
    this.renderer2 = new THREE.WebGLRenderer();

    this.setup();
  }

  private setup() {
    const width = this.container.clientWidth / 2;
    const height = this.container.clientHeight;

    this.renderer1.setSize(width, height);
    this.renderer2.setSize(width, height);

    this.container.appendChild(this.renderer1.domElement);
    this.container.appendChild(this.renderer2.domElement);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer1.render(scene, camera);
    this.renderer2.render(scene, camera);
  }
}
