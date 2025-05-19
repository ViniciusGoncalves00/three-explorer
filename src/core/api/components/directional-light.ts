import { Vector3 } from "../vector3";
import { Component } from "./component";
import { Light } from "./light";

export class DirectionalLight extends Light {
    private readonly _direction: Vector3;
    public get direction(): Vector3 { return this._direction; }

    public constructor(color: string = "0xffffff", intensity: number = 1.0, direction: Vector3 = new Vector3(0, 0, 0)) {
        super(color, intensity);

        this._direction = direction;
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    public copyFrom(component: Component): void {
        throw new Error("Method not implemented.");
    }
}