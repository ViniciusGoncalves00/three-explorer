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
import { LogType } from './core/api/enum/log-type';
import { Scenes } from './ui/elements/scenes/scenes';
import { IRenderer } from './graphics/IRenderer';
import { ThreeRenderer } from './graphics/adapters/threejs/three-renderer';
import { IRenderScene } from './graphics/IRenderScene';
import { ThreeScene } from './graphics/adapters/threejs/three-scene';


window.addEventListener('DOMContentLoaded', () => {
    new Program();
});

export class Program {
    public readonly devMode: boolean;
    public engine!: Engine;
    public binder!: ObjectBinder;
    // public threeEngine!: ThreeEngine;
    public rendererA!: IRenderer;
    public rendererB!: IRenderer;
    public scene!: IRenderScene;

    //#region [HTMLElements]
    public consoleContent!: HTMLElement;

    public viewportEditorContainer!: HTMLElement;
    public canvasA!: HTMLCanvasElement;

    public viewportSceneContainer!: HTMLElement;
    public canvasB!: HTMLCanvasElement;

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
    public get inspector(): Inspector { return this._inspector; }

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

        this.initializeEngine();
        this.initializeConsole();

        this._console.log(LogType.Log, "creating the best interface...")

        this.initializeInspector();
        this.initializeRenderer();

        this.fpsContainer = this.getElementOrFail<HTMLElement>('fpsContainer');
        this.averageFpsContainer = this.getElementOrFail<HTMLElement>('averageFpsContainer');

        this._console.log(LogType.Log, "loading your best assets...");
        this.initializeAssets();
        this.initializeControls();

        if (this.fpsContainer) this.engine.time.framesPerSecond.subscribe(() => this.fpsContainer.innerHTML = `${this.engine.time.framesPerSecond.value.toString()} FPS`);
        if (this.averageFpsContainer) this.engine.time.averageFramesPerSecond.subscribe(() => this.averageFpsContainer.innerHTML = `${this.engine.time.averageFramesPerSecond.value.toString()} avgFPS`);

        const entityHandler = new EntityHandler(this.engine, this.scene);
        this.initializeHierarchy();

        (window as any).addEntity = () => {
          entityHandler.addEntity();
        };

        this.initializeScene();

        this._console.log(LogType.Log, "All right! You can start now!")
    }

    private initializeEngine(): void {
        this.engine = new Engine();
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
        const filterLog = this.getElementOrFail<HTMLElement>('filterLog');
        const filterSuccess = this.getElementOrFail<HTMLElement>('filterSuccess');
        const filterWarning = this.getElementOrFail<HTMLElement>('filterWarning');
        const filterError = this.getElementOrFail<HTMLElement>('filterError');

        filterAll.addEventListener("click", () => this._console.filter(null))
        filterLog.addEventListener("click", () => this._console.filter(LogType.Log))
        filterSuccess.addEventListener("click", () => this._console.filter(LogType.Success))
        filterWarning.addEventListener("click", () => this._console.filter(LogType.Warning))
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
        this.play = this.getElementOrFail<HTMLButtonElement>('play');
        this.stop = this.getElementOrFail<HTMLButtonElement>('stop');
        this.pause = this.getElementOrFail<HTMLButtonElement>('pause');

        this.speedUp = this.getElementOrFail<HTMLButtonElement>('speedUp');
        this.speedNormal = this.getElementOrFail<HTMLButtonElement>('speedNormal');
        this.speedDown = this.getElementOrFail<HTMLButtonElement>('speedDown');

        this._controls = new TimeControllerHandler(this.engine.timeController, this.engine.time, this.play, this.stop, this.pause, this.speedUp, this.speedNormal, this.speedDown);
    };

    private initializeRenderer(): void {
        this.viewportEditorContainer = this.getElementOrFail<HTMLElement>('viewportEditorContainer');
        this.canvasA = this.getElementOrFail<HTMLCanvasElement>('canvasA');
        this.viewportSceneContainer = this.getElementOrFail<HTMLElement>('viewportSceneContainer');
        this.canvasB = this.getElementOrFail<HTMLCanvasElement>('canvasB');

        this.scene = new ThreeScene(this.engine, this.canvasA, this.canvasB);

        this.rendererA = new ThreeRenderer(this.canvasA, (this.scene as ThreeScene).cameraA);
        // this.rendererA.initialize(this.canvasA);
        const observerA = new ResizeObserver(() => this.rendererA.resize(this.canvasA.clientHeight, this.canvasA.clientWidth));
        observerA.observe(this.canvasA);        

        this.rendererB = new ThreeRenderer(this.canvasB, (this.scene as ThreeScene).cameraB);
        // this.rendererB.initialize(this.canvasB);
        const observerB = new ResizeObserver(() => this.rendererB.resize(this.canvasB.clientHeight, this.canvasB.clientWidth));
        observerB.observe(this.canvasB); 

        

        this._scenes = new Scenes(this.viewportEditorContainer,  this.viewportSceneContainer);
        this.engine.timeController.isRunning.subscribe(() => this._scenes.toggleHighlight())

        this.rendererA.render(this.scene);
        this.rendererB.render(this.scene);
    };

    private initializeScene(): void {
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