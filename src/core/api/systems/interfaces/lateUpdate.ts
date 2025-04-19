import { Entity } from "../../entity";

export interface ILateUpdate { lateUpdate(entities: Entity[], deltaTime:number): void }