import { Text, View } from "react-native";
import React from "react";


const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayEventProps {
    event: string;
    day: string;
    dayNum: number;
    month?: string;
    year?: number;
}

const getDayOfWeekName = (day: Date): string => {
    return days[day.getDay()];
}


export const DayEvent = (props: DayEventProps) => {
    const { event, day, dayNum, month, year } = props;
    return (
    <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', borderBottomColor: 'black',
        borderBottomWidth: 1, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'column', width: 'auto', justifyContent: 'space-between' }}>
        
        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{day}</Text>
        <Text style={{ textAlign: 'left'}}>{dayNum}</Text>
        </View>
        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{event}</Text>
        
    </View>
    );
};

export const MonthHeader = (props: { month: string, year: number }) => {
    const { month, year } = props;
    return (
        <View>
            <Text>{year} {month}</Text>
        </View>
    );
}

const eventNames: string[] = [
    "Yoga", "Meeting", "Workshop", "Conference", "Webinar", "Training", "Seminar", "Lecture", "Class", "Session",
    "Appointment", "Gathering", "Celebration", "Party", "Festival", "Concert", "Exhibition", "Fair", "Show", "Tournament"
];

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
}

export const getEvents = (): DayEventProps[] => {
    let events: DayEventProps[] = [];
    let dateDisplayed:Date = new Date();
    
    for (let i = dateDisplayed.getMonth(); i <= 11; i++) // loops through this and all next months
    {
        dateDisplayed.setMonth(i);

        for (let i = 1; i <= getDaysInMonth(dateDisplayed.getFullYear(), dateDisplayed.getMonth()); i++) {
            let date:Date = new Date(dateDisplayed.getFullYear(), dateDisplayed.getMonth(), i);
            events.push({
                event: eventNames[i]?.toString() || "No event",
                day: getDayOfWeekName(date),
                dayNum: i,
                month: monthNames[dateDisplayed.getMonth()],
                year: dateDisplayed.getFullYear()
            });
        }
    
    }
    return events;
};//<MonthHeader month={monthNames[dateDisplayed.getMonth() + 1]} year={dateDisplayed.getFullYear()} />

export const renderEditingTexts = () => {
    
    const events = getEvents();
    return events.map((event, index) => (
            
            <DayEvent {...event} />

    ));
};
