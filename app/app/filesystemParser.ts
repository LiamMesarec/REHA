import TreeModel from 'tree-model';
import { FileNode } from './types';

export class Filesystem {
  FileSistem: TreeModel;
  root: any;

  constructor(value: string) {
    this.FileSistem = new TreeModel();
    this.root = this.FileSistem.parse({ name: 'root', index: -1 });
  }

  addPath(path: string) {
    const pathArray = path.split("\\");
    let treePointer = this.root;
//
    for (let i = 0; i < pathArray.length; i++) {
      const currentPathPart = pathArray[i];

      let childNode = treePointer.children.find((child: { model: FileNode }) => child.model.name === currentPathPart);

      if (childNode) {
        treePointer = childNode;
      } else {
        let newChild = this.FileSistem.parse({
            name: currentPathPart,
            type : (i === pathArray.length - 1) ? 1 : 0
          });
        treePointer.addChild(newChild);

        newChild.model = newChild.model as FileNode;

        treePointer = newChild;
      }
    }
  }

  getChildrenByName(name: string): FileNode[] | null {
    console.log("NAMEE:  ", name);
    const node = this.findNodeByName(name);
    if (node) {
      return node.children.map((child: { model: FileNode }) => child.model);
    }
    return []; 
  }

  private findNodeByName(name: string): any {
    let nodesToVisit: any[] = [this.root];

    while (nodesToVisit.length > 0) {
      const currentNode = nodesToVisit.pop();
      if (currentNode.model.name === name) {
        return currentNode;
      }
      nodesToVisit.push(...currentNode.children);
    }

    return null;
  }
}
