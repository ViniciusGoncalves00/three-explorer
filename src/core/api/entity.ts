import { Component } from "./components/component";

export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id(): string { return this._id; }

  private _name: string = "Entity";
  public get name(): string { return this._name; }
  public set name(name: string) { this._name = name; }

  private _isEnabled = true;
  public get isEnabled(): boolean { return this._isEnabled; }
  public set isEnabled(isEnabled: boolean) { this._isEnabled = isEnabled; }
  
  private _isAwaked = false;
  public get isAwaked(): boolean { return this._isAwaked; }
  public set isAwaked(isAwaked: boolean) { this._isAwaked = isAwaked; }

  private _isStarted = false;
  public get isStarted(): boolean { return this._isStarted; }
  public set isStarted(isStarted: boolean) { this._isStarted = isStarted; }

  private _isRuntime = false;
  public get isRuntime(): boolean { return this._isRuntime; }
  public set isRuntime(isRuntime: boolean) { this._isRuntime = isRuntime; }
  
  private _components = new Map<new (...args: any[]) => Component, Component>();
  
  public constructor(id: `${string}-${string}-${string}-${string}-${string}`) {
    this._id = id;
  }

  public addComponent<T extends Component>(component: T): void {
    this._components.set(component.constructor as new (...args: any[]) => T, component);
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
    clone._name = this._name;
    clone._isEnabled = this._isEnabled;
    clone._isAwaked = this._isAwaked;
    clone._isStarted = this._isStarted;
    clone._isRuntime = this._isRuntime;
  
    for (const [type, component] of this._components.entries()) {
      clone.addComponent(component.clone());
    }
  
    return clone;
  }

  public restoreFrom(other: Entity): void {
    this._name = other.name;
    this._isEnabled = other.isEnabled;
    this._isAwaked = other.isAwaked;
    this._isStarted = other.isStarted;
    this._isRuntime = other.isRuntime;

    for (const type of this._components.keys()) {
      if (!other._components.has(type)) {
        this._components.delete(type);
      }
    }

    for (const [type, otherComponent] of other._components.entries()) {
      if (!this._components.has(type)) {
        this._components.set(type, otherComponent.clone());
      } else {
        const thisComponent = this._components.get(type)!;
        thisComponent.copyFrom(otherComponent as any);
      }
    }
  }
}