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
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full flex flex-col';
  
    const title = document.createElement('div');
    title.textContent = component.constructor.name;
    title.className = 'font-bold mb-2';
    wrapper.appendChild(title);
  
    const fieldsMap = new Map<string, HTMLInputElement[]>();
    this.bindings.set(component, fieldsMap);
  
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(component));
    for (const key of propertyNames) {
      if (key === 'enabled' || key.startsWith('_')) continue;
  
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(component), key);
      if (!descriptor?.get || typeof descriptor.get !== 'function') continue;
  
      const value = (component as any)[key];
      if (value instanceof Vector3) {
        // Cria a row principal
        const row = document.createElement('div');
        row.className = 'w-full flex items-center mb-1';
  
        // Coluna da esquerda com o nome da propriedade
        const labelCol = document.createElement('div');
        labelCol.className = 'w-1/4 font-medium text-sm';
        labelCol.textContent = key;
        row.appendChild(labelCol);
  
        // Coluna da direita com os inputs x, y, z
        const inputCol = document.createElement('div');
        inputCol.className = 'w-3/4 flex gap-1';
  
        const inputs: HTMLInputElement[] = [];
  
        for (const axis of ['x', 'y', 'z'] as const) {
          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'w-full text-xs px-1 py-0.5 border border-gray-300 rounded';
          input.value = value[axis].toString();
  
          input.addEventListener('input', () => {
            const x = parseFloat(inputs[0].value);
            const y = parseFloat(inputs[1].value);
            const z = parseFloat(inputs[2].value);
            (component as any)[key] = new Vector3(x, y, z);
          });
  
          inputs.push(input);
          inputCol.appendChild(input);
        }
  
        fieldsMap.set(key, inputs);
        row.appendChild(inputCol);
        wrapper.appendChild(row);
      }
    }
  
    return wrapper;
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
