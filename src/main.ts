import './styles.css';

import { ThreeEngine } from './core/graphics/three/three-engine';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('viewport-container');
  if (container) {
    new ThreeEngine(container);
  }
});
