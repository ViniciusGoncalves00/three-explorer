export interface IUpdatable {
    enabled: boolean;
    update(deltaTime: number): void;
}