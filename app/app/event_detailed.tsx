import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchData } from "./api_helper";


const TITLE_IMAGE_SECTION = "Image Section";
const DISPLAY_TITLE = "Podrobnosti Dogodka";



interface ParagraphProps {
    title: string;
    content: string;
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
    let eventFilesObject = await fetchData(`/events/${id}/files`);
    let eventFiles = eventFilesObject.files;
    let filesContent = eventFiles.map((file: any) => file.name).join(",\n");

    eventDetails.push({ title: "Opis", content: `${eventData.description}` });
    eventDetails.push({ title: "Podatki", content: `Dogodek se začne: ${eventData.start}. Dogodek bo koordiniral: ${eventData.coordinator}. \nIme dogodka: ${eventData.title}` });
    eventDetails.push({title: "Datoteke", content: `${filesContent}`});
    return eventDetails;
}
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



export function EventPage({ route }) {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState<ParagraphProps[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const details = await getEventDetails(eventId);
      setEventDetails(details);
    };
    fetchEventDetails();
  }, [eventId]);

  return (
    <View>
      <Text>Event id: {eventId}</Text>
      {displayEventDetails(eventDetails)}
    </View>
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
    }
    

});

export default EventPage;