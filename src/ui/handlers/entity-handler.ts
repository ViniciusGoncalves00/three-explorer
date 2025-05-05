import * as THREE from 'three';
import { Orbit } from "../../core/api/components/orbit";
import { Rotate } from "../../core/api/components/rotate";
import { Transform } from "../../core/api/components/transform";
import { Vector3 } from "../../core/api/components/vector3";
import { Entity } from "../../core/api/entity";
import { ObjectBinder } from "../../core/graphics/three/object-binder";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";
import { Engine } from '../../core/engine/engine';
import { ThreeEngine } from '../../core/graphics/three/three-engine';
import { SubjectManager } from '../../core/patterns/observer/subject-manager';

export class EntityHandler implements IObserver, ISubject {
    private _subjectManager = new SubjectManager();

    private _engine: Engine;
    private _binder: ObjectBinder;
    private _graphicEngine: ThreeEngine;

    private _selectedEntity: Entity | null = null;
    public get selectedEntity() : Entity | null { return this._selectedEntity; }
    public set selectedEntity(entity: Entity | null) { this._selectedEntity = entity; }
    

    public constructor(engine: Engine, graphicEngine: ThreeEngine, binder: ObjectBinder) {
        this._engine = engine;
        this._graphicEngine = graphicEngine;
        this._binder = binder;
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

    public onNotify(subject: ISubject, args?: string[]) {
        throw new Error('Method not implemented.');
    }
    
    public addEntity(isRuntime: boolean): void {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 })
          );

        const cubeEntity = new Entity(crypto.randomUUID());
        cubeEntity.isRuntime = isRuntime;
        cubeEntity.addComponent(new Transform());
        cubeEntity.addComponent(new Rotate());
        cubeEntity.addComponent(new Orbit(Vector3.zero(), 5));
          
        this._binder.bind(cubeEntity, mesh);
        this._engine.entityManager.addEntity(cubeEntity);
        this._graphicEngine.scene.scene.add(mesh)
    }
}