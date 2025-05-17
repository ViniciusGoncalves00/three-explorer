import { Component } from "../../core/api/components/component";
import { Vector3 } from "../../core/api/vector3";
import { EntityHandler } from "../handlers/entity-handler";
import { FieldBuilder } from "./field-builder";

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
        const head = this.head(body, component);
        
        this._container.appendChild(head);
        this._container.appendChild(body);
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

                for (const axis of ['x', 'y', 'z'] as const) {
                    const axisWrapper = document.createElement('div');
                    axisWrapper.className = "w-1/3 flex";

                    const axisName = document.createElement('div');
                    axisWrapper.appendChild(axisName);
                    axisName.textContent = axis;
                    axisName.className = 'w-6 flex-none text-center';

                    const input = FieldBuilder.numberField(field[axis])
                    inputColumn.appendChild(input);
                }
            }
            else if (typeof field.value === 'number') {
                const input = FieldBuilder.numberField(field)
                inputColumn.appendChild(input);
            }

            row.appendChild(inputColumn);
            componentBody.appendChild(row);
        }

        return componentBody;
    }

    private head(body: HTMLElement, component: Component): HTMLElement {
        const head = document.createElement("div");
        head.classList = "w-full h-6 flex items-center border-y border-zinc-600";

        const toggle = document.createElement('button');
        head.appendChild(toggle);
        toggle.className = "w-6 flex-none text-center cursor-pointer ";

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
        title.textContent = component.constructor.name;
        title.className = 'w-full font-bold';

        const exclude = document.createElement('i');
        head.appendChild(exclude);
        exclude.className = "w-6 flex-none text-center cursor-pointer bi bi-trash";
        exclude.addEventListener('click', () => EntityHandler.selectedEntity.value.removeComponent(component.constructor as any))

        const options = document.createElement('i');
        head.appendChild(options);
        options.className = "w-6 flex-none text-center cursor-pointer bi bi-three-dots-vertical";

        return head;
    }
}