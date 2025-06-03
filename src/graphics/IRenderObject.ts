import { Entity } from "../core/api/entity";

export interface IRenderObject {
    dispose(): void;
    bind(entity: Entity): void;
}