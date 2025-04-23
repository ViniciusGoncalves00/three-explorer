import './styles.css';
import './ui/styles/time-controller.css';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';
import { Console } from './ui/handlers/console';
import { ConsoleLogger } from './core/api/console-logger';

let threeEngine: ThreeEngine;

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');
  const consoleContainer = document.getElementById('console-content');

  if (!containerEditor || !canvasEditor || !containerSimulator || !canvasSimulator) return;

  const engine = new Engine()
  threeEngine = new ThreeEngine(engine, containerEditor, canvasEditor, containerSimulator, canvasSimulator);

  new TimeControllerHandler(document, engine.timeController);
  
  if (!consoleContainer) return;
  
  const consoleClass = new Console(consoleContainer);
  ConsoleLogger.getInstance().attach(consoleClass);
});