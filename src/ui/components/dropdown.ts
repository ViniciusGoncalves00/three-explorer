type DropdownItem = {
  label: string;
  value: any;
};

type DropdownOptions = {
  items: DropdownItem[];
  defaultLabel?: string;
  onSelect?: (item: DropdownItem) => void;
};

/**
* Represents a reusable Dropdown component.
* 
* Displays a list of options that can be selected, triggering an external action.
* 
* @param items - List of items for the dropdown.
* @param defaultLabel - Default text displayed on the button. Use this when you want a fixed text on the button. If none exists, the text displayed will be the first in the list of items, and will be replaced when an item is selected.
* @param onSelect - Function called when selecting an item.
*/
export class Dropdown {
    private items: DropdownItem[];

    private container: HTMLElement;
    private button: HTMLButtonElement;
    private menu: HTMLUListElement;
    private isOpen = false;
    private selectedItem: DropdownItem | null = null;
    private defaultLabel: string | undefined;
    private onSelect?: (item: DropdownItem) => void;

    constructor({ items, defaultLabel, onSelect }: DropdownOptions) {
        this.items = items.slice();
        this.defaultLabel = defaultLabel;
        this.onSelect = onSelect;

        this.sortItems();

        this.container = document.createElement("div");
        this.container.classList = "inline-block relative"

        this.button = document.createElement("button");
        this.button.textContent = this.defaultLabel ? this.defaultLabel : items[0].label;
        this.button.classList = "w-full bg-zinc-700 text-white px-2 py-1 rounded truncate hover:bg-zinc-600 cursor-pointer";
        this.button.onclick = () => this.toggle();

        this.menu = document.createElement("ul");
        this.menu.classList = "absolute left-0 top-full mt-1 bg-zinc-700 text-white text-sm rounded z-50";
        this.menu.style.display = "none";

        this.renderItems();

        this.container.appendChild(this.button);
        // this.container.appendChild(this.menu);
        document.body.appendChild(this.menu);
    }

    public getElement(): HTMLElement {
        return this.container;
    }

    public getSelectedItem(): DropdownItem | null {
        return this.selectedItem;
    }

    public setItems(items: DropdownItem[]) {
        this.items = items.slice();
        this.sortItems();
        this.renderItems();
    }

    public addItem(item: DropdownItem): void {
        this.items.push(item);
        this.sortItems();
        this.renderItems();
    }

    public removeItemByValue(value: any): void {
        this.items = this.items.filter(item => item.value !== value);
        this.sortItems();
        this.renderItems();
    }

    private sortItems() {
        this.items.sort((a, b) => a.label.localeCompare(b.label));
    }

    private renderItems() {
        this.menu.innerHTML = "";
        this.items.forEach(item => {
            const li = document.createElement("li");
            li.classList = "px-4 py-2 text-center hover:bg-zinc-600 cursor-pointer truncate overflow-hidden whitespace-nowrap";
            li.textContent = item.label;
            li.onclick = () => this.selectItem(item);
            this.menu.appendChild(li);
        });
    }

    private selectItem(item: DropdownItem) {
        this.selectedItem = item;
        this.button.textContent = this.defaultLabel ? this.defaultLabel : item.label;
        this.toggle(false);
        if (this.onSelect) {
            this.onSelect(item);
        }
    }

    private toggle(state?: boolean) {
        this.isOpen = typeof state === "boolean" ? state : !this.isOpen;
        if (this.isOpen) {
            const rect = this.button.getBoundingClientRect();
            this.menu.style.position = "absolute";
            this.menu.style.left = `${rect.left}px`;
            this.menu.style.top = `${rect.bottom + window.scrollY}px`;
            this.menu.style.width = `${rect.width}px`;
            this.menu.style.zIndex = "9999";
            this.menu.style.display = "block";
        } else {
            this.menu.style.display = "none";
        }
    }
}