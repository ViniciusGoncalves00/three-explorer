export class Entity {
  private _id: `${string}-${string}-${string}-${string}-${string}`;
  public get id() : string { return this._id };

  private _name: string;
  public get name() : string { return this._name };
  public set name(name: string) { this._name = name };
  
  private _components = new Map<string, any>();

  public constructor(id: `${string}-${string}-${string}-${string}-${string}`, name: string) {
    this._id = id;
    this._name = name;
  }

  public addComponent<T>(name: string, component: T) {
    this._components.set(name, component);
  }

  public getComponent<T>(name: string): T | undefined {
    return this._components.get(name);
  }

  public serialize(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
    };
  }

  public static deserialize(data: Record<string, any>): Entity {
    const { id, name } = data;

    if (typeof id !== 'string' || typeof name !== 'string') {
      throw new Error("Invalid data for create an Entity");
    }

    return new Entity(id as `${string}-${string}-${string}-${string}-${string}`, name);
  }
}