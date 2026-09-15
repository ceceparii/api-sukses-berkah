import { model, Schema, Types } from "mongoose";

type UnitType = "kg" | "pair" | "slop" | "item" | "pcs";

export interface ItemType {
    _id: Types.ObjectId,
    name: String;
    price: number;
    qty: number;
    tax: number;
    subtotal: number;
    currency: "IDR" | "JPY"
    unit: UnitType;
}

export interface InvoiceType {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    customer: String;
    rate: number;
    deposit: number;
    currency: "JPY" | "IDR";
    batch: Types.ObjectId;
    trip: "IDN" | "JP";
    items: ItemType[];
    total: number,
}

const ItemSchema = new Schema<ItemType>({
    _id: Types.ObjectId,
    name: String,
    price: Number,
    qty: Number,
    tax: Number,
    subtotal: Number
})

const InvoiceSchema = new Schema<InvoiceType>({
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    customer: String,
    rate: Number,
    deposit: Number,
    currency: { type: String, enum: ["JPY", "IDR"]},
    batch: Types.ObjectId,
    trip: { type: String, enum: ["IDN", "JP"]},
    items: [ItemSchema],
    total: Number,
})

export const Invoice = model("invoices", InvoiceSchema)