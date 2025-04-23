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


window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');
  const consoleContainer = document.getElementById('console-content');

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

  const entityHandler = new EntityHandler(engine, threeEngine, binder);
  // entityHandler.AddTestEntity();

  (window as any).AddTestEntity = () => {
    entityHandler.AddTestEntity();
  };  
});