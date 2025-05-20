import { FileNode } from "../../../common/tree/file-node";
import { FolderNode } from "../../../common/tree/folder-node";
import { TreeNode } from "../../../common/tree/tree-node";

export class Tree {
    private readonly _container: HTMLElement;
    public readonly rootNode: FolderNode;

    public constructor(container: HTMLElement) {
        this._container = container;
        this.rootNode = new FolderNode("assets", null)
    }

    public addChild(child: TreeNode): void {
        this.rootNode.addChild(child);

        if(child.isFolder()) {
            this.addFolder(child as FolderNode);
        }
        else {
            this.addFile(child as FileNode<any>);
        }
    }

    private addFolder(child: FolderNode): void {
        const row = document.createElement("div");
        row.className = "w-full h-5 flex items-center";
        
        const toggle = document.createElement('button');
        toggle.className = "w-6 flex-none text-center cursor-pointer";
        row.appendChild(toggle);
        
        const toggleIcon = document.createElement('i');
        toggleIcon.className = "bi bi-caret-right-fill transition-transform duration-200";
        toggle.appendChild(toggleIcon);
        
        const title = document.createElement("p");
        title.className = "w-full font-bold";
        title.textContent = child.name;
        row.appendChild(title);
        
        const childrenContainer = document.createElement("div");
        childrenContainer.className = "pl-4";
        childrenContainer.hidden = true;
        
        for (const grandChild of child.children) {
            if (grandChild.isFolder()) {
                this.addChildToContainer(grandChild as FolderNode, childrenContainer);
            } else {
                this.addChildToContainer(grandChild as FileNode<any>, childrenContainer);
            }
        }
    
        toggle.addEventListener('click', () => {
            childrenContainer.hidden = !childrenContainer.hidden;
            toggleIcon.classList.toggle('bi-caret-right-fill', childrenContainer.hidden);
            toggleIcon.classList.toggle('bi-caret-down-fill', !childrenContainer.hidden);
        });
    
        this._container.appendChild(row);
        this._container.appendChild(childrenContainer);
    }

    private addChildToContainer(child: TreeNode, container: HTMLElement): void {
        if (child.isFolder()) {
            const folder = document.createElement("div");
            const folderTree = new Tree(container);
            folderTree.addFolder(child as FolderNode);
        } else {
            const row = document.createElement("div");
            row.className = "w-full h-5";
            row.textContent = child.name;
            container.appendChild(row);
        }
    }
    
    private addFile(child: FileNode<any>): void {
        const row = document.createElement("div");
        row.className = "w-full h-5";
        row.textContent = child.name;
        this._container.appendChild(row);
    }
}