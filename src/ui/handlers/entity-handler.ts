import * as THREE from 'three';
import { Transform } from "../../core/api/components/transform";
import { Entity } from "../../core/api/entity";
import { ObjectBinder } from "../../core/graphics/three/object-binder";
import { Engine } from '../../core/engine/engine';
import { ThreeEngine } from '../../core/graphics/three/three-engine';
import { ObservableField } from '../../core/patterns/observer/observable-field';

export class EntityHandler {
    private _engine: Engine;
    private _binder: ObjectBinder;
    private _graphicEngine: ThreeEngine;

    private static _selectedEntity: ObservableField<Entity> = new ObservableField(new Entity('0000-0000-0000-0000-0000'));
    public static get selectedEntity() : ObservableField<Entity> { return this._selectedEntity; }
    public static set selectedEntity(entity: ObservableField<Entity>) { this._selectedEntity = entity; }

    public constructor(engine: Engine, graphicEngine: ThreeEngine, binder: ObjectBinder) {
        this._engine = engine;
        this._graphicEngine = graphicEngine;
        this._binder = binder;
    }
    
    public addEntity(isRuntime: boolean): void {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 })
          );

        const cubeEntity = new Entity(crypto.randomUUID());
        cubeEntity.isRuntime = isRuntime;
        cubeEntity.addComponent(new Transform());
          
        this._binder.bind(cubeEntity, mesh);
        this._engine.entityManager.addEntity(cubeEntity);
        this._graphicEngine.scene.scene.add(mesh)
    }
}