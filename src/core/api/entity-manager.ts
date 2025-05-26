import { ObservableMap } from "../../common/patterns/observer/observable-map";
import { Entity } from "./entity";

export class EntityManager {
    public readonly entities: ObservableMap<string, Entity> = new ObservableMap(new Map<string, Entity>());
    public readonly backup: ObservableMap<string, Entity> = new ObservableMap(new Map<string, Entity>());
  
    public addEntity(entity: Entity): void {
      this.entities.set(entity.id, entity);
    }

    public removeEntity(entityId: string): void {
      this.entities.delete(entityId);
    }

    public getEntities(): Entity[] {
      return Array.from(this.entities.values());
    }    
  
    public saveState(): void {
      this.backup.clear();
      for (const [id, entity] of this.entities.entries()) {
        this.backup.set(id, entity.clone());
      }
    }
  
    public restoreState(): void {
      for (const [id, clone] of this.backup.entries()) {
        const entity = this.entities.get(id);
        if (!entity) continue;
  
        entity.restoreFrom(clone);
      }
    }
  }  