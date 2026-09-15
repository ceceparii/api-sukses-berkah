import { model, Schema, Types } from "mongoose";

export interface ItemType {
    _id: Types.ObjectId,
    name: String;
    price: number;
    qty: number;
    tax: number;
}

export interface InvoiceType {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    customer: String;
    rate: number;
    currency: "JPY" | "IDR";
    batch: Types.ObjectId;
    trip: "IDN" | "JP";
    items: ItemType[];
}

const ItemSchema = new Schema<ItemType>({
    _id: Types.ObjectId,
    name: String,
    price: Number,
    qty: Number,
    tax: Number,
})

const InvoiceSchema = new Schema<InvoiceType>({
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    customer: String,
    rate: Number,
    currency: { type: String, enum: ["JPY", "IDR"]},
    batch: Types.ObjectId,
    trip: { type: String, enum: ["IDN", "JP"]},
    items: [ItemSchema]
})

export const Invoice = model("invoices", InvoiceSchema)