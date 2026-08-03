import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

const { MONGO_URI } = process.env;

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI!, {
            autoIndex: false,
        });

        console.log("✅ MongoDB Connected");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            process.exit(1);
        }
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("🔴 MongoDB Disconnected");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB Error:", error);
});

export const closeDatabase = async () => {
    await mongoose.connection.close();
};