import express from "express";
import { loginUser } from "../controllers/authController";

const authRouter = express.Router();

// Routes 

authRouter.post("/login", loginUser);



export default authRouter;