import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { Invoice } from "../libs/mongoose/models/invoice.model";
import { Schedule } from "../libs/mongoose/models/schedule.model";

const route = Router();

// create new invoice
route.post("/invoice", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Invoice.create(req.body);

        return res.json({ message: "", success: false, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// get invoices
route.get("/invoices", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoices = await Invoice.find({ userId: user._id }).populate({
            path: "batch",
            model: Schedule,
        });

        return res.json({ message: "", success: false, result: invoices });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// view invoice
route.get("/invoice/:id", middleware, async (req: Request, res: Response) => {
    try {
        const invoiceId = req.params.id;

        if (!invoiceId) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Invoice.findOne({ _id: invoiceId }).populate({
            path: "batch",
            model: Schedule,
        });

        return res.json({ message: "", success: false, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// update invoice
route.put("/invoice/:id", middleware, async (req: Request, res: Response) => {
    try {
        const invoiceId = req.params.id;

        if (!invoiceId) throw new Error("Pengguna tidak ditemukan.");
        
        const invoice = await Invoice.findOne({ _id: invoiceId });
        if (!invoice) throw new Error("Invoice tidak ditemukan.");

        invoice.set(req.body);
        await invoice.save();

        return res.json({ message: "Invoice telah diperbaharui.", success: false, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

export const invoiceRoute = route;