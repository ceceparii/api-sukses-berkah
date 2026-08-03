import { model, Schema, Types } from "mongoose";

interface FlightType {
    date: Date;
    airport: string;
    airportName: string;
    city: string;
    country: string;
    airlines: {
        name: string;
        logo?: string;
    }
}

interface PersonType {
    name: string;
    baggage: string;
}

export interface ScheduleType {
    _id: Types.ObjectId;
    createdAt: Date;
    depart: FlightType;
    arive: FlightType;
    person: PersonType[]
}

const FlightSchema = new Schema<FlightType>({
    date: Date,
    airport: String,
    airportName: String,
    city: String,
    country: String,
    airlines: {
        name: String,
        logo: String,
    }
})

const ScheduleSchema = new Schema<ScheduleType>({
    _id: Types.ObjectId,
    createdAt: Date,
    depart: FlightSchema,
    arive: FlightSchema,
    person: [{ name: String, baggage: String}]
})

export const Schedule = model("Schedules", ScheduleSchema)