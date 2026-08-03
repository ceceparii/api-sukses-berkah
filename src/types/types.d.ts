import { Types } from "mongoose";

export interface JwtPayloadType {
    username: string;
    phone: string;
    _id: Types.ObjectId;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadType;
    }
  }
}

export {};