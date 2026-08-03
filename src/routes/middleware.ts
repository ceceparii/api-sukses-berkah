import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadType } from "../types/types";

export interface JwtPayload {
    id: string;
    username: string;
}

export const middleware = (request: Request, response: Response, next: NextFunction) => {
    const auth = request.headers.authorization;

    try {
        if (!auth?.startsWith("Bearer ")) {
            throw new Error("Token tidak valid")
        }

        const token = auth.split(" ")[1];

        // verify token
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        if (!token) {
            throw new Error("Token tidak valid.")
        }
        
        request.user = payload as JwtPayloadType;

        next();
    } catch {
        return response.status(401).json({
            success: false,
            message: "Token tidak valid",
        });
    }
};