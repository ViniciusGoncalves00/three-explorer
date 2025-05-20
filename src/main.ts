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
import { Tree } from './ui/components/assets/tree';
import { FolderNode } from './common/tree/folder-node';
import { FileNode } from './common/tree/file-node';


window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');
  const consoleContainer = document.getElementById('console-content');
  const entitiesContainer = document.getElementById('entities-container');
  const inspectorContainer = document.getElementById("inspector-container");
  const assetsContainer = document.getElementById("assets-container");
  const fpsContainer = document.getElementById("fps-container");
  const averageFpsContainer = document.getElementById("average-fps-container");

  if (!containerEditor || !canvasEditor || !containerSimulator || !canvasSimulator) return;

  const engine = new Engine()
  const binder = new ObjectBinder();
  const threeEngine = new ThreeEngine(engine, binder, containerEditor, canvasEditor, containerSimulator, canvasSimulator);

  engine.registerSystem(new RotateSystem());
  engine.registerSystem(new OrbitSystem());

  new TimeControllerHandler(document, engine.timeController);

  if (fpsContainer) engine.time.framesPerSecond.subscribe(() => fpsContainer.innerHTML = `${engine.time.framesPerSecond.value.toString()} FPS`);
  if (averageFpsContainer) engine.time.averageFramesPerSecond.subscribe(() => averageFpsContainer.innerHTML = `${engine.time.averageFramesPerSecond.value.toString()} aFPS`);
  
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

  if (!assetsContainer) return;

  const assetsTree = new Tree(assetsContainer);
  const folder = new FolderNode("Folder 1");
  folder.addChild(new FileNode<string>("File 1", ""))
  folder.addChild(new FileNode<string>("File 2", ""))
  folder.addChild(new FileNode<string>("File 3", ""))
  const folder2 = new FolderNode("Folder 2");
  folder2.addChild(new FileNode<string>("File 4", ""))
  const folder3 = new FolderNode("Folder 3");
  folder3.addChild(new FileNode<string>("File 5", ""))
  folder.addChild(folder2)
  folder.addChild(folder3)
  assetsTree.addChild(folder)
});