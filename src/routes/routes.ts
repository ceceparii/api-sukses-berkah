import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { User } from "../libs/mongoose/models/user.model";
import { BatchType, Invoice } from "../libs/mongoose/models/invoice.model";
import { Schedule, ScheduleType } from "../libs/mongoose/models/schedule.model";
import { Airport } from "../libs/mongoose/models/airport.model";

const route = Router();

route.get("/api/initialize", middleware, async (req: Request, res: Response) => {
    const userId = req.user?._id;
    try {
        if (!userId) throw new Error("invalid user id")
        const user = await User.findOne({_id: userId}).select("username phone banks");

        if(!user) throw new Error("Pengguna tidak ditemukan");

        const date = new Date()
        const currentDate = new Date().getDate();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        const current_month = {
            $gte: new Date(currentYear, currentMonth, 1, 0, 0, 0, 0),
        };

        const last_month = {
            $gte: new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59, 999),
        };
        // [idncurrent, idnlastmonth, jpcurrent,  jplastmonth]
        const invoices = await Promise.all([
            Invoice.find({"batch.date": current_month, "batch.origin": "indonesia"}),
            Invoice.find({"batch.date": last_month, "batch.origin": "indonesia"}),
            Invoice.find({"batch.date": current_month, "batch.origin": {$ne: "indonesia"}}),
            Invoice.find({"batch.date": last_month, "batch.origin":{ $ne: "indonesia"}}),
        ])
        
        const [idncurrent, idnlastmonth, jpcurrent,  jplastmonth] = invoices.map((invoice) => {
            return invoice.reduce((total, inv) => total + inv.total, 0);
        });

        const paymentsTotal: Record<string, number> = {
            idncurrent,
            idnlastmonth,
            jpcurrent,
            jplastmonth
        }

        // next schedule
        const [ nextScheduleIDN, nextScheduleJP] = await Promise.all([
            Schedule.find({
                date: {
                    $gte: date.setDate(currentDate - 1)
                }
            })
            .limit(1),
            Schedule.find({
                return: {
                    $gte: date.setDate(currentDate - 1)
                }
            })
            .limit(1)
        ])
        
        const nextSchedule: Record<string, ScheduleType[]> = {
            nextIDN: nextScheduleIDN,
            nextJP: nextScheduleJP
        }

        // batch initialize
        const [ idnSchedule, jpSchedule] = await Promise.all([
            Schedule.find({
                date: {
                    $gte: date.setDate(currentDate - 30),
                    $lte: date.setDate(currentDate + 30),
                }
            })
            .sort({date: 1}),
            Schedule.find({
                return: {
                    $gte: date.setDate(currentDate - 30),
                    $lte: date.setDate(currentDate + 30),
                }
            })
            .sort({return: 1})
        ])

        const batchs: Record<string, BatchType[]> = {
            idnBatch: idnSchedule.map((s) => ({
                origin: s.depart.country,
                dest: s.arrival.country,
                date: s.date,
                dateStr: new Date(s.date).toLocaleDateString("id-ID", {
                    dateStyle: "long"
                })
            })),
            jpBatch: jpSchedule.map((s) => ({
                origin: s.arrival.country,
                dest: s.depart.country,
                date: s.return!,
                dateStr: new Date(s.date).toLocaleDateString("id-ID", {
                    dateStyle: "long"
                })
            }))
        }

        // get airports
        const airports = await Airport.find({});

        const result = {
            user,
            paymentsTotal,
            nextSchedule,
            batchs,
            airports
        };

        return res.json({success: true, result, message: "OK"})
    } catch (error: unknown) {
        if(error instanceof Error) {
            return res.json({successs: false, message: error.message})
        }
    }
})

export default route