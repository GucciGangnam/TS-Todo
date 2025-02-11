// IMPORTS
import express from "express";
import { readTask, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { authenticateUser } from "../controllers/authController"

const tasksRouer = express.Router();

// ROUTES //

// GET 
tasksRouer.get("/", readTask);
// POST
tasksRouer.post("/", authenticateUser, createTask);
// PUT 
tasksRouer.put("/", authenticateUser, updateTask)
// DELETE 
tasksRouer.delete("/", deleteTask)

// EXPORTS
export default tasksRouer;