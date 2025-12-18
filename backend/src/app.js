import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

//CONFIG
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma"],
    credentials: true,
  })
);
app.use(express.json());

//ROUTES

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorMiddleware);

export default app;