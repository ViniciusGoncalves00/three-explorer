import { Entity } from "../../entity";

export interface IFixedUpdate { fixedUpdate(entities: Entity[], fixedDeltaTime:number): void }