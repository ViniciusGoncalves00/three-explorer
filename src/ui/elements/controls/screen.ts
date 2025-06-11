export class Screen {
    private readonly fullScreen: HTMLElement;
    private readonly emptyScreen: HTMLElement;

    public constructor(fullScreen: HTMLButtonElement, emptyScreen: HTMLButtonElement) {
        this.fullScreen = fullScreen;
        this.emptyScreen = emptyScreen;
    }
}