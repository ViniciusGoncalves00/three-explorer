import { Transform } from "./components/transform";
import { Entity } from "./entity";

export class ConcreteObject extends Entity {
  private id: string;
  private name: string;
  private transform: Transform;

  private _enabled: boolean = false;
  public get enabled(): boolean { return this._enabled };
  public set enabled(enabled : boolean) {
    this._enabled = enabled;
    enabled === true ? this.onEnabled() : this.onDisable(); 
  }

  private _awaked: boolean = false;
  public get awaked() : boolean { return this._awaked }
  
  private _started: boolean = false;
  public get started() : boolean { return this._started }

  public constructor(name?: string, transform?: Transform) {
    super();
    
    this.id = crypto.randomUUID();
    this.name = name ?? this.constructor.name;
    this.transform = transform ?? new Transform();
  }

  public awake(): void {
    if(this._awaked) return
    this._awaked = true;
  }

  public start(): void {
    if(this._started) return
    this._started = true;
  }

  public update(deltaTime: number): void {}
  public fixedUpdate(deltaTime: number): void {}
  
  public lateUpdate(deltaTime: number): void {}
  
  protected onEnabled(): void {}

  protected onDisable(): void {}

  public serialize(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      enabled: this.enabled,
      transform: this.transform,
    };
  }
}