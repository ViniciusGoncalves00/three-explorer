import { TreeNode } from "./tree-node";

export class FolderNode extends TreeNode {
    public children: TreeNode[];

    public constructor(name: string, parent: FolderNode | null = null) {
        super(name, parent);
        this.children = [];
    }

    public addChild(child: TreeNode) {
        child.parent = this;
        this.children.push(child);
    }

    public removeChild(child: TreeNode) {
        child.parent = null;
        const index = this.children.indexOf(child);
        const removedChildren = this.children.splice(index);
        return removedChildren[0];
    }

    public isFolder(): this is FolderNode {
        return true;
    }
}