import './styles.css';

import { ThreeEngine } from './core/graphics/three/three-engine';

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor');
  const containerRun = document.getElementById('viewport-run');
  if (containerEditor && containerRun) {
    new ThreeEngine(containerEditor, containerRun);
  }
});
