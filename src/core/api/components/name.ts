import { Component } from "./component";

export class Name extends Component {
  public constructor(public name: string) {
    super();
  }

  public clone(): Component {
    const clone = new Name(this.name);
    clone.enabled = this.enabled;
    return clone;
  }
}