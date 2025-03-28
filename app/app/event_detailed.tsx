import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { deleteEventById, fetchAndOpenFile, fetchData } from "./api_helper";
import { Link, router, useLocalSearchParams } from "expo-router";
import alert from "./alert";


const TITLE_IMAGE_SECTION = "Image Section";
const DISPLAY_TITLE = "Podrobnosti Dogodka";



interface ParagraphProps {
    title: string;
    content: string;
}

interface BtnProps {
    id: string
}

interface ImageSectionProps {
    images: {
    uri: string;
    width: number;
    height: number;
    }[];

}

async function getEventDetails(id: number): Promise<ParagraphProps[]> {
    let eventDetails: ParagraphProps[] = [];
    let eventDataObject = await fetchData(`/events/${id}`);
    let eventData = eventDataObject.event;
 -

    eventDetails.push({ title: "Opis", content: `${eventData.description}` });
    eventDetails.push({ title: "Podatki", content: `Dogodek se začne: ${eventData.start}. Dogodek bo koordiniral: ${eventData.coordinator}. \nIme dogodka: ${eventData.title}` });
    return eventDetails;
}


const FilesParagraph = ({ id }: { id: number }) => {
  const [eventFiles, setEventFiles] = useState<{ uuid: string; name: string }[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
        try{
      const eventFilesObject = await fetchData(`/events/${id}/files`);
      setEventFiles(eventFilesObject.files);
    }catch (error){
        console.log("No response 4 files 4 specific events");
    }
      
    };
    fetchFiles();
  }, [id]);

  return (
    <View>
      <Text style={styles.title}>Datoteke</Text>
      {eventFiles.map((file, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => fetchAndOpenFile(file.uuid, file.name)}
        >
          <Text style={styles.content}>{file.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
/* 
function getImages(): ImageSectionProps[] {
    let images: [
    {imageUri: "https://legacy.reactjs.org/logo-og.png", width: 100, height: 100},
    {imageUri: "https://usmuni.com/double-trip-sidewalk-snowplow/", width: 1280, height: 721}
    ];
    return {images}; 
}*/

export const Paragraph = (props: ParagraphProps) => {
    return (
    <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.content}>{props.content}</Text>
    </View>
    );
}



export const ImageSection = (props: ImageSectionProps) => {
    return (
        <View>
            <Text style = {styles.title}>{TITLE_IMAGE_SECTION}</Text>
        
        </View>
    );

};

export function displayEventDetails(eventDetails: ParagraphProps[]) {
    //let eventDetails:  = await getEventDetails(id);
    //let imageSectionProps: ImageSectionProps = getImages();
    return (
        <View>
            <Text style={styles.eventTitle}>{DISPLAY_TITLE}</Text>
            {eventDetails.map((eventDetail, index) => {
                return <Paragraph key={index} title={eventDetail.title} content={eventDetail.content} />;
            })}
            
        </View>
    );
}

export const DeleteEventButton = (props: BtnProps) => {
    return (
        <TouchableOpacity onPress={()=> {
            try{
            alert("Brisanje", "Želiš izbrisati dogodek?", [{ text: 'Da', onPress: () => {
                deleteEventById(Number(props.id));
                alert("Brisanje","Znebil si se dogodka");
                // should use back (if only used in event detailed), but this causes the calendar to be updated
                router.push("/calendar");
            } }, { text: 'Ne', onPress: () => {} }])
            
            
            } catch(_error){
                alert("Brisanje","Brisanje dogodka ni uspelo");
            }
            }} >
            <Text  style={styles.deleteBtn}>Izbriši dogodek</Text>
        </TouchableOpacity>
    );
};


export function EventPage() {
    const { eventId } = useLocalSearchParams();
    const [eventDetails, setEventDetails] = useState<ParagraphProps[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const details = await getEventDetails(eventId);
      setEventDetails(details);
    };
    fetchEventDetails();
    }, [eventId]);


  return (
    <ScrollView>
      <Text>Event id: {eventId}</Text>
      {displayEventDetails(eventDetails)}
      <FilesParagraph id = {Number(eventId)}/>
      <Link href={`/eventForm?eventId=${eventId}`} style={styles.editLink}>
            <Text>Spremeni dogodek</Text>
        </Link>
        <DeleteEventButton id={Array.isArray(eventId) ? eventId[0] : eventId}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    eventTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15
    },
    content: {
        fontSize: 15,
        marginBottom: 15
    },
    editLink: {
        backgroundColor: "grey",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom:25 
    },
    deleteBtn: {
        backgroundColor: "red",
        fontWeight: "bold",
        fontSize: 20,
        width: "auto"
    }
    

});

export default EventPage;