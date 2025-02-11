// IMPORTS 
import { Request, Response, NextFunction } from "express";
import pool from "../database/pool";
import { AppError } from "../utils/appError";
import { create } from "domain";


// CONTROLLER //
// Create Task 
// Requires body.parentListId, body.taskName
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating task")
    try {

        const userId = req.user;
        const parentListId = req.body.parentListId;
        const taskName = req.body.taskName;
        // MAKE SURE LIST BELOGS TO USER id (list.owner_id == userid);
        const checkOwnerQuery = await pool.query('SELECT owner_id FROM lists WHERE id = $1', [parentListId]);
        const ownerOfList: string = checkOwnerQuery.rows[0].owner_id;
        if (ownerOfList !== userId) {
            throw new AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissiosn to edit this account" }
            ]);
        }
        //// Query 
        const createTaskQuery = "INSERT INTO tasks (name, list_id, owner_id) VALUES ($1, $2, $3) RETURNING *";
        const createTaskValues = [taskName, parentListId, userId];
        const createTaskResult = await pool.query(createTaskQuery, createTaskValues);
        const newTask = createTaskResult.rows[0];
        // Respond
        res.status(201).json({
            success: true,  // Indicate the success of the operation
            message: "Task creared sucesfully",  // The success message
            data: newTask
        });
        return;

    } catch (err) {
        next(err)
    }
}

// Read Task 
export const readTask = async (req: Request, res: Response) => {
    console.log("Reading task")
    res.send("Reading task")
}

// Update Task 
export const updateTask = async (req: Request, res: Response) => {
    console.log("Updating task")
    res.send("Updating task")
}

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
    console.log("Deleting task")
    res.send("Deleting task")
}