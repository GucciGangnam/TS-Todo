// IMPORTS 
import express from "express";
import { readList, createList, updateList, deleteList } from "../controllers/listController";
import { authenticateUser } from "../controllers/authController"

const listsRouter = express.Router();

// ROUTES //

// GET 
listsRouter.get("/", readList);
// POST
listsRouter.post("/", authenticateUser, createList);
// PUT 
listsRouter.put("/", authenticateUser, updateList)
// DELETE 
listsRouter.delete("/", deleteList)

// EXPORTS
export default listsRouter;