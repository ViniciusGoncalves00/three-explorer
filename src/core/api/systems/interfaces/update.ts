import { Entity } from "../../entity";

export interface IUpdate { update(entities: Entity[], deltaTime:number): void }