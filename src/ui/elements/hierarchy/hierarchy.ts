import { Entity } from "../../../core/api/entity";

export class Hierarchy {
    private _entitiesContainer: HTMLElement;

    private _onSelectEntity: (entity: Entity) => void;

    public constructor(entitiesContainer: HTMLElement, onSelectEntity: (entity: Entity) => void) {
        this._entitiesContainer = entitiesContainer;
        this._onSelectEntity = onSelectEntity;
    }

    public renderHierarchy(entities: Map<string, Entity>): void {
        this._entitiesContainer.innerHTML = "";
            
        entities.forEach(entity => {
            const entityName = entity.name ?? entity.id;
          
            const entityLine = document.createElement("div");
            entityLine.classList.add("entity", "w-full", "h-6", "flex", "items-center", "justify-between", "px-2");
          
            const leftContainer = document.createElement("div");
            leftContainer.classList.add("h-full", "w-full", "flex", "items-center", "space-x-2");
          
            const caretIcon = document.createElement("i");
            caretIcon.classList.add("h-full", "flex", "items-center", "justify-center", "bi", "bi-caret-down-fill");
          
            const boxIcon = document.createElement("i");
            boxIcon.classList.add("h-full", "flex", "items-center", "justify-center", "bi", "bi-box");
          
            const nameParagraph = document.createElement("p");
            nameParagraph.classList.add("w-full", "whitespace-nowrap", "overflow-ellipsis");
            nameParagraph.textContent = entityName;
          
            leftContainer.appendChild(caretIcon);
            leftContainer.appendChild(boxIcon);
            leftContainer.appendChild(nameParagraph);
          
            const dotsIcon = document.createElement("i");
            dotsIcon.classList.add("h-full", "flex", "items-center", "justify-center", "bi", "bi-three-dots-vertical");
          
            entityLine.appendChild(leftContainer);
            entityLine.appendChild(dotsIcon);

            entityLine.addEventListener("click", () => {
                this.selectEntity(entity);
              });              
          
            this._entitiesContainer.appendChild(entityLine);
          });
      }

    private selectEntity(entity: Entity) {
      this._onSelectEntity(entity);
      this.highlightEntityLine(entity.id);
    }

    private highlightEntityLine(selectedId: string) {
      const allLines = this._entitiesContainer.querySelectorAll(".entity");
      allLines.forEach(line => line.classList.remove("bg-zinc-800"));
    
      const selectedLine = Array.from(allLines).find(line =>
        line.textContent?.includes(selectedId)
      );
    
      if (selectedLine) {
        selectedLine.classList.add("bg-zinc-800");
      }
    }
}