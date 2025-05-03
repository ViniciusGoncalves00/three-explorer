import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Rotate extends Component {
  private _axis: Vector3;
  public get axis(): Vector3 { return this._axis; }
  public set axis(axis: Vector3) { this._axis = axis; this.notify(["axis"]); }

  private _speed: number;
  public get speed(): number { return this._speed; }
  public set speed(speed: number) { this._speed = speed; this.notify(["speed"]); }

  constructor(axis: Vector3 = new Vector3(0, 1, 0), speed: number = 1) {
    super();
    this._axis = axis;
    this._speed = speed;
  }

  public clone(): Component {
    const clonedAxis = new Vector3(this._axis.x, this._axis.y, this._axis.z);
    const clone = new Rotate(clonedAxis, this._speed);
    clone.enabled = this.enabled;
    return clone;
  }
}