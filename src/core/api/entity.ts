import { Component } from "./components/component";
import { isComponent } from "../engine/typeguard";

type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;

export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id(): string { return this._id; }

  private _enabled = true;
  public get enabled(): boolean { return this._enabled; }
  public set enabled(value: boolean) { this._enabled = value; }

  private _isAwaked = false;
  public get isAwaked(): boolean { return this._isAwaked; }
  public set isAwaked(value: boolean) { this._isAwaked = value; }

  private _isStarted = false;
  public get isStarted(): boolean { return this._isStarted; }
  public set isStarted(value: boolean) { this._isStarted = value; }

  private _isRuntime = false;
  public get isRuntime(): boolean { return this._isRuntime; }
  public set isRuntime(value: boolean) { this._isRuntime = value; }

  private _components = new Map<ComponentConstructor, Component>();
  private _componentTypes = new Map<string, ComponentConstructor>();

  private _editorState?: Record<string, any>;
  private _runtimeState?: Record<string, any>;

  public constructor(id: `${string}-${string}-${string}-${string}-${string}`, isRuntime: boolean = false) {
    this._id = id;
    this._isRuntime = isRuntime;
  }

  public addComponent<T extends Component>(type: ComponentConstructor<T>, component: T): void {
    if (!isComponent(component)) {
      throw new Error(`Invalid component: must implement IComponent`);
    }
    this._components.set(type, component);
    this._componentTypes.set(type.name, type);
  }

  public removeComponent<T extends Component>(type: ComponentConstructor<T>): boolean {
    this._componentTypes.delete(type.name);
    return this._components.delete(type);
  }

  public hasComponent<T extends Component>(type: ComponentConstructor<T>): boolean {
    return this._components.has(type);
  }

  public getComponent<T extends Component>(type: ComponentConstructor<T>): T {
    const component = this._components.get(type);
    if (!component) throw new Error(`Component of type ${type.name} not found on Entity ${this.id}`);
    return component as T;
  }

  public getAllComponents(): Component[] {
    return Array.from(this._components.values());
  }

  public clearComponents(): void {
    this._components.clear();
    this._componentTypes.clear();
  }

  public saveEditorState(): void {
    this._editorState = this.serialize();
  }

  public saveRuntimeState(): void {
    this._runtimeState = this.serialize();
  }

  public restoreEditorState(): void {
    if (this._editorState) this.restoreFromData(this._editorState);
  }

  public restoreRuntimeState(): void {
    if (this._runtimeState) this.restoreFromData(this._runtimeState);
  }

  private restoreFromData(data: Record<string, any>) {
    const restored = Entity.deserialize(data, this._componentTypes);
    this.enabled = restored.enabled;
    this.isAwaked = restored.isAwaked;
    this.isStarted = restored.isStarted;

    for (const [type, component] of this._components.entries()) {
      const restoredComponent = restored.getComponent(type);
      Object.assign(component, restoredComponent);
    }
  }

  public serialize(): Record<string, any> {
    const serializedComponents: Record<string, any> = {};

    for (const [type, component] of this._components.entries()) {
      serializedComponents[type.name] = {
        typeName: type.name,
        data: component.serialize(),
      };
    }

    return {
      id: this.id,
      enabled: this.enabled,
      isAwaked: this.isAwaked,
      isStarted: this.isStarted,
      components: serializedComponents,
    };
  }

  public static deserialize(
    data: Record<string, any>,
    componentTypes: Map<string, ComponentConstructor>
  ): Entity {
    const { id, enabled, isAwaked, isStarted, components = {} } = data;

    if (typeof id !== "string") {
      throw new Error("Invalid data: Entity must have a valid ID.");
    }

    const entity = new Entity(id as `${string}-${string}-${string}-${string}-${string}`);
    entity.enabled = !!enabled;
    entity.isAwaked = !!isAwaked;
    entity.isStarted = !!isStarted;

    for (const key in components) {
      const { typeName, data: componentData } = components[key];
      const componentType = componentTypes.get(typeName);

      if (!componentType) {
        console.warn(`Unknown component type: ${typeName}`);
        continue;
      }

      const component = (componentType as any).deserialize(componentData);
      entity.addComponent(componentType, component);
    }

    return entity;
  }
}