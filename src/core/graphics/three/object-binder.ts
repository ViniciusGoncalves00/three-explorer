import { Transform } from '../../api/components/transform';
import { Entity } from '../../api/entity';
import * as THREE from 'three';

export class ObjectBinder {
  private map = new Map<Entity, THREE.Object3D>();

  bind(entity: Entity, object: THREE.Object3D): void {
    this.map.set(entity, object);
  }

  getObject(entity: Entity): THREE.Object3D | undefined {
    return this.map.get(entity);
  }

  updateFromLogic(): void {
    this.map.forEach((object3D, entity) => {
      const transform = entity.getComponent(Transform);
      if (transform) {
        object3D.position.copy(transform.position);
        object3D.rotation.x = transform.rotation.x;
        object3D.rotation.y = transform.rotation.y;
        object3D.rotation.z = transform.rotation.z;
      }
    });
  }
}
