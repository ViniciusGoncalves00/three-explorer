import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Orbit extends Component {
  private _center: Vector3;
  public get center(): Vector3 { return this._center; }
  public set center(value: Vector3) { this._center = value; this.notify(["center"]); }

  private _distance: number;
  public get distance(): number { return this._distance; }
  public set distance(value: number) { this._distance = value; this.notify(["distance"]); }

  private _speed: number;
  public get speed(): number { return this._speed; }
  public set speed(value: number) { this._speed = value; this.notify(["speed"]); }

  private _axis: Vector3;
  public get axis(): Vector3 { return this._axis; }
  public set axis(value: Vector3) { this._axis = value; this.notify(["axis"]); }

  public angle: number = 0;

  constructor(
    center: Vector3 = new Vector3(0, 0, 0),
    distance: number = 1,
    speed: number = 1,
    axis: Vector3 = new Vector3(0, 1, 0)
  ) {
    super();
    this._center = center;
    this._distance = distance;
    this._speed = speed;
    this._axis = axis;
  }

  public clone(): Component {
    const clone = new Orbit(
      this._center.clone(),
      this._distance,
      this._speed,
      this._axis.clone()
    );
    clone.angle = this.angle;
    clone.enabled = this.enabled;
    return clone;
  }
}