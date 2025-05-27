import { Component } from "./component";
import { Vector3 } from "../../core/api/vector3";

export class Transform extends Component {
  private readonly _position: Vector3;
  public get position(): Vector3 { return this._position};

  private readonly _rotation: Vector3;
  public get rotation(): Vector3 { return this._rotation};

  private readonly _scale: Vector3;
  public get scale(): Vector3 { return this._scale};

  constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3) {
    super();
    
    this._position = position ?? Vector3.zero();
    this._rotation = rotation ?? Vector3.zero();
    this._scale = scale ?? Vector3.one();
  }

  public clone(): Component {
    const clonedPosition = new Vector3(this._position.x.value, this._position.y.value, this._position.z.value);
    const clonedRotation = new Vector3(this._rotation.x.value, this._rotation.y.value, this._rotation.z.value);
    const clonedScale = new Vector3(this._scale.x.value, this._scale.y.value, this._scale.z.value);
    const clone = new Transform(clonedPosition, clonedRotation, clonedScale);
    clone.enabled = this.enabled;
    return clone;
  }

  public copyFrom(transform: Transform): void {
      this._position.set(transform.position.x.value, transform.position.y.value, transform.position.z.value);
      this._rotation.set(transform.rotation.x.value, transform.rotation.y.value, transform.rotation.z.value);
      this._scale.set(transform.scale.x.value, transform.scale.y.value, transform.scale.z.value);
  }

  public destroy(): void {}
}