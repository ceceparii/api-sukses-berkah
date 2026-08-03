import { model, Schema, Types } from "mongoose";

export interface BankType {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    bankName: string;
    bankAccount: string;
    bankUser: string;
}

export const BankSchema = new Schema<BankType>({
    _id: Types.ObjectId,
    bankName: String,
    bankAccount: String,
    bankUser: String,
    userId: Types.ObjectId,
})

export const Bank = model("Banks", BankSchema);