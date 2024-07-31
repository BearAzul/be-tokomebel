import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const port = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://fe-tokomebel.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

import authRouter from "./routers/authRouter.js";
import productRouter from "./routers/productRouter.js";
import OrderRouter from "./routers/orderRouter.js";

// Parent Router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", OrderRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Berjalan ya ges yak dengan port: ${port}`);
});

// Connection DB
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {});
