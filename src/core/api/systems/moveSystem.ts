// import { ISystem } from "./interfaces/system";
// import { Transform } from "../components/transform";
// import { Rotate } from "../components/rotate";
// import { IUpdate } from "./interfaces/update";
// import { Entity } from "../entity";

// export class MoveSystem implements ISystem, IUpdate {
//     public update(entities: Entity[], deltaTime: number): void {
//         const rotatingEntities = entities.filter(
//             (entity) => entity.hasComponent(Transform) && entity.hasComponent(Rotate)
//         );

//         for (const entity of rotatingEntities) {
//             const transform = entity.getComponent(Transform);
//             const rotate = entity.getComponent(Rotate);

//             if(transform && rotate) {
//                 console.log("[MoveSystem] Entity rotation:", transform.rotation);
//                 console.log("[MoveSystem] Rotate Speed:", rotate.speed);
//                 console.log("[MoveSystem] Rotate Axis Y:", rotate.axis.y);
//                 console.log("[MoveSystem] Delta Time:", deltaTime);

//                 transform.rotation.x += rotate.speed * rotate.axis.x * deltaTime;
//                 transform.rotation.y += rotate.speed * rotate.axis.y * deltaTime;
//                 transform.rotation.z += rotate.speed * rotate.axis.z * deltaTime;
//             }
//         }
//     }
// }