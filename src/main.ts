import './styles.css';
import './ui/styles/time-controller.css';

import { Engine } from './core/engine/engine';
import { TimeControllerHandler } from './ui/elements/controls/time-controller-handler';
import { Console } from './ui/elements/console/console';
import { RotateSystem } from './assets/systems/rotateSystem';
import { OrbitSystem } from './assets/systems/orbitSystem';
import { EntityHandler } from './ui/handlers/entity-handler';
import { Hierarchy } from './ui/elements/hierarchy/hierarchy';
import { Inspector } from './ui/elements/inspector/inspector';
import { Tree } from './ui/components/assets/tree';
import { FolderNode } from './common/tree/folder-node';
import { FileNode } from './common/tree/file-node';
import { ObjectBinder } from './graphics/threejs/object-binder';
import { ThreeEngine } from './graphics/threejs/three-engine';
import { LogType } from './core/api/enum/log-type';
import { Scenes } from './ui/elements/scenes/scenes';


window.addEventListener('DOMContentLoaded', () => {
    new Program();
});

export class Program {
    public readonly devMode: boolean;
    public engine!: Engine;
    public binder!: ObjectBinder;
    public threeEngine!: ThreeEngine;

    //#region [HTMLElements]
    public consoleContent!: HTMLElement;

    public viewportEditorContainer!: HTMLElement;
    public canvasEditor!: HTMLCanvasElement;

    public viewportSceneContainer!: HTMLElement;
    public canvasScene!: HTMLCanvasElement;

    public entitiesContainer!: HTMLElement;
    public inspectorContainer!: HTMLElement;
    public assetsContainer!: HTMLElement;
    public fpsContainer!: HTMLElement;
    public averageFpsContainer!: HTMLElement;

    public play!: HTMLButtonElement;
    public stop!: HTMLButtonElement;
    public pause!: HTMLButtonElement;
    public speedUp!: HTMLButtonElement;
    public speedNormal!: HTMLButtonElement;
    public speedDown!: HTMLButtonElement;
    //#endregion

    //#region [HTMLElements]
    private _console!: Console
    public get console(): Console { return this._console; }

    private _inspector!: Inspector;
    public get inspector(): Inspector { return this._console; }

    private _tree!: Tree;
    public get tree(): Tree { return this._tree; }

    private _hierarchy!: Hierarchy;
    public get hierarchy(): Hierarchy { return this._hierarchy; }

    private _controls!: TimeControllerHandler;
    public get controls(): TimeControllerHandler { return this._controls; }

    private _scenes!: Scenes;
    public get scenes(): Scenes { return this._scenes; }
    //#endregion

    public constructor(devMode: boolean = false) {
        this.devMode = devMode;

        this.initialize();
        this.initializeConsole();

        this._console.log(LogType.Log, "creating the best interface...")

        this.initializeInspector();
        this.initializeScene();

        this.fpsContainer = this.getElementOrFail<HTMLElement>('fpsContainer');
        this.averageFpsContainer = this.getElementOrFail<HTMLElement>('averageFpsContainer');

        this._console.log(LogType.Log, "loading your best assets...");
        this.initializeAssets();
        this.initializeControls();

        if (this.fpsContainer) this.engine.time.framesPerSecond.subscribe(() => this.fpsContainer.innerHTML = `${this.engine.time.framesPerSecond.value.toString()} FPS`);
        if (this.averageFpsContainer) this.engine.time.averageFramesPerSecond.subscribe(() => this.averageFpsContainer.innerHTML = `${this.engine.time.averageFramesPerSecond.value.toString()} avgFPS`);

        const entityHandler = new EntityHandler(this.engine, this.threeEngine, this.binder);
        this.initializeHierarchy();

        (window as any).addEntity = () => {
          entityHandler.addEntity();
        };

        this._console.log(LogType.Log, "All right! You can start now!")
    }

    private initialize(): void {
        this.engine = new Engine();
        this.binder = new ObjectBinder();
    }

    private initializeConsole(): void {
        this.consoleContent = this.getElementOrFail<HTMLElement>('consoleContent');
        this._console = new Console(this.consoleContent);

        this.engine.timeController.isRunning.subscribe((value => {
                const log = LogType.Log; value ? this.console.log(log, "Started.") : this.console.log(log, "Stoped.")
            }
        ))

        this.engine.timeController.isPaused.subscribe((value => {
                const log = LogType.Log;
                value ? this.console.log(log, "Paused.") : this.console.log(log, "Unpaused.")
            }
        ))

        const filterAll = this.getElementOrFail<HTMLElement>('filterAll');
        filterAll.addEventListener("click", () => this._console.filter(null))

        const filterLog = this.getElementOrFail<HTMLElement>('filterLog');
        filterLog.addEventListener("click", () => this._console.filter(LogType.Log))

        const filterSuccess = this.getElementOrFail<HTMLElement>('filterSuccess');
        filterSuccess.addEventListener("click", () => this._console.filter(LogType.Success))

        const filterWarning = this.getElementOrFail<HTMLElement>('filterWarning');
        filterWarning.addEventListener("click", () => this._console.filter(LogType.Warning))

        const filterError = this.getElementOrFail<HTMLElement>('filterError');
        filterError.addEventListener("click", () => this._console.filter(LogType.Error))
    };

    private initializeHierarchy(): void {
        this.entitiesContainer = this.getElementOrFail<HTMLElement>('entitiesContainer');
        this._hierarchy = new Hierarchy(this.entitiesContainer, this.engine.entityManager, entity => EntityHandler.selectedEntity.value = entity);
        this.engine.entityManager.entities.subscribe(value => this.hierarchy.renderHierarchy(value))
    };

    private initializeAssets(): void {
        this.assetsContainer = this.getElementOrFail<HTMLElement>('assetsContainer');
        this._tree = new Tree(this.assetsContainer);

        (async () => {
            const rootNode = await this.loadAssets();
            this._tree.addChild(rootNode);
        })();
    };
    private initializeInspector(): void {
        this.inspectorContainer = this.getElementOrFail<HTMLElement>('inspectorContainer');
        this._inspector = new Inspector(this.inspectorContainer);
    };

    private initializeControls(): void {
        // this.controlsContainer = this.getElementOrFail<HTMLElement>('inspectorContainer');
        this.play = this.getElementOrFail<HTMLButtonElement>('play');
        this.stop = this.getElementOrFail<HTMLButtonElement>('stop');
        this.pause = this.getElementOrFail<HTMLButtonElement>('pause');

        this.speedUp = this.getElementOrFail<HTMLButtonElement>('speedUp');
        this.speedNormal = this.getElementOrFail<HTMLButtonElement>('speedNormal');
        this.speedDown = this.getElementOrFail<HTMLButtonElement>('speedDown');

        this._controls = new TimeControllerHandler(this.engine.timeController, this.engine.time, this.play, this.stop, this.pause, this.speedUp, this.speedNormal, this.speedDown);
    };

    private initializeScene(): void {
        this.viewportEditorContainer = this.getElementOrFail<HTMLElement>('viewportEditorContainer');
        this.canvasEditor = this.getElementOrFail<HTMLCanvasElement>('canvasEditor');
        this.viewportSceneContainer = this.getElementOrFail<HTMLElement>('viewportSceneContainer');
        this.canvasScene = this.getElementOrFail<HTMLCanvasElement>('canvasScene');

        this.threeEngine = new ThreeEngine(this.engine, this.binder, this.viewportEditorContainer, this.canvasEditor, this.viewportSceneContainer, this.canvasScene);
        this._scenes = new Scenes(this.viewportEditorContainer,  this.viewportSceneContainer);
        this.engine.timeController.isRunning.subscribe(() => this._scenes.toggleHighlight())

        this.engine.registerSystem(new RotateSystem());
        this.engine.registerSystem(new OrbitSystem());
    };

    private initializeSettings(): void {};

    private getElementOrFail<T extends HTMLElement>(id: string): T {
        const element = document.getElementById(id);
        if (!element) {
            this._console.log(LogType.Error, `failed to load container: '${id}' -> ${element}`);
            throw new Error(`UI element '${id}' not found`);
        }
        return element as T;
    }

    private async loadAssets(): Promise<FolderNode | FileNode<any>> {
        const assetsJson = localStorage.getItem("assets");

        if (assetsJson) {
            this._console.log(LogType.Log, "loading assets from local storage...");
            try {
                const root = this.deserializeTree(JSON.parse(assetsJson));
                this._console.log(LogType.Success, "assets loaded successfully.");
                return root;
            } catch (e) {
                this._console.log(LogType.Warning, "failed to parse local assets. Fetching from remote...");
                return await this.fetchAndLoadAssetsFromRepo();
            }
        } else {
            this._console.log(LogType.Log, "there are no assets in local storage. Loading from remote...");
            return await this.fetchAndLoadAssetsFromRepo();
        }
    }

    private async fetchAndLoadAssetsFromRepo(): Promise<FolderNode | FileNode<any>> {
        try {
            const response = await fetch("dist/assets.json");
            const data = await response.json();

            const root = this.deserializeTree(data);
            localStorage.setItem("assets", JSON.stringify(data));
            this._console.log(LogType.Success, "assets loaded from remote and saved to localStorage.");
            return root;
        } catch (error) {
            this._console.log(LogType.Warning, "failed to fetch assets from remote.");
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