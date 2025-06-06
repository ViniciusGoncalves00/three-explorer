import * as THREE from 'three';
import { Transform } from "../../assets/components/transform";
import { Entity } from "../../core/api/entity";
import { Engine } from '../../core/engine/engine';
import { ThreeEngine } from '../../graphics/threejs/three-engine';
import { ObjectBinder } from '../../graphics/threejs/object-binder';
import { ObservableField } from '../../common/patterns/observer/observable-field';
import { Vector3 } from '../../core/api/vector3';
import { Mesh } from '../../assets/components/mesh';
import { ObservableNullableField } from '../../common/patterns/observer/observable-nullable-field';

export class EntityHandler {
    private _engine: Engine;
    private _binder: ObjectBinder;
    private _graphicEngine: ThreeEngine;

    private static _selectedEntity: ObservableNullableField<Entity> = new ObservableNullableField<Entity>(null);
    public static get selectedEntity() : ObservableNullableField<Entity> { return this._selectedEntity; }
    public static set selectedEntity(entity: ObservableNullableField<Entity>) { this._selectedEntity = entity; }

    public constructor(engine: Engine, graphicEngine: ThreeEngine, binder: ObjectBinder) {
        this._engine = engine;
        this._graphicEngine = graphicEngine;
        this._binder = binder;
    }
    
  public addEntity(): void {
    const geometry = new THREE.BufferGeometry();
    const sphereVertices = generateSphereVertices(1, 4, 4);

    const vertices = float32ArrayToVector3List(sphereVertices);
    const indices = createSequentialIndices(vertices.length);

    const meshComponent = new Mesh("Sphere", vertices, indices);

    bindMeshComponentToGeometry(meshComponent, geometry);

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );

    const entity = new Entity(crypto.randomUUID());
    entity.addComponent(new Transform());
    entity.addComponent(meshComponent);

    this._binder.bind(entity, mesh);
    this._engine.entityManager.addEntity(entity);
    this._graphicEngine.scene.scene.add(mesh);

    this._graphicEngine.scene.scene.add(new THREE.DirectionalLight())
  }
}

function generateSphereVertices(radius = 1, widthSegments = 16, heightSegments = 12) {
  const vertices = [];

  for (let y = 0; y < heightSegments; y++) {
    const v0 = y / heightSegments;
    const v1 = (y + 1) / heightSegments;

    const phi0 = v0 * Math.PI;
    const phi1 = v1 * Math.PI;

    for (let x = 0; x < widthSegments; x++) {
      const u0 = x / widthSegments;
      const u1 = (x + 1) / widthSegments;

      const theta0 = u0 * Math.PI * 2;
      const theta1 = u1 * Math.PI * 2;

      const p0 = sphericalToCartesian(radius, theta0, phi0);
      const p1 = sphericalToCartesian(radius, theta1, phi0);
      const p2 = sphericalToCartesian(radius, theta1, phi1);
      const p3 = sphericalToCartesian(radius, theta0, phi1);

      vertices.push(...p0, ...p1, ...p2);
      vertices.push(...p2, ...p3, ...p0);
    }
  }

  return new Float32Array(vertices);
}

function sphericalToCartesian(radius: number, theta: number, phi: number) {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function bindMeshComponentToGeometry(
  meshComponent: Mesh,
  geometry: THREE.BufferGeometry
): void {
  const vertices = meshComponent.vertices.items;
  const positionArray = new Float32Array(vertices.length * 3);

  vertices.forEach((vertex, i) => {
    positionArray[i * 3 + 0] = vertex.x.value;
    positionArray[i * 3 + 1] = vertex.y.value;
    positionArray[i * 3 + 2] = vertex.z.value;

    vertex.x.subscribe(() => {
      positionArray[i * 3] = vertex.x.value;
      geometry.attributes.position.needsUpdate = true;
    });

    vertex.y.subscribe(() => {
      positionArray[i * 3 + 1] = vertex.y.value;
      geometry.attributes.position.needsUpdate = true;
    });

    vertex.z.subscribe(() => {
      positionArray[i * 3 + 2] = vertex.z.value;
      geometry.attributes.position.needsUpdate = true;
    });
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  geometry.computeVertexNormals();
}

function createSequentialIndices(length: number): ObservableField<number>[] {
  const indices: ObservableField<number>[] = [];
  for (let i = 0; i < length; i++) {
    indices.push(new ObservableField(i));
  }
  return indices;
}

function float32ArrayToVector3List(array: Float32Array): Vector3[] {
  const result: Vector3[] = [];
  for (let i = 0; i < array.length; i += 3) {
    result.push(new Vector3(array[i], array[i + 1], array[i + 2]));
  }
  return result;
}
