export class Entity {
  private components = new Map<string, any>();

  public addComponent<T>(name: string, component: T) {
    this.components.set(name, component);
  }

  public getComponent<T>(name: string): T | undefined {
    return this.components.get(name);
  }
}