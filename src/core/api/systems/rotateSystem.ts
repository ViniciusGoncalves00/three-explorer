import { ISystem } from "./interfaces/system";
import { Transform } from "../components/transform";
import { Rotate } from "../components/rotate";
import { IUpdate } from "./interfaces/update";
import { Entity } from "../entity";

export class RotateSystem implements ISystem, IUpdate {
    public update(entities: Entity[], deltaTime: number): void {
        const rotatingEntities = entities.filter(
            (entity) => entity.hasComponent(Transform) && entity.hasComponent(Rotate)
        );

        for (const entity of rotatingEntities) {
            const transform = entity.getComponent(Transform);
            const rotate = entity.getComponent(Rotate);

            if(transform && rotate) {
                transform.rotation.x += rotate.speed * rotate.axis.x * deltaTime;
                transform.rotation.y += rotate.speed * rotate.axis.y * deltaTime;
                transform.rotation.z += rotate.speed * rotate.axis.z * deltaTime;
            }
        }
    }
}