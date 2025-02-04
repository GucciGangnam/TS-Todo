// IMPORTS 
import express from "express";
import { readList, createList, updateList, deleteList } from "../controllers/listController";

const listsRouter = express.Router();

// ROUTES //

// GET 
listsRouter.get("/", readList);
// POST
listsRouter.post("/", createList);
// PUT 
listsRouter.put("/", updateList)
// DELETE 
listsRouter.delete("/", deleteList)

// EXPORTS
export default listsRouter;