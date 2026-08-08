import { Request, Response, Router } from "express";
import { middleware } from "./middleware";
import { Price } from "../libs/mongoose/models/price.model";

const route = Router();

// create new price list
route.post("/api/price", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const invoice = await Price.create(req.body);

        return res.json({ message: "Berhasil menambahkan daftar harga", success: true, result: invoice });
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// get price list
route.get("/api/price", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");
        
        const priceList = await Price.find();

        return res.json({ message: "OK", success: true, result: priceList})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// update price list
route.put("/api/price/:id", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const id = req.params.id;
        const priceList = await Price.findOne({ _id: id });

        if (!priceList) {
            throw new Error("Daftar harga tidak ditemukan");
        }

        priceList.set(req.body);
        await priceList.save();
        
        return res.json({ message: "OK", success: true, result: priceList})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

// remove price list
route.delete("/api/price/:id", middleware, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const id = req.params.id;
        const priceList = await Price.deleteOne({ _id: id });

        if (!priceList) {
            throw new Error("Daftar harga tidak ditemukan");
        }

        return res.json({ message: "OK", success: true, result: priceList})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message, success: false})
        }
    }
})

export const priceRoutes = route;