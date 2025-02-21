import { Text, View, StyleSheet } from "react-native";
import React from "react";


export const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayEventProps {
    event: string;
    day: string;
    dayNum: number;
    month: string;
    year: number;
    header: boolean;
    id: number;
}

const getDayOfWeekName = (day: Date): string => {
    return days[day.getDay()];
}

export const DayEvent = (props: DayEventProps) => {
    const { event, day, dayNum, month, year } = props;
    return (
  
    <View style={styles.dayEventContainer}>
        <View style={styles.dayEventColumn}>
        
        <Text style={styles.dayT}>{day}</Text>
        <Text style={styles.dayNumT}>{dayNum}</Text>
        </View>
        <Text style={styles.eventT}>{event}</Text>
        
    </View>
    );
};

export const MonthHeader = (props: { month: string, year: number }) => {
    const { month, year } = props;
    return (
        <View style={styles.monthHeaderContainer}>
            <Text style={styles.monthHeaderT}>{year} {month}</Text>
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
    
        //dateDisplayed.setMonth(i);
        for (let i = 1; i <= getDaysInMonth(dateDisplayed.getFullYear(), dateDisplayed.getMonth()); i++) {
            let date:Date = new Date(dateDisplayed.getFullYear(), dateDisplayed.getMonth(), i);
            events.push({
                event: eventNames[i]?.toString() || "No event",
                day: getDayOfWeekName(date),
                dayNum: i,
                month: monthNames[dateDisplayed.getMonth()],
                year: dateDisplayed.getFullYear(),
                header: false,
                id: i+dateDisplayed.getMonth()
            });
        }
    return events;
};//<MonthHeader month={monthNames[dateDisplayed.getMonth() + 1]} year={dateDisplayed.getFullYear()} />

export const getMonthEvents = (month: number, year: number): DayEventProps[] => {
    let events: DayEventProps[] = [];
    events.push({
        event: "",
        day: "",
        dayNum: 0,
        month: monthNames[month],
        year: year,
        header: true,
        id: 0
    });
    for (let i = 1; i <= getDaysInMonth(year, month); i++) {
        let date:Date = new Date(year, month, i);
        events.push({
            event: eventNames[i]?.toString() || "No event",
            day: getDayOfWeekName(date),
            dayNum: i,
            month: monthNames[month],
            year: year,
            header: false,
            id: i+month
        });
    }
    return events;
};


const styles = StyleSheet.create({
    dayEventContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    dayEventColumn: {
        flexDirection: 'column',
        width: 'auto',
        justifyContent: 'space-between'
    },
    dayT: {
        textAlign: 'left',
        fontWeight: 'bold'
    },
    dayNumT: {
        textAlign: 'left'
    },
    eventT: {
        textAlign: 'left',
        fontWeight: 'bold'
    },
    monthHeaderContainer: {
        marginBottom: 20,
        marginTop: 25
    },
    monthHeaderT: {
        fontWeight: 'bold',
        fontSize: 24
    }
});