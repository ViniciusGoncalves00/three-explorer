import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Transform extends Component {
  public constructor(
    public position: Vector3 = Vector3.zero(),
    public rotation: Vector3 = Vector3.zero(),
    public scale: Vector3 = Vector3.one()
  ) {
    super();
  }

  public clone(): Component {
    const clonedPosition = new Vector3(this.position.x, this.position.y, this.position.z);
    const clonedRotation = new Vector3(this.rotation.x, this.rotation.y, this.rotation.z);
    const clonedScale = new Vector3(this.scale.x, this.scale.y, this.scale.z);
    const clone = new Transform(clonedPosition, clonedRotation, clonedScale);
    clone.enabled = this.enabled;
    return clone;
  }
}