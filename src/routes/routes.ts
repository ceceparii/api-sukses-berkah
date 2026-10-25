import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { User } from "../libs/mongoose/models/user.model";
import { Invoice } from "../libs/mongoose/models/invoice.model";
import { Schedule } from "../libs/mongoose/models/schedule.model";

const route = Router();

route.get("/api/initialize", middleware, async (req: Request, res: Response) => {
    const userId = req.user?._id;
    try {
        if (!userId) throw new Error("invalid user id")
        const user = await User.findOne({_id: userId}).select("username phone banks");

        if(!user) throw new Error("Pengguna tidak ditemukan");

        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        const current_month = {
            $gte: new Date(year, month -1, 1),
            $lt: new Date(year, month, 1),
        }

        const last_month = {
            $gte: new Date(year, month -2, 1),
            $lt: new Date(year, month -1, 1),
        }

        // [idncurrent, jpcurrent, idnlastmonth, jplastmonth]
        const invoices = await Promise.all([
            Invoice.find({date: current_month}),
            Invoice.find({return: current_month}),
            Invoice.find({date: last_month}),
            Invoice.find({return: last_month}),
        ])
        
        const payments_total = invoices.map((invoice) => {
            return invoice.reduce((total, inv) => total + inv.total, 0);
        });

        const schedules_idn = await Schedule.find({
            date: {
                $gte: new Date(year, month -1, 1)
            }
        })
        .limit(2)
        .sort({date: 1})

        const schedules_jp = await Schedule.find({
            return: {
                $gte: new Date(year, month -1, 1)
            }
        })
        .limit(2)
        .sort({date: 1})

        const result = {
            user,
            payments_total,
            schedules_idn,
            schedules_jp,
        };

        return res.json({success: true, result, message: "OK"})
    } catch (error: unknown) {
        if(error instanceof Error) {
            return res.json({successs: false, message: error.message})
        }
    }
})

export default route