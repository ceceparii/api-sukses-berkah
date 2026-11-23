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

// filter schedules by month
route.get("/api/schedules/filter/:month/:year", middleware, async (req: Request, res: Response) => {
    try {
        const month: number = Number(req.params.month); // 1 - 12
        const year: number = Number(req.params.year);

        const monthIndex = month - 1;

        const startDate = new Date(year, monthIndex - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, monthIndex + 2, 0, 23, 59, 59, 999);

        const result = await Schedule.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        }).sort({ date: 1 });

        return res.json({ message: "OK", success: true, result })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false })
        }
    }
});

// get schedules by month and origin
route.get("/api/schedules/:month/:year/:origin", middleware, async (req: Request, res: Response) => {
    try {
        const month: number = Number(req.params.month);
        const year: number = Number(req.params.year);
        const origin: string = req.params.origin as string;
        
        const startDate = new Date(year, month -1, 1);
        const endDate = new Date(year, month, 1);

        const key = origin.toUpperCase() === "INDONESIA" ? "date" : "return";
        
        const query = {
            [key]: {
                $gte: startDate,
                $lt: endDate,
            }
        }

        const schedules = await Schedule.find(query);

        const result = schedules.map((s) => {
            if (key === "date") {
                return s
            } else {
                return {
                    persons: s.persons,
                    airlines: s.airlines,
                    return: s.date,
                    _id: s._id,
                    date: s.return,
                    depart: s.arrival,
                    arrival: s.depart
                }
            }
        })

        return res.json({ message: "OK", success: true, result })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false })
        }
    }
});

// get all schedules
route.get("/api/schedules", middleware, async (req: Request, res: Response) => {
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
// get next schedules
route.get("/api/schedule/next", middleware, async (req: Request, res: Response) => {
    try {
        const nextScheduleDepart = await Schedule.findOne({
            date: { $gte: new Date() },
        }).sort({
            date: 1,
        });

        const nextScheduleReturn = await Schedule.findOne({
            return: { $gte: new Date() },
        }).sort({
            date: 1,
        });

        const result = {
            depart: nextScheduleDepart,
            return: nextScheduleReturn
        }
        
        return res.json({ message: "OK", success: true, result })
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

// serach by name
route.get("/api/schedule/find-by-personal-name/:name", middleware, async (req: Request, res: Response) => {
    try {
        const keyword = req.params.name as string
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth() - 2;
        const words = keyword.trim().split(/\s+/);

        const schedules = await Schedule.find({
            $and: words.map(word => ({
                "persons.name": {
                    $regex: word,
                    $options: "i"
                },
                date: {
                    $gte: new Date(year, month, 1)
                }
            }))
        });

        return res.json({success: true, result: schedules})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})
export const scheduleRoutes = route