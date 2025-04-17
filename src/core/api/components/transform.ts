import { Vector3 } from "../vector3";
import { Component } from "./component";

export class Transform extends Component {
  public position: Vector3;
  public rotation: Vector3;
  public scale: Vector3;

  public constructor(
    position: Vector3 = new Vector3(0, 0, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    scale: Vector3 = new Vector3(1, 1, 1),
  ) {
    super();

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  public clone(): Transform {
    return new Transform(
      this.position,
      this.rotation,
      this.scale,
    );
  }

  public copyFrom(transform: Transform): void {
    this.position = transform.position;
    this.rotation = transform.rotation;
    this.scale = transform.scale;
  }
}
