import { ObservableField } from "../../common/patterns/observer/observable-field";
import { Vector3 } from "../../core/api/vector3";
import { Component } from "./component";

export class Mesh extends Component {
    private readonly _name: ObservableField<string>;
    public get name(): ObservableField<string> { return this._name; }

    private readonly _vertices: Vector3[];
    public get vertices(): Vector3[] { return this._vertices; }

    private readonly _indices: ObservableField<number>[];
    public get indices(): ObservableField<number>[] { return this._indices; }

    constructor(vertices: Vector3[] = [new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0)], indices: ObservableField<number>[] = [new ObservableField<number>(0), new ObservableField<number>(1), new ObservableField<number>(2)]) {
      super();
    
      this._name = new ObservableField("TEST MESH NAME");
      this._vertices = vertices;
      this._indices = indices;
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    public copyFrom(component: Component): void {
        throw new Error("Method not implemented.");
    }
    public destroy(): void {}
}