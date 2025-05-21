import { Entity } from "../../../core/api/entity";

export interface IFixedUpdate { fixedUpdate(entities: Entity[], fixedDeltaTime:number): void }