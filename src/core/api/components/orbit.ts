import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Orbit extends Component {
  public angle: number = 0;

  public constructor(
    public center: Vector3 = new Vector3(0, 0, 0),
    public distance: number = 1,
    public speed: number = 1,
    public axis: Vector3 = new Vector3(0, 1, 0)
  ) {
    super();
  }

  public clone(): Component {
    const clonedCenter = this.center.clone();
    const clonedAxis = this.axis.clone();
    const clone = new Orbit(clonedCenter, this.distance, this.speed, clonedAxis);
    clone.angle = this.angle;
    clone.enabled = this.enabled;
    return clone;
  }
}
