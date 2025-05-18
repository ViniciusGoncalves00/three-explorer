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
import { Hierarchy } from './ui/handlers/hierarchy';
import { Inspector } from './ui/handlers/inspector';


window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');
  const consoleContainer = document.getElementById('console-content');
  const entitiesContainer = document.getElementById('entities-container');
  const inspectorContainer = document.getElementById("inspector-container");
  const fpsContainer = document.getElementById("fps-container");

  if (!containerEditor || !canvasEditor || !containerSimulator || !canvasSimulator) return;

  const engine = new Engine()
  const binder = new ObjectBinder();
  const threeEngine = new ThreeEngine(engine, binder, containerEditor, canvasEditor, containerSimulator, canvasSimulator);

  engine.registerSystem(new RotateSystem());
  engine.registerSystem(new OrbitSystem());

  new TimeControllerHandler(document, engine.timeController);

  if (fpsContainer) engine.time.averageFramesPerSecond.subscribe(() => fpsContainer.innerHTML = `${engine.time.averageFramesPerSecond.value.toString()} FPS`);
  
  if (!consoleContainer) return;
  
  const consoleClass = new Console(consoleContainer);
  const consoleLogger = ConsoleLogger.getInstance();
  consoleLogger.attach(consoleClass);
  engine.timeController.attach(consoleLogger)

  if (!entitiesContainer) return;
  if (!inspectorContainer) return;


  const entityHandler = new EntityHandler(engine, threeEngine, binder);
  const inspector = new Inspector(inspectorContainer);
  const hierarchy = new Hierarchy(engine, entitiesContainer!, entity => EntityHandler.selectedEntity.value = entity);
  engine.entityManager.attach(hierarchy);

  (window as any).addEntity = (isRuntime: boolean) => {
    entityHandler.addEntity(isRuntime);
  };  
});