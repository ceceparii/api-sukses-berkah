import { Request, Response, Router } from "express";
import { User } from "../libs/mongoose/models/user.model";
import { middleware } from "./middleware";
import bcrypt from "bcryptjs"
import { Types } from "mongoose";
import { JwtPayloadType } from "../types/types";
import jwt from "jsonwebtoken";

const route = Router();

// get user data
route.get("/api/user/data", middleware , async (request: Request, response: Response) => {
    const id = request.user?._id;

    try {
        if (!id) throw new Error("Bad request, invalid user id.");
        const user = await User.findOne({ _id: id}).select("-password");

        if (!user) {
            throw new Error("Pengguna tidak ditemukan")
        }

        return response.json({ message: "OK", result: user, success: true })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ message: error.message, success: false})
        }
    }
})

// update user data
route.put("/api/user/data", middleware, async (req: Request, res: Response) => {
    const id = req.user?._id;

    try {
        if(!id) {
            throw new Error("Vad request, invalid user id");
        }

        const user = await User.findOne({ _id: id }).select("-password");

        if (!user) {
            throw new Error("User tidak ditemukan, atau belum terdaftar.")
        }

        user.set(req.body);

        await user.save();

        return res.json({ message: "Data berhasil diperbaharui.", success: true, result: user})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return res.json({ message: error.message })
        }
    }
})

// register user
route.post("/api/user/regist",async (request: Request, response: Response) => {
    try {
        const { phone, username, password} = request.body;
        const exist = await User.findOne({ phone });

        if(exist) {
            throw new Error("Pengguna telah terdatar");
        }

        const hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            _id: new Types.ObjectId(),
            username,
            password: hash,
            phone
        })

        return response.json({ success: true, result: user, message: "Pendaftaran berhasil, menunggu verifikasi."})
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ success: false, message: error.message })
        }
    }
})
// user login
route.post("/api/user/login", async (request: Request, response: Response) => {
    const { phone, password } = request.body as Record<string, string>;

    try {
        if (!phone || !password) {
            throw new Error("Bad Request")
        }

        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan atau belum terverifikasi.");
        }

        // compare password
        const valid = await bcrypt.compare(password, user.password!);

        if (!valid) {
            throw new Error("Password salah.")
        }

        // token payload
        const payload: JwtPayloadType = {
            _id: user._id,
            username: user.username,
            phone: user.phone,
        }

        // create jwt
        const token = jwt.sign(payload, process.env.JWT_SECRET!)

        return response.json({ message: "Login berhasil", success: true, result: token })
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            return response.json({ message: error.message, success: false })
        }
    }
})

export const userRoutes = route