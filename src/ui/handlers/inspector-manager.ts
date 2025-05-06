import { Component } from "../../core/api/components/component";
import { Vector3 } from "../../core/api/components/vector3";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";
import { EntityHandler } from "./entity-handler";

export class InspectorManager implements IObserver {
  private _entityHandler: EntityHandler;
  private _container: HTMLElement;

  private bindings = new Map<Component, Map<string, HTMLInputElement[]>>();

  constructor(container: HTMLElement, entityHandler: EntityHandler) {
    this._container = container;
    this._entityHandler = entityHandler;
  }

  public onNotify(subject: ISubject, args?: string[]): void {
    if(!args) return;
    
    if(args[0] === "changed entity") {
      this.updateInspector();
      return;
    }

    const component = subject as Component;
    const fieldMap = this.bindings.get(component);
    if (!fieldMap) return;

    for (const key of args) {
      const inputs = fieldMap.get(key);
      const value = (component as any)[key];

      if (inputs && value instanceof Vector3) {
        inputs[0].value = value.x.toString();
        inputs[1].value = value.y.toString();
        inputs[2].value = value.z.toString();
      }
    }
  }

  private updateInspector() {
    this._container.replaceChildren();
    this.bindings.clear();

    if (!this._entityHandler.selectedEntity) return;

    // const entityWrapper = document.createElement('div');
    // entityWrapper.className = 'w-full flex flex-col';
    // this._container.appendChild(entityWrapper);

    // const entityName = document.createElement('div');
    // entityName.textContent = this._entityHandler.selectedEntity.name;
    // entityName.className = 'w-full font-bold';
    // entityWrapper.appendChild(entityName);

    const componentWrapper = document.createElement('div');
    componentWrapper.className = 'w-full flex flex-col';
    this._container.appendChild(componentWrapper)
  
    const titleRow = document.createElement('div');
    componentWrapper.appendChild(titleRow);
    titleRow.className = "w-full h-6 flex items-center border-y border-zinc-600"

    const collapseToggle = document.createElement('button');
    titleRow.appendChild(collapseToggle);
    collapseToggle.className = "w-6 flex-none text-center";

    const visibilityToggleIcon = document.createElement('i');
    visibilityToggleIcon.className = "fa fa-chevron-up transition-transform duration-200";
    collapseToggle.appendChild(visibilityToggleIcon);

    collapseToggle.addEventListener('click', () => {
      const isHidden = body.classList.toggle('hidden');
    
      visibilityToggleIcon.classList.toggle('fa-chevron-up', !isHidden);
      visibilityToggleIcon.classList.toggle('fa-chevron-down', isHidden);
    });

    const title = document.createElement('p');
    titleRow.appendChild(title)
    title.textContent = this._entityHandler.selectedEntity.name;
    title.className = 'w-full font-bold';

    const options = document.createElement('i');
    titleRow.appendChild(options)
    options.className = "w-6 flex-none text-center fa fa-ellipsis-vertical"

    const body = document.createElement('div');
    componentWrapper.appendChild(body);
    body.className = 'w-full flex flex-col p-2 space-y-1';

    const row_id = document.createElement('div');
    row_id.className = 'w-full flex items-center';
    body.appendChild(row_id)

    const labelColumn = document.createElement('div');
    labelColumn.className = 'w-1/4 font-medium text-sm';
    labelColumn.textContent = "id";
    row_id.appendChild(labelColumn);
    
    const inputColumn = document.createElement('div');
    inputColumn.className = 'w-3/4 flex';
    inputColumn.textContent = this._entityHandler.selectedEntity.id;
    row_id.appendChild(inputColumn);

    const readonlyFields = ["isEnabled", "isAwaked", "isStarted", "isRuntime"]

    readonlyFields.forEach(field => {
      const row = document.createElement('div');
      row.className = 'w-full flex items-center';
      body.appendChild(row)

      const labelColumn = document.createElement('div');
      labelColumn.className = 'w-1/4 font-medium text-sm';
      labelColumn.textContent = field;
      row.appendChild(labelColumn);
      
      const inputColumn = document.createElement('input');
      inputColumn.className = 'w-3/4 flex';
      inputColumn.type = "checkbox"
      inputColumn.disabled = true;
      inputColumn.checked = (this._entityHandler.selectedEntity as any)[field];
      row.appendChild(inputColumn);
    });

    this._entityHandler.selectedEntity.getComponents().forEach(component => {
      component.attach(this);
      const componentUI = this.buildComponentUI(component);
      this._container.appendChild(componentUI);
    });

    const row = document.createElement('div');
    row.className = 'w-full flex items-center justify-center';
    this._container.appendChild(row);

    const addComponent = document.createElement('button');
    addComponent.className = 'bg-zinc-500';
    addComponent.textContent = "Add Component";
    row.appendChild(addComponent);
  }

  private buildComponentUI(component: Component): HTMLElement {
    const componentWrapper = document.createElement('div');
    componentWrapper.className = 'w-full flex flex-col';
  
    const titleRow = document.createElement('div');
    componentWrapper.appendChild(titleRow);
    titleRow.className = "w-full h-6 flex items-center border-y border-zinc-600"

    const collapseToggle = document.createElement('button');
    titleRow.appendChild(collapseToggle);
    collapseToggle.className = "w-6 flex-none text-center";

    const visibilityToggleIcon = document.createElement('i');
    visibilityToggleIcon.className = "fa fa-chevron-up transition-transform duration-200";
    collapseToggle.appendChild(visibilityToggleIcon);

    collapseToggle.addEventListener('click', () => {
      const isHidden = body.classList.toggle('hidden');
    
      visibilityToggleIcon.classList.toggle('fa-chevron-up', !isHidden);
      visibilityToggleIcon.classList.toggle('fa-chevron-down', isHidden);
    });

    const title = document.createElement('p');
    titleRow.appendChild(title)
    title.textContent = component.constructor.name;
    title.className = 'w-full font-bold';

    const options = document.createElement('i');
    titleRow.appendChild(options)
    options.className = "w-6 flex-none text-center fa fa-ellipsis-vertical"

    const body = document.createElement('div');
    componentWrapper.appendChild(body);
    body.className = 'w-full flex-none flex flex-col p-2 space-y-1';
  
    const fieldsMap = new Map<string, HTMLInputElement[]>();
    this.bindings.set(component, fieldsMap);
  
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(component));
    for (const property of propertyNames) {
      // if (key === 'enabled' || key.startsWith('_')) continue;
  
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(component), property);
      if (!descriptor?.get || typeof descriptor.get !== 'function') continue;
  
      // Row
      const row = document.createElement('div');
      row.className = 'w-full flex items-center';

      // Left
      const labelCol = document.createElement('div');
      labelCol.className = 'w-1/4 font-medium text-sm';
      labelCol.textContent = property;
      row.appendChild(labelCol);

      // Right
      const inputColumn = document.createElement('div');
      inputColumn.className = 'w-3/4 flex';

      const field = (component as any)[property];
      if (field instanceof Vector3) {
        inputColumn.className = inputColumn.className.concat(' gap-1');

        const inputs: HTMLInputElement[] = [];
  
        for (const axis of ['x', 'y', 'z'] as const) {
          const axisWrapper = document.createElement('div');
          axisWrapper.className = "w-1/3 flex"

          const axisName = document.createElement('div');
          axisWrapper.appendChild(axisName);
          axisName.textContent = axis;
          axisName.className = 'w-6 flex-none text-center';
          
          const input = document.createElement('input');
          axisWrapper.appendChild(input);
          input.type = 'number';
          input.step = '0.01';
          input.className = 'w-full text-xs px-1 py-0.5 border border-gray-300 rounded';
          input.value = field[axis].toString();
  
          input.addEventListener('input', () => {
            const x = parseFloat(inputs[0].value);
            const y = parseFloat(inputs[1].value);
            const z = parseFloat(inputs[2].value);
            (component as any)[property] = new Vector3(x, y, z);
          });
  
          inputs.push(input);
          inputColumn.appendChild(axisWrapper);
        }
  
        fieldsMap.set(property, inputs);
        row.appendChild(inputColumn);
        body.appendChild(row);
      }
      else if (typeof field === 'number') {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = '0.01';
        input.className = 'w-full text-xs px-1 py-0.5 border border-gray-300 rounded';
        input.value = field.toString();
      
        input.addEventListener('input', () => {
          const newValue = parseFloat(input.value);
          if (!isNaN(newValue)) {
            (component as any)[property] = newValue;
          }
        });
      
        inputColumn.appendChild(input);
        fieldsMap.set(property, [input]);
        row.appendChild(inputColumn);
        body.appendChild(row);
      }
      
    }
  
    return componentWrapper;
  }

  private input_number(value: any): string {
    return ``
  }

  private vector3ToInput(component: any, key: string, vector: Vector3, fieldMap: Map<string, HTMLInputElement[]>): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex gap-2 mb-1';
  
    const inputs: HTMLInputElement[] = [];
  
    (['x', 'y', 'z'] as const).forEach(axis => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = vector[axis].toString();
      input.className = 'w-1/3 p-1 border rounded';
  
      input.addEventListener('input', () => {
        const newVector = vector.clone();
        vector.setAxis(axis, parseFloat(input.value));
        component[key] = newVector;
      });
  
      container.appendChild(input);
      inputs.push(input);
    });
  
    fieldMap.set(key, inputs);
    return container;
  }  
}
