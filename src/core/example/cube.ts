import * as THREE from 'three';
import { ConcreteObject } from "../api/concrete-object";

export class Cube extends ConcreteObject {
    public geometry: THREE.BoxGeometry;
    public material: THREE.MeshBasicMaterial;
    public mesh: THREE.Mesh;

    public constructor() {
        super();
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public update(deltaTime: number): void {
        this.transform.rotation.x += 0.01 * deltaTime;
        this.transform.rotation.y += 0.01 * deltaTime;
        this.mesh.rotation.x = this.transform.rotation.x;
        this.mesh.rotation.y = this.transform.rotation.y;
        this.mesh.rotation.z = this.transform.rotation.z;
    }
}