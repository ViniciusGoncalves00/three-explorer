import * as THREE from 'three';
import { IRenderObject } from "../../IRenderObject";
import { Entity } from '../../../core/api/entity';
import { Transform } from '../../../assets/components/transform';
import { Mesh } from '../../../assets/components/mesh';

export class ThreeObject implements IRenderObject {
    private readonly _object: THREE.Object3D;
    public get object(): THREE.Object3D { return this._object; }

    public constructor(){
        this._object = new THREE.Object3D();
    };

    public bind(entity: Entity): void {
        if(entity.hasComponent(Transform)) {
            const transform = entity.getComponent(Transform);

            this._object.position.set( transform.position.x.value, transform.position.y.value, transform.position.z.value);

            transform.position.x.subscribe(value => this._object.position.x = value);
            transform.position.y.subscribe(value => this._object.position.y = value);
            transform.position.z.subscribe(value => this._object.position.z = value);

            this._object.rotation.set(transform.rotation.x.value, transform.rotation.y.value, transform.rotation.z.value);

            transform.rotation.x.subscribe(value => this._object.rotation.x = value);
            transform.rotation.y.subscribe(value => this._object.rotation.y = value);
            transform.rotation.z.subscribe(value => this._object.rotation.z = value);

            this._object.scale.set(transform.scale.x.value, transform.scale.y.value, transform.scale.z.value);

            transform.scale.x.subscribe(value => this._object.scale.x = value);
            transform.scale.y.subscribe(value => this._object.scale.y = value);
            transform.scale.z.subscribe(value => this._object.scale.z = value);
        }
        
        if(entity.hasComponent(Mesh)) {
            this._object.add(this.bindMeshComponentToGeometry(entity.getComponent(Mesh)));
        }
    }

    public dispose(): void {
        this.disposeObject(this._object);
    }

    private disposeObject(obj: THREE.Object3D): void {
        if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;

            if (mesh.geometry) {
                mesh.geometry.dispose();
            }

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
                for (const key in material) {
                    const value = (material as any)[key];
                    if (value && value instanceof THREE.Texture) {
                        value.dispose();
                    }
                }
                material.dispose();
            }
        }

        for (const child of obj.children) {
            this.disposeObject(child);
        }

        obj.clear();
    }

    public bindMeshComponentToGeometry(meshComponent: Mesh): THREE.Mesh {
        const geometry = new THREE.BufferGeometry();
        const vertices = meshComponent.vertices.items;
        const positionArray = new Float32Array(vertices.length * 3);
    
        vertices.forEach((vertex, i) => {
          positionArray[i * 3 + 0] = vertex.x.value;
          positionArray[i * 3 + 1] = vertex.y.value;
          positionArray[i * 3 + 2] = vertex.z.value;

          vertex.x.subscribe(() => {
            positionArray[i * 3] = vertex.x.value;
            geometry.attributes.position.needsUpdate = true;
          });

          vertex.y.subscribe(() => {
            positionArray[i * 3 + 1] = vertex.y.value;
            geometry.attributes.position.needsUpdate = true;
          });

          vertex.z.subscribe(() => {
            positionArray[i * 3 + 2] = vertex.z.value;
            geometry.attributes.position.needsUpdate = true;
          });
        });

        geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
        );

        return mesh;
    }
}