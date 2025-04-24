import { IObserver } from "../patterns/observer/observer";
import { ObserverManager } from "../patterns/observer/observer-manager";
import { ISubject } from "../patterns/observer/subject";
import { Entity } from "./entity";

export class EntityManager implements ISubject {
    private observerManager = new ObserverManager();

    public attach = this.observerManager.attach.bind(this.observerManager);
    public dettach = this.observerManager.dettach.bind(this.observerManager);
    public notify = this.observerManager.notify.bind(this.observerManager);

    private entities: Map<string, Entity> = new Map();
    private backup: Map<string, Entity> = new Map();
  
    public addEntity(entity: Entity): void {
      this.entities.set(entity.id, entity);
      this.notify(["added"]);
    }

    public removeEntity(entityId: string): void {
      this.entities.delete(entityId);
      this.notify(["removed"]);
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