import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { Invoice, InvoiceType } from "../libs/mongoose/models/invoice.model";
import { Schedule, ScheduleType } from "../libs/mongoose/models/schedule.model";
import { User } from "../libs/mongoose/models/user.model";

const route = Router();

// download invoice
route.get("/api/download/invoice/:id", middleware, async (req: Request, res: Response) => {
    const userId = req.user?._id;

    try {
        if(!userId) {
            return res.json({ success: false, message: "Invalid user id"})
        }
        const user = await User.findOne({_id: userId}).select("username phone banks");
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Invoice.findOne({_id: req.params.id}).populate({
            path: "batch",
            model: Schedule,
        }) as InvoiceType<ScheduleType> | null;

        if(!invoice) throw new Error("Invoice tidak ditemukan");

        const result = {
            invoice,
            user,
        }

        return res.json({ success: true, result, message: ""})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// create new invoice
route.post("/api/invoice", middleware, async (req: Request, res: Response) => {
    const userId = req.user?._id;

    try {
        if(!userId) {
            return res.json({ success: false, message: "Invalid user id"})
        }
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Invoice.create({...req.body, userId});

        return res.json({ message: "Berhasil membuat invoice", success: true, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// get invoices
route.get("/api/invoices", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoices = await Invoice.find({ userId: user._id }).populate({
            path: "batch",
            model: Schedule,
        });

        return res.json({ message: "", success: true, result: invoices });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// view invoice
route.get("/api/invoice/:id", middleware, async (req: Request, res: Response) => {
    try {
        const invoiceId = req.params.id;

        if (!invoiceId) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Invoice.findOne({ _id: invoiceId }).populate({
            path: "batch",
            model: Schedule,
        });

        return res.json({ message: "", success: true, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// search invoice
route.get("/api/search/invoice/:name", middleware, async (req: Request, res: Response) => {
    try {
        const search = req.params.name as string;

        if (!search) throw new Error("Pengguna tidak ditemukan.");

        const regex = new RegExp(
            search
                .split("")
                .map(char => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .join(".*"),
            "i"
        );

        const invoices = await Invoice.find({
            customer: regex
        });

        return res.json({ message: "", success: true, result: invoices });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// update invoice
route.put("/api/invoice/:id", middleware, async (req: Request, res: Response) => {
    try {
        const invoiceId = req.params.id;

        if (!invoiceId) throw new Error("Pengguna tidak ditemukan.");
        
        const invoice = await Invoice.findOne({ _id: invoiceId });
        if (!invoice) throw new Error("Invoice tidak ditemukan.");

        invoice.set(req.body);
        await invoice.save();

        return res.json({ message: "Invoice telah diperbaharui.", success: true, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

export const invoiceRoute = route;