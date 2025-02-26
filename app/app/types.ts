export type RootStackParamList = {
    Map: undefined;
    Files: { mapNameBuffer: string }; 
  };

export type FileNode = {
    name: string;
    type: number; //folder = 0, file = 1
    filePath : string;
    //parentName : string;
}

export type FilesystemElement = {
  name : string;
  path : string;
}