import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { Airport } from "../libs/mongoose/models/airport.model";
import { Types } from "mongoose";
const route = Router()

// get airport data
route.get("/api/airports", middleware , async (request: Request, response: Response) => {
    try {
        const result = await Airport.find();

        return response.json({ message: "OK", result, succes: true })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ message: error.message, success: false})
        }
    }
})

// create airport
route.post("/api/airport", middleware , async (request: Request, response: Response) => {
    try {
        const newAirport = {...request.body, _id: new Types.ObjectId()};

        const result = await Airport.create(newAirport);

        return response.json({ message: "Berhasil menambahkan bandara", result, succes: true })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ message: error.message, success: false})
        }
    }
})

// update airport
route.put("/api/airport/id", middleware , async (request: Request, response: Response) => {
    try {
        const airport = await Airport.findOne({ _id: request.params.id });
        if(!airport) {
            throw new Error("Invalid airport id")
        }
        airport.set(request.body);

        await airport?.save()
        return response.json({ message: "Berhasil memperbaharui bandara", result: airport, succes: true })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ message: error.message, success: false})
        }
    }
})

export const airportRoutes = route;