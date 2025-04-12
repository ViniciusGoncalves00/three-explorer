import './styles.css';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor');
  const containerRun = document.getElementById('viewport-run');

  if (!containerEditor || !containerRun) return;

  const engine = new Engine()
  new ThreeEngine(engine, containerEditor, containerRun);

  new TimeControllerHandler(document, engine.timeController);
});