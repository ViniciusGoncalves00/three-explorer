import { ObservableMap } from "../../common/patterns/observer/observable-map";
import { Entity } from "./entity";

export class EntityManager {
    public readonly entities: ObservableMap<string, Entity> = new ObservableMap(new Map<string, Entity>());
    public readonly backup: ObservableMap<string, Entity> = new ObservableMap(new Map<string, Entity>());
  
    public addEntity(entity: Entity): void {
      this.entities.set(entity.id, entity);
    }

    public removeEntity(entityId: string): void {
      const entity = this.entities.get(entityId);
      if(!entity) return;

      this.entities.delete(entityId);
    }

    public getEntities(): Entity[] {
      return Array.from(this.entities.values());
    }    
  
    public saveEntities(): void {
      this.backup.clear();
      for (const [id, entity] of this.entities.entries()) {
        this.backup.set(id, entity.clone());
      }
    }
  
public restoreEntities(): void {
  for (const [id, clone] of this.backup.entries()) {
    const currentEntity = this.entities.get(id);

    if (currentEntity) {
      currentEntity.restoreFrom(clone);
    } else {
      this.addEntity(clone);
    }
  }

  for (const id of this.entities.keys()) {
    if (!this.backup.has(id)) {
        this.removeEntity(id)
      }
    }
  }
}