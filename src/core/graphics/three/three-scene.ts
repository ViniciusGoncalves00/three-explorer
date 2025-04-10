import * as THREE from 'three';

export class ThreeScene {
  public scene: THREE.Scene;
  public cube: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    
    this.scene.add(this.cube);
  }

  update(delta: number) {
    this.cube.rotation.x += 0.01 * delta;
    this.cube.rotation.y += 0.01 * delta;
  }
}
