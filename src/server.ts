import express, { Request, Response } from "express";
import route from "./routes/routes";
import { connectDatabase } from "./libs/mongoose/connection/mongoose.connection";
import { userRoutes } from "./routes/user.route";
import { scheduleRoutes } from "./routes/schedules.routes";
import { priceRoutes } from "./routes/price.routes";
import { invoiceRoute } from "./routes/invoice.routes";
import { airportRoutes } from "./routes/airport.routes";

const app = express();

app.use(express.json());

app.use("/", route);
app.use("/", scheduleRoutes);
app.use("/", userRoutes);
app.use("/", priceRoutes);
app.use("/", invoiceRoute);
app.use("/", airportRoutes)

const start = async () => {
    await connectDatabase()
    app.listen(3000, async () => {
        console.log(`Server running on PORT ${3000}`)
    })
}

start()