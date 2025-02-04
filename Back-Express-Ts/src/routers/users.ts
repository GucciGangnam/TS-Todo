import express from "express";
import { createUser, readUser, updateUser, deleteUser } from "../controllers/userController";


const userRouter = express.Router();


// GET 
userRouter.get("/", readUser);
// POST
userRouter.post("/", createUser);

// PUT 
userRouter.put("/", updateUser)

// DELETE 
userRouter.delete("/", deleteUser)

export default userRouter;