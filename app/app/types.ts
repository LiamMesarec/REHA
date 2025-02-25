export type RootStackParamList = {
    Map: undefined;
    Files: { mapNameBuffer: string }; 
  };

export type FileNode = {
    name: string;
    type: number;
    filePath : string;
    //parentName : string;
}

export type FilesystemElement = {
  name : string;
  path : string;
}