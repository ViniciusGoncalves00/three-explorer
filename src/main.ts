import './styles.css';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor');
  const containerRun = document.getElementById('viewport-run');
  if (containerEditor && containerRun) {
    const engine = new Engine()
    new ThreeEngine(engine, containerEditor, containerRun);
  }
});