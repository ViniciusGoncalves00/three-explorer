import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Transform extends Component {
  private _position: Vector3;
  public get position(): Vector3 { return this._position};
  public set position(position: Vector3) { this._position = position; this.notify(["position"])};

  private _rotation: Vector3;
  public get rotation(): Vector3 { return this._rotation};
  public set rotation(rotation: Vector3) { this._rotation = rotation; this.notify(["rotation"])};

  private _scale: Vector3;
  public get scale(): Vector3 { return this._scale};
  public set scale(scale: Vector3) { this._scale = scale; this.notify(["scale"])};

  constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3) {
    super();
    
    this._position = position ?? Vector3.zero();
    this._rotation = rotation ?? Vector3.zero();
    this._scale = scale ?? Vector3.one();

    this._position.onChange(() => this.notify(['position']));
    this._rotation.onChange(() => this.notify(['rotation']));
    this._scale.onChange(() => this.notify(['scale']));
  }

  public clone(): Component {
    const clonedPosition = new Vector3(this._position.x, this._position.y, this._position.z);
    const clonedRotation = new Vector3(this._rotation.x, this._rotation.y, this._rotation.z);
    const clonedScale = new Vector3(this._scale.x, this._scale.y, this._scale.z);
    const clone = new Transform(clonedPosition, clonedRotation, clonedScale);
    clone.enabled = this.enabled;
    return clone;
  }
}