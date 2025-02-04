// IMPORTS
import express from "express";
import { readTask, createTask, updateTask, deleteTask } from "../controllers/taskController";

const tasksRouer = express.Router();

// ROUTES //

// GET 
tasksRouer.get("/", readTask);
// POST
tasksRouer.post("/", createTask);
// PUT 
tasksRouer.put("/", updateTask)
// DELETE 
tasksRouer.delete("/", deleteTask)

// EXPORTS
export default tasksRouer;