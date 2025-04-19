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
}