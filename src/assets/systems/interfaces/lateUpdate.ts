import { Entity } from "../../../core/api/entity";

export interface ILateUpdate { lateUpdate(entities: Entity[], deltaTime:number): void }