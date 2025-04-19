import { Component } from "./component";
import { Vector3 } from "./vector3";

export class Rotate extends Component {
    public constructor(public axis: Vector3 = Vector3.zero(), public speed: number = 1) {
        super();
    }
}