import { Entity } from "../../../core/api/entity";

export interface IUpdate { update(entities: Entity[], deltaTime:number): void }