import { model, Schema, Types } from "mongoose";
import { BankSchema, BankType } from "./bank.model"

// user type
export interface UserType {
    _id: Types.ObjectId;
    username: string;
    phone: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    banks: BankType[]
}

// user schema
const UserSchema = new Schema<UserType>({
    _id: Schema.Types.ObjectId,
    username: String,
    phone: String,
    password: String,
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date()},
    banks: [BankSchema]
})

export const User = model("Users", UserSchema);