import { model, Schema, Types } from "mongoose";

// bank type
export interface BankType {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    bankName: string;
    bankAccount: string;
    bankUser: string;
}

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

// bank schema
const BankSchema = new Schema<BankType>({
    _id: Types.ObjectId,
    bankName: String,
    bankAccount: String,
    bankUser: String,
    userId: Types.ObjectId,
})

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