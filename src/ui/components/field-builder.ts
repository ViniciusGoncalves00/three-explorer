import { ObservableField } from "../../core/patterns/observer/observable-field";

export class FieldBuilder {
    public static numberField(observablefield: ObservableField<number>): HTMLElement {
        const field = document.createElement("input");
        field.type = "number";
        field.step = "0.1";
        field.className = "w-full text-xs px-1 py-0.5 border border-gray-300 rounded";

        observablefield.subscribe(value => field.value = value.toString());

        field.oninput = () => {
          const value = parseFloat(field.value);
          if (!isNaN(value)) {
            observablefield.value = value;
          }
        };

        field.value = observablefield.value.toString();
        return field;
    }
}