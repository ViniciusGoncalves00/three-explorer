import * as THREE from 'three';

export class ThreeScene {
  public scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }
  enabled: boolean = false;

  update(deltaTime: number) {
  }
}