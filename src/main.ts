import './styles.css';
import './ui/styles/time-controller.css';
import * as THREE from 'three';

import { ThreeEngine } from './core/graphics/three/three-engine';
import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';

import { Transform } from './core/api/components/transform';
import { Entity } from './core/api/entity';
import { ObjectBinder } from './core/graphics/three/object-binder';
import { Rotate } from './core/api/components/rotate';

let threeEngine: ThreeEngine;

window.addEventListener('DOMContentLoaded', () => {
  const containerEditor = document.getElementById('viewport-editor-container');
  const canvasEditor = document.getElementById('viewport-editor');
  const containerSimulator = document.getElementById('viewport-simulator-container');
  const canvasSimulator = document.getElementById('viewport-simulator');

  if (!containerEditor || !canvasEditor || !containerSimulator || !canvasSimulator) return;

  const engine = new Engine()
  threeEngine = new ThreeEngine(engine, containerEditor, canvasEditor, containerSimulator, canvasSimulator);

  new TimeControllerHandler(document, engine.timeController);
});