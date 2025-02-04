import express from "express";
import { createUserHandler, readUser, updateUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();

// ROUTES //

// GET 
userRouter.get("/", readUser);
// POST
userRouter.post("/", createUserHandler);
// PUT 
userRouter.put("/", updateUser)
// DELETE 
userRouter.delete("/", deleteUser)


// EXPORT
export default userRouter;