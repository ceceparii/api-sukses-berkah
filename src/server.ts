import express, { Request, Response } from "express";
import route from "./routes/routes";
import { connectDatabase } from "./libs/mongoose/connection/mongoose.connection";
import { userRoutes } from "./routes/user.route";
import { scheduleRoutes } from "./routes/schedules.routes";
import { priceRoutes } from "./routes/price.routes";
import { invoiceRoute } from "./routes/invoice.routes";

const app = express();

app.use(express.json());

app.use("/api", route);
app.use("/api", scheduleRoutes);
app.use("/api", userRoutes);
app.use("/api", priceRoutes);
app.use("/api", invoiceRoute);

const start = async () => {
    await connectDatabase()
    app.listen(3000, async () => {
        console.log(`Server running on PORT ${3000}`)
    })
}

start()