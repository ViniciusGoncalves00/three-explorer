import { Entity } from "./entity";

export class EntityManager {
    private entities: Map<string, Entity> = new Map();
    private backup: Map<string, Entity> = new Map();
  
    public addEntity(entity: Entity): void {
      this.entities.set(entity.id, entity);
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