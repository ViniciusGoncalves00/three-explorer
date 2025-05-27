import { ObservableField } from "../../common/patterns/observer/observable-field";
import { ObservableList } from "../../common/patterns/observer/observable-list";
import { Vector3 } from "../../core/api/vector3";
import { Component } from "./component";

export class Mesh extends Component {
    private readonly _name: ObservableField<string>;
    public get name(): ObservableField<string> { return this._name; }

    private readonly _vertices: ObservableList<Vector3>;
    public get vertices(): ObservableList<Vector3> { return this._vertices; }
    
    private readonly _indices: ObservableList<ObservableField<number>>;
    public get indices(): ObservableList<ObservableField<number>> { return this._indices; }

  constructor(
    name = "name",
    vertices = [new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0)],
    indices = [new ObservableField(0), new ObservableField(1), new ObservableField(2)]
  ) {
    super();
    this._name = new ObservableField(name);
    this._vertices = new ObservableList(vertices);
    this._indices = new ObservableList(indices);
  }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    public copyFrom(component: Component): void {
        throw new Error("Method not implemented.");
    }
    public destroy(): void {}
}