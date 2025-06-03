import { IRenderScene } from "./IRenderScene";

export interface IRenderer {
    initialize(container: HTMLElement): void;
    render(scene: IRenderScene): void;
    resize(width: number, height: number): void;
    dispose(): void;
}