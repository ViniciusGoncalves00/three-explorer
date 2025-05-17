import { ObservableField } from "../../core/patterns/observer/observable-field";

export class NumberField {
  private _container: HTMLDivElement;
  private _input: HTMLInputElement;

  constructor(field: ObservableField<number>) {
    this._container = document.createElement("div");

    this._input = document.createElement("input");
    this._input.type = "number";
    this._input.step = "0.1";
    this._input.className = "w-full text-xs px-1 py-0.5 border border-gray-300 rounded";

    field.subscribe(value => {
      this._input.value = value.toString();
    });

    this._input.oninput = () => {
      const parsed = parseFloat(this._input.value);
      if (!isNaN(parsed)) {
        field.value = parsed;
      }
    };

    this._container.appendChild(this._input);

    this._input.value = field.value.toString();
  }

  public getElement(): HTMLElement {
    return this._container;
  }
}
