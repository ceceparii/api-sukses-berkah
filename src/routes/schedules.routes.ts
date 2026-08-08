import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { Schedule } from "../libs/mongoose/models/schedule.model";

const route = Router();
// create schedules
route.post("/api/schedule", middleware, async (req: Request, res: Response) => {
    try {
        const result = await Schedule.create(req.body);

        return res.json({ message: "Berhasil menambahkan trip", success: true, result})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})
// get schedule
route.get("/api/schedule", middleware, async (req: Request, res: Response) => {
    try {
        const schedules = await Schedule.find();
        return res.json({ message: "OK", success: true, result: schedules })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false })
        }
    }
});
// update schedule
route.put("/api/schedule/:id", middleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const schedule = await Schedule.findOne({ _id: id })

        if (!schedule) throw new Error("Jadwal tidak ditemukan");

        schedule.set(req.body);

        await schedule.save();

        return res.json({ message: "Berhasil menambahkan trip", success: true, result: schedule})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})
// remove schedule
route.delete("/api/schedule/:id", middleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const schedule = await Schedule.deleteOne({ _id: id })

        if (!schedule) throw new Error("Jadwal tidak ditemukan");

        return res.json({ message: "Berhasil menambahkan trip", success: true, result: schedule})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

export const scheduleRoutes = route