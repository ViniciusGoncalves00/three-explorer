import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Rotate extends Component {
  public constructor(public axis: Vector3 = Vector3.zero(), public speed: number = 1) {
    super();
  }

  public clone(): Component {
    const clonedAxis = new Vector3(this.axis.x, this.axis.y, this.axis.z);
    const clone = new Rotate(clonedAxis, this.speed);
    clone.enabled = this.enabled;
    return clone;
  }
}