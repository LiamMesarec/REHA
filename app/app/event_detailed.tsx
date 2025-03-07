import { Text, View, StyleSheet } from "react-native";
import React from "react";


const TITLE_IMAGE_SECTION = "Image Section";
const DISPLAY_TITLE = "Event Details";



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

function getEventDetails(): ParagraphProps[] {
    let eventDetails: ParagraphProps[] = [];
    eventDetails.push({ title: "Event Description", content: "The event consists of 3 parts: the introduction, yoga and lunch. Please prepaire some sports clothes!!" });
    eventDetails.push({ title: "Event Date and Location", content: "21.3.2025, FZSV" });
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

export function displayEventDetails(id: number) {
    let eventDetails: ParagraphProps[] = getEventDetails();
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

  return (
    <View>
      <Text>Event id: {eventId}</Text>
      {displayEventDetails(eventId)}
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
