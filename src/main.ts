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
    new Program();
});

export class Program {
    public readonly devMode: boolean;
    public readonly engine: Engine;
    public readonly binder: ObjectBinder;
    public readonly threeEngine: ThreeEngine;
    public readonly tree: Tree;

    //#region [HTMLElements]
    public readonly consoleContent: HTMLElement;

    public readonly viewportEditorContainer: HTMLElement;
    public readonly canvasEditor: HTMLCanvasElement;

    public readonly viewportSceneContainer: HTMLElement;
    public readonly canvasScene: HTMLCanvasElement;

    public readonly entitiesContainer: HTMLElement;
    public readonly inspectorContainer: HTMLElement;
    public readonly assetsContainer: HTMLElement;
    public readonly fpsContainer: HTMLElement;
    public readonly averageFpsContainer: HTMLElement;
    //#endregion

    private _consoleLogger: ConsoleLogger;


    public constructor(devMode: boolean = false) {
        this.devMode = devMode;
        this._consoleLogger = ConsoleLogger.getInstance();

        this._consoleLogger.log("creating the best interface...")

        this.consoleContent = this.getElementOrFail<HTMLElement>('consoleContent');
        const consoleClass = new Console(this.consoleContent);
        this._consoleLogger.attach(consoleClass);

        this.viewportEditorContainer = this.getElementOrFail<HTMLElement>('viewportEditorContainer');
        this.canvasEditor = this.getElementOrFail<HTMLCanvasElement>('canvasEditor');
        this.viewportSceneContainer = this.getElementOrFail<HTMLElement>('viewportSceneContainer');
        this.canvasScene = this.getElementOrFail<HTMLCanvasElement>('canvasScene');
        this.entitiesContainer = this.getElementOrFail<HTMLElement>('entitiesContainer');
        this.inspectorContainer = this.getElementOrFail<HTMLElement>('inspectorContainer');
        this.assetsContainer = this.getElementOrFail<HTMLElement>('assetsContainer');
        this.fpsContainer = this.getElementOrFail<HTMLElement>('fpsContainer');
        this.averageFpsContainer = this.getElementOrFail<HTMLElement>('averageFpsContainer');

        this._consoleLogger.log("loading your best assets...");
        this.tree = new Tree(this.assetsContainer);

        (async () => {
            const rootNode = await this.loadAssets();
            this.tree.addChild(rootNode);
        })();

        this.engine = new Engine();
        this.binder = new ObjectBinder();
        this.threeEngine = new ThreeEngine(this.engine, this.binder, this.viewportEditorContainer, this.canvasEditor, this.viewportSceneContainer, this.canvasScene);

        this.engine.registerSystem(new RotateSystem());
        this.engine.registerSystem(new OrbitSystem());

        new TimeControllerHandler(document, this.engine.timeController);

        if (this.fpsContainer) this.engine.time.framesPerSecond.subscribe(() => this.fpsContainer.innerHTML = `${this.engine.time.framesPerSecond.value.toString()} FPS`);
        if (this.averageFpsContainer) this.engine.time.averageFramesPerSecond.subscribe(() => this.averageFpsContainer.innerHTML = `${this.engine.time.averageFramesPerSecond.value.toString()} aFPS`);

        this.engine.timeController.attach(this._consoleLogger)

        const entityHandler = new EntityHandler(this.engine, this.threeEngine, this.binder);
        const inspector = new Inspector(this.inspectorContainer);
        const hierarchy = new Hierarchy(this.engine, this.entitiesContainer!, entity => EntityHandler.selectedEntity.value = entity);
        this.engine.entityManager.attach(hierarchy);

        (window as any).addEntity = (isRuntime: boolean) => {
          entityHandler.addEntity(isRuntime);
        };

        this._consoleLogger.log("All right! You can start now!")
    }

    private getElementOrFail<T extends HTMLElement>(id: string): T {
        const element = document.getElementById(id);
        if (!element) {
            this._consoleLogger.error(`failed to load container: '${id}' -> ${element}`);
            throw new Error(`UI element '${id}' not found`);
        }
        return element as T;
    }

    private async loadAssets(): Promise<FolderNode | FileNode<any>> {
        const assetsJson = localStorage.getItem("assets");

        if (assetsJson) {
            this._consoleLogger.log("loading assets from local storage...");
            try {
                const root = this.deserializeTree(JSON.parse(assetsJson));
                this._consoleLogger.log("assets loaded successfully.");
                return root;
            } catch (e) {
                this._consoleLogger.warn("failed to parse local assets. Fetching from remote...");
                return await this.fetchAndLoadAssetsFromRepo();
            }
        } else {
            this._consoleLogger.log("there are no assets in local storage. Loading from remote...");
            return await this.fetchAndLoadAssetsFromRepo();
        }
    }

    private async fetchAndLoadAssetsFromRepo(): Promise<FolderNode | FileNode<any>> {
        try {
            const response = await fetch("dist/assets.json");
            const data = await response.json();

            const root = this.deserializeTree(data);
            localStorage.setItem("assets", JSON.stringify(data));
            this._consoleLogger.log("assets loaded from remote and saved to localStorage.");
            return root;
        } catch (error) {
            this._consoleLogger.warn("failed to fetch assets from remote.");
            console.error(error);
            throw error;
        }
    }


    private deserializeTree(obj: any): FolderNode | FileNode<any> {
        if (!obj.children) return new FileNode(obj.name, obj.content);

        const folder = new FolderNode(obj.name);
        for (const child of obj.children) {
            const node = this.deserializeTree(child);
            folder.addChild(node);
        }
        return folder;
    }
}