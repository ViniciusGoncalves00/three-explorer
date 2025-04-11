import * as THREE from 'three';
import { IUpdatable } from '../../api/iupdatable';

export class ThreeScene implements IUpdatable {
  public scene: THREE.Scene;
  public cube: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    
    this.scene.add(this.cube);
  }

  update(deltaTime: number) {
    this.cube.rotation.x += 0.01 * deltaTime;
    this.cube.rotation.y += 0.01 * deltaTime;
  }
}