import './styles.css';
import './ui/styles/time-controller.css';

import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/handlers/time-controller-handler';
import { Console } from './ui/handlers/console';
import { ConsoleLogger } from './core/api/console-logger';
import { RotateSystem } from './assets/systems/rotateSystem';
import { OrbitSystem } from './assets/systems/orbitSystem';
import { EntityHandler } from './ui/handlers/entity-handler';
import { Hierarchy } from './ui/handlers/hierarchy';
import { Inspector } from './ui/handlers/inspector';
import { Tree } from './ui/components/assets/tree';
import { FolderNode } from './common/tree/folder-node';
import { FileNode } from './common/tree/file-node';
import { TreeNode } from './common/tree/tree-node';
import { ObjectBinder } from './graphics/threejs/object-binder';
import { ThreeEngine } from './graphics/threejs/three-engine';


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

  const tree = new Tree(assetsContainer);
  fetch("/assets/fileTree.json")
  .then(res => res.json())
  .then(tree => {
    // montar árvore aqui
  });

  // initTree(assetsContainer)
  // const folder = new FolderNode("Folder 1");
  // folder.addChild(new FileNode<string>("File 1", ""))
  // folder.addChild(new FileNode<string>("File 2", ""))
  // folder.addChild(new FileNode<string>("File 3", ""))
  // const folder2 = new FolderNode("Folder 2");
  // folder2.addChild(new FileNode<string>("File 4", ""))
  // const folder3 = new FolderNode("Folder 3");
  // folder3.addChild(new FileNode<string>("File 5", ""))
  // folder.addChild(folder2)
  // folder.addChild(folder3)
  // assetsTree.addChild(folder)
});

    function buildFilePath(node: TreeNode): string {
        const parts: string[] = [];

        let current: TreeNode | null = node;
        while (current) {
            parts.unshift(current.name);
            current = current.parent;
        }

        return `/assets/${parts.join('/')}`;
    }

    async function initTree(container: HTMLElement) {
        const response = await fetch('src/common/index.json');
        const json = await response.json();

        const tree = new Tree(container);
        const rootFolder = await buildTreeFromJson(json);

        for (const child of rootFolder.children) {
            tree.addChild(child);
        }

        setupClickListeners(tree.rootNode);
    }

    function setupClickListeners(node: FolderNode) {
        for (const child of node.children) {
            if (child.isFolder()) {
                setupClickListeners(child as FolderNode);
            } else {
                const row = findRowElementForNode(child.name);
                if (row) {
                    row.classList.add("cursor-pointer", "hover:bg-gray-200");
                    row.addEventListener('click', async () => {
                        const fileNode = child as FileNode<any>;
                        if (!fileNode.content) {
                            const path = buildFilePath(fileNode);
                            const res = await fetch(path);
                            fileNode.content = await res.json();
                            console.log(`Conteúdo de ${fileNode.name}:`, fileNode.content);
                        }
                    });
                }
            }
        }
    }

    function findRowElementForNode(name: string): HTMLDivElement | null {
        const rows = document.querySelectorAll<HTMLDivElement>('div.w-full.h-5');
        return Array.from(rows).find(row => row.textContent === name) ?? null;
    }


     async function buildTreeFromJson(json: any, parent: FolderNode | null = null): Promise<FolderNode> {
        const folder = new FolderNode(json.name, parent);

        for (const child of json.children ?? []) {
            if (child.type === "folder") {
                const subfolder = await buildTreeFromJson(child, folder);
                folder.addChild(subfolder);
            } else if (child.type === "file") {
                const fileNode = new FileNode(child.name, null, folder);
                folder.addChild(fileNode);
            }
        }

        return folder;
    }