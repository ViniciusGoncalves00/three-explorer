import { Entity } from "../core/api/entity";

export interface IRenderScene {
    initialize(): void;
    addObject(entity: Entity): void;
    removeObject(id: string): void;
}