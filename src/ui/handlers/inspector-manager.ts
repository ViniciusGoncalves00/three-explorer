import { Component } from "../../core/api/components/component";
import { Vector3 } from "../../core/api/components/vector3";
import { Entity } from "../../core/api/entity";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";

export class InspectorManager implements IObserver {
  private currentEntity: Entity | null = null;
  private container: HTMLElement;

  private bindings = new Map<Component, Map<string, HTMLInputElement[]>>();

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public setEntity(entity: Entity | null) {
    if (this.currentEntity)
        this.currentEntity.getComponents().forEach(component => component.dettach(this))

    this.currentEntity = entity;
    this.updateInspector();
  }

  private updateInspector() {
    this.container.replaceChildren();
    this.bindings.clear();

    if (!this.currentEntity) return;

    this.currentEntity.getComponents().forEach(component => {
      component.attach(this);
      const componentUI = this.buildComponentUI(component);
      this.container.appendChild(componentUI);
    })
  }

  private buildComponentUI(component: Component): HTMLElement {
    const componentWrapper = document.createElement('div');
    componentWrapper.className = 'w-full flex flex-col';
  
    const titleRow = document.createElement('div');
    componentWrapper.appendChild(titleRow);
    titleRow.className = "w-full h-6 flex items-center border-y border-zinc-600"

    const visibilityToggle = document.createElement('button');
    titleRow.appendChild(visibilityToggle);
    visibilityToggle.className = "w-6 flex-none text-center";

    const visibilityToggleIcon = document.createElement('i');
    visibilityToggleIcon.className = "fa fa-chevron-up transition-transform duration-200";
    visibilityToggle.appendChild(visibilityToggleIcon);

    visibilityToggle.addEventListener('click', () => {
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
    body.className = 'w-full flex flex-col p-2 space-y-1';
  
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

  public onNotify(subject: ISubject, args?: string[]): void {
    const component = subject as Component;
    const fieldMap = this.bindings.get(component);
    if (!fieldMap || !args) return;

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
}
