import { Entity } from "../core/api/entity";

export interface IGraphicEngine<T> {
  init(canvasA: HTMLCanvasElement, canvasB: HTMLCanvasElement): void;
  dispose(): void;
  startRender(): void;
  resize(width: number, height: number): void;
  bind(entity: Entity, object: T): void;

  addEntity(entity: Entity): void;
//   removeObject(object: Renderable): void;
//   updateObject(object: Renderable): void;

//   addLight(light: Light): void;
//   removeLight(light: Light): void;
//   updateLight(light: Light): void;

//   createMaterial(params: MaterialParams): Material;
//   updateMaterial(material: Material, params: MaterialParams): void;
//   disposeMaterial(material: Material): void;

//   createGeometry(params: GeometryParams): Geometry;
//   updateGeometry(geometry: Geometry, params: GeometryParams): void;
//   disposeGeometry(geometry: Geometry): void;

  setEditorCamera(canvas: HTMLCanvasElement, startPosition: {x: number, y: number, z: number}): void;
  setPreviewCamera(canvas: HTMLCanvasElement, startPosition: {x: number, y: number, z: number}): void;
  toggleActiveCamera(): void;
//   setActiveCamera(camera: Camera): void;
//   getActiveCamera(): Camera;

  setFog(color: {r: number, g: number, b: number}, near: number, far: number): void;
  setBackground(color: {r: number, g: number, b: number}): void;
  setGridHelper(color: {r: number, g: number, b: number}): void;
  setAxisHelper(color: {r: number, g: number, b: number}): void;
}