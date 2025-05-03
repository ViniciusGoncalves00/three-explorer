import './styles.css';
import './ui/styles/time-controller.css';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';
import { Console } from './ui/handlers/console';
import { ConsoleLogger } from './core/api/console-logger';
import { RotateSystem } from './core/api/systems/rotateSystem';
import { OrbitSystem } from './core/api/systems/orbitSystem';
import { ObjectBinder } from './core/graphics/three/object-binder';
import { EntityHandler } from './ui/handlers/entity-handler';
import { HierarchyHandler } from './ui/handlers/hierarchy-handler';
import { InspectorManager } from './ui/handlers/inspector-manager';


window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');
  const consoleContainer = document.getElementById('console-content');
  const entitiesContainer = document.getElementById('entities-container');
  const inspectorContainer = document.getElementById("inspector-container");

  if (!containerEditor || !canvasEditor || !containerSimulator || !canvasSimulator) return;

  const engine = new Engine()
  const binder = new ObjectBinder();
  const threeEngine = new ThreeEngine(engine, binder, containerEditor, canvasEditor, containerSimulator, canvasSimulator);

  engine.registerSystem(new RotateSystem());
  engine.registerSystem(new OrbitSystem());

  new TimeControllerHandler(document, engine.timeController);
  
  if (!consoleContainer) return;
  
  const consoleClass = new Console(consoleContainer);
  ConsoleLogger.getInstance().attach(consoleClass);

  if (!entitiesContainer) return;
  if (!inspectorContainer) return;

  const entityHandler = new EntityHandler(engine, threeEngine, binder);
//   const hierarchyHandler = new HierarchyHandler(engine, entitiesContainer!, (entity) => {
//   inspectorContainer!.innerHTML = `
//     <h2>${entity.name ?? entity.id}</h2>
//     <p>Components: ${entity.getComponents().length}</p>
//     <p>ID: ${entity.id}</p>
//   `;
// });
  const inspectorManager = new InspectorManager(inspectorContainer);
  const hierarchyHandler = new HierarchyHandler(engine, entitiesContainer!, entity => inspectorManager.setEntity(entity));
  engine.entityManager.attach(hierarchyHandler);

  (window as any).addEntity = (isRuntime: boolean) => {
    entityHandler.addEntity(isRuntime);
  };  
});