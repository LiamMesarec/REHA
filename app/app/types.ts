import RootLayout from "./_layout";

export type RootStackParamList = {
    Map: undefined;
    Files: { mapNameBuffer: string }; 
    Calendar: undefined;
    EventPage: { eventId: number }; 
    EventForm: {eventId: number | null};
    WhitelistDash: undefined;
  };

export type FileNode = {
    name: string;
    type: number; //folder = 0, file = 1
    filePath : string;
    date : string;
    id : number;
    uuid : string;
    //parentName : string;
}

export type FilesystemElement = { //neuporabno se mi zdi
  name : string;
  path : string;
}

export default {RootLayout};