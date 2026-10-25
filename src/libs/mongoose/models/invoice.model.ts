import { model, Schema, Types } from "mongoose";
import { ScheduleSchema, ScheduleType } from "./schedule.model";

type UnitType = "kg" | "pair" | "slop" | "item" | "pcs";

export interface ItemType {
    _id: Types.ObjectId,
    name: string;
    price: number;
    qty: number;
    tax: number;
    subtotal: number;
    currency: "IDR" | "JPY"
    unit: UnitType;
}

export interface InvoiceType<T= Types.ObjectId> {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    customer: String | RegExp;
    rate: number;
    deposit: number;
    date: Date;
    currency: "JPY" | "IDR";
    batch: T;
    trip: "IDN" | "JP";
    items: ItemType[];
    total: number,
    totalIDR: number,
}

const ItemSchema = new Schema<ItemType>({
    _id: Types.ObjectId,
    name: String,
    price: Number,
    currency: {type: String, enum: ["IDR", "JPY"]},
    qty: Number,
    tax: Number,
    unit: {type: String, enum: ["kg", "pair", "slop", "item", "pcs"]},
    subtotal: Number
})

const InvoiceSchema = new Schema<InvoiceType<ScheduleType>>({
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    customer: String,
    date: { type: Date, required: true },
    rate: Number,
    deposit: Number,
    currency: { type: String, enum: ["JPY", "IDR"]},
    batch: ScheduleSchema,
    trip: { type: String, enum: ["IDN", "JP"]},
    items: [ItemSchema],
    total: Number,
    totalIDR: Number,
})

export const Invoice = model("invoices", InvoiceSchema)