import { ISystem } from "./interfaces/system";
import { IUpdate } from "./interfaces/update";
import { Entity } from "../../core/api/entity";
import { Transform } from "../components/transform";
import { Shake } from "../components/shake";

export class ShakeSystem implements ISystem, IUpdate {
  public update(entities: Entity[], deltaTime: number): void {
    const shakingEntities = entities.filter(
      (entity) => entity.hasComponent(Transform) && entity.hasComponent(Shake)
    );

    for (const entity of shakingEntities) {
      const transform = entity.getComponent(Transform);
      const shake = entity.getComponent(Shake);

      if (!shake.enabled) continue;

      if (!shake.hasOriginalPosition()) {
        shake.storeOriginalPosition(
          transform.position.x.value,
          transform.position.y.value,
          transform.position.z.value
        );
      }

      shake.elapsed += deltaTime;

      if (shake.elapsed >= shake.duration.value) {
        // const [x, y, z] = shake.getOriginalPosition();
        // transform.position.set(x, y, z);
        shake.reset();
        continue;
      }

      const shakeAmount = shake.intensity.value * (1 - shake.elapsed / shake.duration.value);

      const [x, y, z] = shake.getOriginalPosition();
      transform.position.x.value = x + (Math.random() - 0.5) * shakeAmount;
      transform.position.y.value = y + (Math.random() - 0.5) * shakeAmount;
      transform.position.z.value = z + (Math.random() - 0.5) * shakeAmount;
    }
  }
}
