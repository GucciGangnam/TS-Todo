import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRouter from "./routers/users";
import listsRouter from "./routers/lists";
import tasksRouer from "./routers/tasks";

// Global error handler
import { errorHandler } from "./controllers/errorHanlderController";

dotenv.config();
const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRouter);
app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouer);
// Trailing error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));