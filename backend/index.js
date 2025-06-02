import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import connectToDb from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import messageRouter from "./routes/messageRoute.js";
import { app, server } from "./config/socket.js";
// import mongoSanitize from "express-mongo-sanitize";

connectToDb();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(helmet());
// app.use(mongoSanitize());

//routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
