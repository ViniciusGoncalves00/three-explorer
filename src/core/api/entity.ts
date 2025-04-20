import { Component } from "./components/component";

export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id(): string { return this._id; }

  private _enabled = true;
  public get enabled(): boolean { return this._enabled; }
  
  private _isAwaked = false;
  public get isAwaked(): boolean { return this._isAwaked; }

  private _isStarted = false;
  public get isStarted(): boolean { return this._isStarted; }

  private _isRuntime = false;
  public get isRuntime(): boolean { return this._isRuntime; }
  
  private _components = new Map<new (...args: any[]) => Component, Component>();
  
  public constructor(id: `${string}-${string}-${string}-${string}-${string}`) {
    this._id = id;
  }

  public addComponent<T extends Component>(type: new (...args: any[]) => T, component: T): void {
    this._components.set(type, component);
  }

  public getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this._components.get(type) as T | undefined;
  }

  public getComponents(): Component[] {
    return Array.from(this._components.values());
  }

  public hasComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
    return this._components.has(type);
  }

  public removeComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
    return this._components.delete(type);
  }

  public clone(): Entity {
    const clone = new Entity(this._id);
    clone._enabled = this._enabled;
    clone._isAwaked = this._isAwaked;
    clone._isStarted = this._isStarted;
    clone._isRuntime = this._isRuntime;
  
    for (const [type, component] of this._components.entries()) {
      clone.addComponent(type, component.clone());
    }
  
    return clone;
  }

  public restoreFrom(other: Entity): void {
    this._enabled = other.enabled;
    this._isAwaked = other.isAwaked;
    this._isStarted = other.isStarted;
    this._isRuntime = other.isRuntime;
  
    this._components.clear();
    for (const [type, component] of other._components.entries()) {
      this._components.set(type, component.clone());
    }
  }
}