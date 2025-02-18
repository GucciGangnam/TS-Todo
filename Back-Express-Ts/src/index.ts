import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRouter from "./routers/users";
import listsRouter from "./routers/lists";
import tasksRouer from "./routers/tasks";
import authRouter from "./routers/auth"

// Global error handler
import { errorHandler } from "./controllers/errorHanlderController";

dotenv.config();
export const app = express();

const allowedOrigin = process.env.FRONT_END_URL;
app.use(
    cors({
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // Allow cookies/auth headers
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRouter);
app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouer);
app.use("/api/auth", authRouter);
// Trailing error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}