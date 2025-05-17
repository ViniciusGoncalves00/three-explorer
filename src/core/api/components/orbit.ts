import { ObservableField } from "../../patterns/observer/observable-field";
import { Vector3 } from "../vector3";
import { Component } from "./component";

export class Orbit extends Component {
  private _center: Vector3;
  public get center(): Vector3 { return this._center; }
  public set center(value: Vector3) { this._center = value; this.notify(["center"]); }

  private _distance: ObservableField<number>;
  public get distance(): ObservableField<number> { return this._distance; }
  public set distance(value: ObservableField<number>) { this._distance = value; this.notify(["distance"]); }

  private _speed: ObservableField<number>;
  public get speed(): ObservableField<number> { return this._speed; }
  public set speed(value: ObservableField<number>) { this._speed = value; this.notify(["speed"]); }

  private _axis: Vector3;
  public get axis(): Vector3 { return this._axis; }
  public set axis(value: Vector3) { this._axis = value; this.notify(["axis"]); }

  public angle: ObservableField<number> = new ObservableField<number>(0);

  constructor(
    center: Vector3 = new Vector3(0, 0, 0),
    distance: ObservableField<number> = new ObservableField<number>(1),
    speed: ObservableField<number> = new ObservableField<number>(1),
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

  public copyFrom(orbit: Orbit): void {
      this._center.set(orbit.center.x.value, orbit.center.y.value, orbit.center.z.value);
      this._axis.set(orbit.axis.x.value, orbit.axis.y.value, orbit.axis.z.value);
      this._distance.value = orbit.distance.value;
      this._speed.value = orbit.speed.value;
  }
}