import { Component } from "./components/component";
import { isComponent } from "../engine/typeguard";

export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id(): string { return this._id; }

  private _enabled: boolean = true;
  public get enabled(): boolean { return this._enabled; }
  public set enabled(value: boolean) { this._enabled = value; }

  private _isAwaked: boolean = false;
  public get isAwaked(): boolean { return this._isAwaked; }
  public set isAwaked(value: boolean) { this._isAwaked = value; }

  private _isStarted: boolean = false;
  public get isStarted(): boolean { return this._isStarted; }
  public set isStarted(value: boolean) { this._isStarted = value; }

  private _isRuntime: boolean = false;
  public get isRuntime(): boolean { return this._isRuntime; }
  public set isRuntime(value: boolean) { this._isRuntime = value; }

  private _originalState?: Record<string, any>;
  public get originalState(): Record<string, any> | undefined { return this._originalState; }
  public set originalState(value: Record<string, any> | undefined) { this._originalState = value; }

  private _components = new Map<new (...args: any[]) => Component, Component>()

  public constructor(id: `${string}-${string}-${string}-${string}-${string}`, isRuntime: boolean = false) {
    this._id = id;
    this._isRuntime = isRuntime;
  }

  public addComponent<T extends Component>(type: new (...args: any[]) => T, component: T): void {
    if (!isComponent(component)) {
      throw new Error(`Invalid component: must implement IComponent`);
    }
    this._components.set(type, component);
  }
  
  public removeComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
    return this._components.delete(type);
  }

  public hasComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
    return this._components.has(type);
  }

  public getComponent<T extends Component>(type: new (...args: any[]) => T): T {
    const component = this._components.get(type);
    if (component === undefined) {
      throw new Error(`Component of type ${type.name} not found on Entity ${this.id}`);
    }
    return component as T;
  }

  public getAllComponents(): any[] {
    return Array.from(this._components.values());
  }

  public clearComponents(): void {
    this._components.clear();
  }

  public saveState(): void {
    this._originalState = this.serialize();
  }

  public restoreState(): void {
    if (!this._originalState) return;

    const restored = Entity.deserialize(this._originalState);
    this.enabled = restored.enabled;

    for (const [type, component] of this._components.entries()) {
      const restoredComponent = restored.getComponent(type);
      Object.assign(component, restoredComponent);
    }
  }

  public serialize(): Record<string, any> {
    return {
      id: this.id,
      enabled: this.enabled,
      isAwaked: this.isAwaked,
      isStarted: this.isStarted,
    };
  }

  public static deserialize(data: Record<string, any>): Entity {
    const { id, enabled, isAwaked, isStarted } = data;

    if (typeof id !== 'string') {
      throw new Error("Invalid data: Entity must have a valid ID.");
    }

    const entity = new Entity(id as `${string}-${string}-${string}-${string}-${string}`);
    if (typeof enabled === 'boolean') entity.enabled = enabled;
    if (typeof isAwaked === 'boolean') entity.isAwaked = isAwaked;
    if (typeof isStarted === 'boolean') entity.isStarted = isStarted;

    return entity;
  }
}