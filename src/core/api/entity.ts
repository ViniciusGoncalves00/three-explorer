import { Component } from "./components/component";

export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id(): string { return this._id; }

  private _enabled: boolean = true;
  public get enabled(): boolean { return this._enabled; }
  public set enabled(value: boolean) { this._enabled = value; }

  private _components = new Map<Function, any>();

  public constructor(id: `${string}-${string}-${string}-${string}-${string}`) {
    this._id = id;
  }

  public addComponent<T extends Component>(type: new (...args: any[]) => T, component: T): void {
    if (!this.isComponent(component)) {
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


  public serialize(): Record<string, any> {
    return {
      id: this.id,
      enabled: this.enabled,
    };
  }

  public static deserialize(data: Record<string, any>): Entity {
    const { id, enabled } = data;

    if (typeof id !== 'string') {
      throw new Error("Invalid data: Entity must have a valid ID.");
    }

    const entity = new Entity(id as `${string}-${string}-${string}-${string}-${string}`);
    if (typeof enabled === 'boolean') {
      entity.enabled = enabled;
    }

    return entity;
  }

  private isComponent(obj: any): obj is Component {
    return obj && typeof obj === 'object' && 'entity' in obj;
  }
}