import { Orbit } from "../../assets/components/orbit";
import { Rotate } from "../../assets/components/rotate";
import { Transform } from "../../assets/components/transform";
import { Entity } from "../../core/api/entity";
import { Dropdown } from "../components/dropdown";
import { ComponentUI } from "../components/inspector/component-ui";
import { EntityHandler } from "./entity-handler";
import { Mesh } from "../../assets/components/mesh";
import { Component } from "../../assets/components/component";

export class Inspector {
  private static _container: HTMLElement;

  public constructor(container: HTMLElement) {
    Inspector._container = container;

    EntityHandler.selectedEntity.subscribe(() => {
      const entity = EntityHandler.selectedEntity?.value;
      if (entity) {
        entity.components.subscribe(() => Inspector.update());
      }
      Inspector.update();
  });
  }

  public static update() {
    this._container.replaceChildren();
    if (!EntityHandler.selectedEntity) return;

    const entityWrapper = this.buildEntity(EntityHandler.selectedEntity.value)
    this._container.appendChild(entityWrapper)

    EntityHandler.selectedEntity.value.getComponents().forEach((component: Component) => {
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
        { label: "Mesh", value: Mesh },
      ],
      defaultLabel: "Add Component",
      onSelect: (item) => {
        const ComponentClass = item.value;
        EntityHandler.selectedEntity?.value.addComponent(new ComponentClass());
      },
    });
    
    row.appendChild(dropdown.getElement());
  }

  private static buildEntity(entity: Entity): HTMLElement {
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
      inputColumn.checked = (EntityHandler.selectedEntity as any)[field];
      row.appendChild(inputColumn);
    });

    return entityWrapper;
  }
}