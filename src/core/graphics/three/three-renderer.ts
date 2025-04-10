import * as THREE from 'three';

export class DualRenderer {
  private renderer1: THREE.WebGLRenderer;
  private renderer2: THREE.WebGLRenderer;
  private containerEditor: HTMLElement;
  private containerRun: HTMLElement;

  constructor(container_editor: HTMLElement, containerRun: HTMLElement) {
    this.containerEditor = container_editor;
    this.containerRun = containerRun;
    this.renderer1 = new THREE.WebGLRenderer();
    this.renderer2 = new THREE.WebGLRenderer();

    this.setup();
  }

  private setup() {
    this.renderer1.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
    this.renderer2.setSize(this.containerRun.clientWidth, this.containerRun.clientHeight);

    this.containerEditor.appendChild(this.renderer1.domElement);
    this.containerRun.appendChild(this.renderer2.domElement);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer1.render(scene, camera);
    this.renderer2.render(scene, camera);
  }
}
