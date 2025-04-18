import * as THREE from 'three';
import { IUpdatable } from '../../api/iupdatable';

export class ThreeScene implements IUpdatable {
  public scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }
  enabled: boolean = false;

  update(deltaTime: number) {
  }
}