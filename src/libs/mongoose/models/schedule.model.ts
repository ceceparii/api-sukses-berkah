import { model, Schema, Types } from "mongoose";
import { AirportSchema, AirportType } from "./airport.model";

export interface ScheduleType {
    _id?: Types.ObjectId;
    depart: AirportType;
    arrival: AirportType;
    date: Date;
    return?: Date | null;
    persons: PersonType[];
    airlines?: AirlineType | null;
}

export interface AirlineType {
    code: string;
    name: string;
    logo: string;
}

export interface PersonType {
    name: string;
    baggage: string;
}

const AirlineSchema = new Schema<AirlineType>({
    code: String,
    name: String,
    logo: String,
})

const ScheduleSchema = new Schema<ScheduleType>({
    _id: Types.ObjectId,
    depart: AirportSchema,
    arrival: AirportSchema,
    date: Date,
    return: Date,
    airlines: AirlineSchema,
    persons: [{ name: String, baggage: String}]
})

export const Schedule = model("Schedules", ScheduleSchema)