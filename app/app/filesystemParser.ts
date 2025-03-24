import TreeModel from 'tree-model';
import { FileNode } from './types';

export class Filesystem {
  FileSistem: TreeModel;
  root: any;

  constructor() {
    this.FileSistem = new TreeModel();
    this.root = this.FileSistem.parse({ name: 'files', type: -1, filePath : 'files' });
  }

  addPath(path: string, id : number , uuid : string, date : string = "") {
    const pathArray = path.split("/");
    let treePointer = this.root;
    console.log("PATH ARRAY:", pathArray);
    for (let i = 0; i < pathArray.length; i++) {
        const currentPathPart = pathArray[i];

        let childNode = treePointer.children.find((child: { model: { name: string; }; }) => child.model.name === currentPathPart);
        console.log("CHILD:", childNode)
        if (childNode) {
            treePointer = childNode;
        } else {
            let newChild = this.FileSistem.parse({
                name: currentPathPart,
                type: (i === pathArray.length - 1) ? 1 : 0,
                filePath : pathArray.slice(0, i + 1).join("/"),
                date : date,
                id : id,
                uuid : uuid
                //parentName: treePointer.model.name,
            });

            treePointer.addChild(newChild);
            treePointer = newChild;
            console.log("CHILD:", newChild)
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

  findNodeByName(name: string): any {
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

  findNodesByName(name: string): any[] {
    let nodesToVisit: any[] = [this.root];
    let matchingNodes: any[] = [];
  
    while (nodesToVisit.length > 0) {
      const currentNode = nodesToVisit.pop();
      
      if (currentNode.model.name.toLowerCase().includes(name.toLowerCase())) {
        matchingNodes.push(currentNode);
      }
  
      nodesToVisit.push(...currentNode.children);
    }
  
    return matchingNodes;
  }

  /*findNodeByPath(path : string) : any {
    let nodesToVisit: any[] = [this.root];
    while (nodesToVisit.length > 0){
      let currentNode = nodesToVisit.pop();
      if(currentNode.model.filePath === path){
        return currentNode;
      }
      nodesToVisit.push(...currentNode.children);
    }
  }*/
  findNodeByPath(path: string): any {
    let current = this.root;
    const pathArray = path.split("/");
    for (let i = 0; i < pathArray.length; i++) {
        let found = false;
        for (let child of current.children) {
          const childPathArray = child.model.filePath.split("/");
            if (childPathArray[i] === pathArray[i]) {
                current = child;
                found = true;
                break;
            }
        }

        if (!found) {
            return null;
        }
    }

    return current;
}

  getChildrenByPath(path: string): FileNode[] | null {
    //console.log("NAMEE:  ", name);
    const node = this.findNodeByPath(path);
    if (node) {
      return node.children.map((child: { model: FileNode }) => child.model);
    }
    return []; 
  }
}
