import { Component } from "./component";

/**
* Abstract base class for lights.
*/
export abstract class Light extends Component {
    private _color: string;
    private _intensity: number = 1.0;

    /**
    * @param color Light color (default: "0xffffff")
    * @param intensity Light intensity (default: 1.0)
    */
    public constructor(color: string = "0xffffff", intensity: number = 1.0) {
        super();

        this._color = color;
        this._intensity = intensity;
    }
}