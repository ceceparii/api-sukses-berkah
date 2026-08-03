import { model, Schema, Types } from "mongoose";

type UnitType = "kg" | "pair" | "slop" | "item" | "pcs";

export interface PriceType {
    _id: Types.ObjectId;
    name: String;
    price: Number;
    trip: "IDN" | "JP",
    unit: UnitType,
}

const PriceSchema = new Schema<PriceType>({
    _id: Types.ObjectId,
    name: String,
    price: String,
    trip: { type: String, enum: ["IDN", "JP"]},
    unit: {
        type: String,
        enum: ["kg", "pair", "slop", "item", "pcs"]
    }
})

export const Price = model("Prices", PriceSchema)