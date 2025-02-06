import express from "express";
import { createUserHandler, readUser, updateUser, deleteUser } from "../controllers/userController";
import { authenticateUser } from "../controllers/authController"

const userRouter = express.Router();

// ROUTES //

// GET 
userRouter.get("/", readUser);
// POST
userRouter.post("/", createUserHandler);
// PUT 
userRouter.put("/", authenticateUser, updateUser)
// DELETE 
userRouter.delete("/", deleteUser)


// EXPORT
export default userRouter;