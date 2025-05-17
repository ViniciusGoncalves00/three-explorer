import { Component } from "../../core/api/components/component";
import { Vector3 } from "../../core/api/vector3";
import { ObservableField } from "../../core/patterns/observer/observable-field";
import { NumberField } from "./number-field";

export class ComponentUI {
    private _container: HTMLElement;
    public get container(): HTMLElement { return this._container; };

    private _component: Component;
    private _open: boolean;
    public get open(): boolean { return this._open; }

    private bindings = new Map<Component, Map<string, HTMLInputElement[]>>();

    public constructor(component: Component, open: boolean = true) {
        this._component = component;
        this._open = open;

        this._container = document.createElement("div");

        const body = this.body(component);
        const head = this.head(body, component.constructor.name);
        
        this._container.appendChild(head);
        this._container.appendChild(body);
    }

    public update(): void {
        const bindings = this.bindings.get(this._component);
        if (!bindings) return;

        for (const [property, inputs] of bindings.entries()) {
            const value = (this._component as any)[property];

            if (value instanceof Vector3) {
                inputs[0].value = value.x.toString();
                inputs[1].value = value.y.toString();
                inputs[2].value = value.z.toString();
            } else if (typeof value === 'number') {
                inputs[0].value = value.toString();
            }
        }
    }

    private body(component: Component): HTMLElement {
        const componentBody = document.createElement('div');
        componentBody.className = 'w-full flex-none flex flex-col p-2 space-y-1';

        const fieldsMap = new Map<string, HTMLInputElement[]>();
        this.bindings.set(component, fieldsMap);

        const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(component));
        for (const property of propertyNames) {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(component), property);
            if (!descriptor?.get || typeof descriptor.get !== 'function') continue;

            const row = document.createElement('div');
            row.className = 'w-full flex items-center';

            const labelCol = document.createElement('div');
            labelCol.className = 'w-1/4 font-medium text-sm';
            labelCol.textContent = property;
            row.appendChild(labelCol);

            const inputColumn = document.createElement('div');
            inputColumn.className = 'w-3/4 flex';

            const field = (component as any)[property];

            if (field instanceof Vector3) {
                inputColumn.classList.add('gap-1');

                // const inputs: HTMLInputElement[] = [];

                for (const axis of ['x', 'y', 'z'] as const) {
                    const axisWrapper = document.createElement('div');
                    axisWrapper.className = "w-1/3 flex";

                    const axisName = document.createElement('div');
                    axisWrapper.appendChild(axisName);
                    axisName.textContent = axis;
                    axisName.className = 'w-6 flex-none text-center';

                    // const input = document.createElement('input');
                    // axisWrapper.appendChild(input);
                    // input.type = 'number';
                    // input.step = '0.1';
                    // input.className = 'w-full text-xs px-1 py-0.5 border border-gray-300 rounded';
                    // input.value = field[axis].toString();

                    const input = new NumberField(field[axis]);
                    inputColumn.appendChild(input.getElement());

                    // inputs.push(input);
                    // inputColumn.appendChild(axisWrapper);
                }

                // // Adiciona eventos após os elementos estarem prontos
                // inputs.forEach((input, index) => {
                //     input.addEventListener('input', () => {
                //         const x = parseFloat(inputs[0].value);
                //         const y = parseFloat(inputs[1].value);
                //         const z = parseFloat(inputs[2].value);
                //         (component as any)[property] = new Vector3(x, y, z);
                //     });
                // });

                // fieldsMap.set(property, inputs);
                row.appendChild(inputColumn);
                componentBody.appendChild(row);
            }
            else if (typeof field.value === 'number') {
                const input = new NumberField((field as ObservableField<number>));

                inputColumn.appendChild(input.getElement());
                row.appendChild(inputColumn);
                componentBody.appendChild(row);

                // const input = document.createElement('input');
                // input.type = 'number';
                // input.step = '0.1';
                // input.className = 'w-full text-xs px-1 py-0.5 border border-gray-300 rounded';
                // input.value = field.toString();

                // input.addEventListener('input', () => {
                //     const newValue = parseFloat(input.value);
                //     if (!isNaN(newValue)) {
                //         (component as any)[property] = newValue;
                //     }
                // });

                // inputColumn.appendChild(input);
                // fieldsMap.set(property, [input]);
                // row.appendChild(inputColumn);
                // componentBody.appendChild(row);
            }
        }

        return componentBody;
    }

    private head(body: HTMLElement, name: string): HTMLElement {
        const head = document.createElement("div");
        head.classList = "w-full h-6 flex items-center border-y border-zinc-600";

        const toggle = document.createElement('button');
        head.appendChild(toggle);
        toggle.className = "w-6 flex-none text-center";

        const toggleIcon = document.createElement('i');
        toggleIcon.className = "bi bi-caret-up-fill transition-transform duration-200";
        toggle.appendChild(toggleIcon);

        toggle.addEventListener('click', () => {
            const isHidden = body.classList.toggle('hidden');
            toggleIcon.classList.toggle('bi-caret-up-fill', !isHidden);
            toggleIcon.classList.toggle('bi-caret-down-fill', isHidden);
        });

        const title = document.createElement('p');
        head.appendChild(title);
        title.textContent = name;
        title.className = 'w-full font-bold';

        const options = document.createElement('i');
        head.appendChild(options);
        options.className = "w-6 flex-none text-center fa fa-ellipsis-vertical";

        return head;
    }
}