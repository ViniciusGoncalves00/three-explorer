import * as THREE from 'three';
import { Entity } from '../../core/api/entity';
import { Transform } from '../../assets/components/transform';

export class ObjectBinder {
  private map = new Map<Entity, THREE.Object3D>();

  public bind(entity: Entity, object: THREE.Object3D): void {
    this.map.set(entity, object);
  }

  public getObject(entity: Entity): THREE.Object3D | undefined {
    return this.map.get(entity);
  }

  public updateFromLogic(): void {
    this.map.forEach((object3D, entity) => {
      const transform = entity.getComponent(Transform) as Transform;
      object3D.position.x = transform.position.x.value;
      object3D.position.y = transform.position.y.value;
      object3D.position.z = transform.position.z.value;
      object3D.rotation.x = transform.rotation.x.value;
      object3D.rotation.y = transform.rotation.y.value;
      object3D.rotation.z = transform.rotation.z.value;
      object3D.scale.x = transform.scale.x.value;
      object3D.scale.y = transform.scale.y.value;
      object3D.scale.z = transform.scale.z.value;
    });
  }
}
