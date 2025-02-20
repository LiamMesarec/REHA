import { Text, View } from "react-native";
import React from "react";

interface DayEventProps {
    event: string;
    day: string;
    dayNum: number;
    month?: string;
    year?: number;
}

const getDayOfWeekName = (day: Date): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day.getDay()];
}

export const DayEvent = (props: DayEventProps) => {
    const { event, day, dayNum, month, year } = props;
    return (
    <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', borderBottomColor: 'black',
        borderBottomWidth: 1, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'column', width: '30%', justifyContent: 'space-between' }}>
        
        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{day}</Text>
        <Text style={{ textAlign: 'left'}}>{dayNum}</Text>
        </View>
        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{event}</Text>
        
    </View>
    );
};

const eventNames: string[] = [
    "Yoga", "Meeting", "Workshop", "Conference", "Webinar", "Training", "Seminar", "Lecture", "Class", "Session",
    "Appointment", "Gathering", "Celebration", "Party", "Festival", "Concert", "Exhibition", "Fair", "Show", "Tournament"
];
export const getEvents = (): DayEventProps[] => {
    let events: DayEventProps[] = [];
    for (let i = 0; i < 20; i++) {
        let date:Date = new Date(2025, 2, i);
        events.push({
            event: eventNames[i],
            day: getDayOfWeekName(date),
            dayNum: i,
            month: "February",
            year: 2025
        });
    }
    return events;
};

export const renderEditingTexts = () => {
    const events = getEvents();
    return events.map((event, index) => (
        <DayEvent key={index} {...event} />
    ));
};