import { model, Schema, Types } from "mongoose";

interface AirportType {
    code: string;
    airport_name: string;
    city: string;
    country: string;
    _id: Types.ObjectId
}

const AirportSchema = new Schema<AirportType>({
    code: String,
    airport_name: String,
    city: String,
    country: String,
    _id: Schema.Types.ObjectId,
})

export const Airport = model("Airports", AirportSchema)