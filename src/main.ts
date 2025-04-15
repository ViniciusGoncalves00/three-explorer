import './styles.css';
import './ui/styles/time-controller.css';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';

let threeEngine: any;

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerRun = document.getElementById('viewport-run-container');
  const canvasRun = document.getElementById('viewport-run');

  if (!containerEditor || !canvasEditor || !containerRun || !canvasRun) return;

  const engine = new Engine()
  threeEngine = new ThreeEngine(engine, containerEditor, canvasEditor, containerRun, canvasRun);

  new TimeControllerHandler(document, engine.timeController);
});