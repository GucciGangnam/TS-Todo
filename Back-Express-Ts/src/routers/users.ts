import express from "express";
import { createUser, readUser, updateUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();

// ROUTES //

// GET 
userRouter.get("/", readUser);
// POST
userRouter.post("/", createUser);
// PUT 
userRouter.put("/", updateUser)
// DELETE 
userRouter.delete("/", deleteUser)


// EXPORT
export default userRouter;