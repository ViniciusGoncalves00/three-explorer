import { IObserver } from "../../common/patterns/observer/observer";
import { ISubject } from "../../common/patterns/observer/subject";
import { SubjectManager } from "../../common/patterns/observer/subject-manager";
import { Entity } from "./entity";

export class EntityManager implements ISubject {
    private _subjectManager = new SubjectManager();

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

    public attach(observer: IObserver): void {
        this._subjectManager.attach(this, observer);
    }

    public dettach(observer: IObserver): void {
        this._subjectManager.dettach(this, observer);
    }

    public notify(args?: string[]): void {
        this._subjectManager.notify(this, args);
    }
  }  