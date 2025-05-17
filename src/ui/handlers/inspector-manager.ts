import { Component } from "../../core/api/components/component";
import { Orbit } from "../../core/api/components/orbit";
import { Rotate } from "../../core/api/components/rotate";
import { Transform } from "../../core/api/components/transform";
import { Entity } from "../../core/api/entity";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";
import { Dropdown } from "../components/dropdown";
import { ComponentUI } from "../components/component-ui";
import { EntityHandler } from "./entity-handler";

export class InspectorManager implements IObserver {
  private _entityHandler: EntityHandler;
  private _container: HTMLElement;

  private _components: Map<string, ComponentUI>

  // private bindings = new Map<Component, Map<string, HTMLInputElement[]>>();

  constructor(container: HTMLElement, entityHandler: EntityHandler) {
    this._container = container;
    this._entityHandler = entityHandler;
    this._components = new Map<string, ComponentUI>();
  }

  public onNotify(subject: ISubject, args?: string[]): void {
    if(!args) return;
    
    if(args[0] === "changed entity") {
      this.updateInspector();
      return;
    }

    const componentName = (subject as Component).constructor.name;
    const component = this._components.get(componentName)
    if(!component) return;

    component.update();
  }

  private updateInspector() {
    this._container.replaceChildren();
    // this.bindings.clear();

    if (!this._entityHandler.selectedEntity) return;

    const entityWrapper = this.buildEntity(this._entityHandler.selectedEntity)
    this._container.appendChild(entityWrapper)

    this._entityHandler.selectedEntity.getComponents().forEach(component => {
      component.attach(this);
      const componentUI = new ComponentUI(component).container;
      this._container.appendChild(componentUI);
    });

    const row = document.createElement('div');
    row.className = 'w-full flex items-center justify-center';
    this._container.appendChild(row);

    const dropdown = new Dropdown({
      items: [
        { label: "Transform", value: Transform },
        { label: "Rotate", value: Rotate },
        { label: "Orbit", value: Orbit },
      ],
      defaultLabel: "Add Component",
      onSelect: (item) => {
        const ComponentClass = item.value;
        this._entityHandler.selectedEntity?.addComponent(new ComponentClass());
        this.updateInspector();
      },
    });
    
    row.appendChild(dropdown.getElement());
  }

  private buildEntity(entity: Entity): HTMLElement {
    const entityWrapper = document.createElement('div');
    entityWrapper.className = 'w-full flex flex-col';

    const titleRow = document.createElement('div');
    entityWrapper.appendChild(titleRow);
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
    title.textContent = entity.name;
    title.className = 'w-full font-bold';

    const options = document.createElement('i');
    titleRow.appendChild(options)
    options.className = "w-6 flex-none text-center fa fa-ellipsis-vertical"

    const body = document.createElement('div');
    entityWrapper.appendChild(body);
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
    inputColumn.textContent = entity.id;
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

    return entityWrapper;
  }
}