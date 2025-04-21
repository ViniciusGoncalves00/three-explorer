import { ISystem } from "./interfaces/system";
import { Transform } from "../components/transform";
import { IUpdate } from "./interfaces/update";
import { Entity } from "../entity";
import { Vector3 } from "../components/vector3";
import { Orbit } from "../components/orbit";

export class OrbitSystem implements ISystem, IUpdate {
    public update(entities: Entity[], deltaTime: number): void {
      const orbitEntities = entities.filter(
        (entity) => entity.hasComponent(Transform) && entity.hasComponent(Orbit)
      );
  
      for (const entity of orbitEntities) {
        const transform = entity.getComponent(Transform);
        const orbit = entity.getComponent(Orbit);
  
        if (transform && orbit && orbit.enabled) {
          orbit.angle += orbit.speed * deltaTime;
          orbit.angle %= Math.PI * 2;
  
          // Vetor da direção inicial (posição relativa à órbita)
          const initial = new Vector3(orbit.distance, 0, 0);
  
          // Rotaciona esse vetor ao redor do eixo da órbita
          const rotated = initial.rotateAround(orbit.axis.normalize(), orbit.angle);
  
          // Define nova posição
          transform.position = orbit.center.add(rotated);
        }
      }
    }
  }
  