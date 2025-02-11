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

// Read Task -- Maybe not needed
export const readTask = async (req: Request, res: Response) => {
    console.log("Reading task")
    res.send("Reading task")
}

// Update Task Needs; Name, dexceription, duedate, completed, important
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Make sure owner owns this task;
        const userId = req.user;
        const taskId = req.body.taskId;
        // Fetch the task's owner_id
        const taskOwnerQuery = 'SELECT owner_id FROM tasks WHERE id = $1';
        const taskOwnerResult = await pool.query(taskOwnerQuery, [taskId]);
        // If no task is found or the user is not the owner, return an error
        if (taskOwnerResult.rows.length === 0 || taskOwnerResult.rows[0].owner_id !== userId) {
            throw new AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissiosn to edit this account" }
            ]);
        }
        const { newName, newDescription, newDueDate, newCompleted, newImportant } = req.body;
        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;
        if (newName !== undefined) {
            updates.push(`name = $${index}`);
            values.push(newName);
            index++;
        }
        if (newDescription !== undefined) {
            updates.push(`description = $${index}`);
            values.push(newDescription);
            index++;
        }
        if (newDueDate !== undefined) {
            updates.push(`due_date = $${index}`);
            values.push(newDueDate);
            index++;
        }
        if (newCompleted !== undefined) {
            updates.push(`completed = $${index}`);
            values.push(newCompleted);
            index++;
        }
        if (newImportant !== undefined) {
            updates.push(`important = $${index}`);
            values.push(newImportant);
            index++;
        }
        if (updates.length === 0) {
            throw new AppError(403, "No updated have been given for this task", [
                { field: "Inputs", message: "No updated have been given for this task" }
            ]);
            // return res.status(400).json({ success: false, message: "No fields provided for update" });
        }
        // Push taskId at the end with the correct index
        values.push(taskId);
        const updateListQuery = `UPDATE tasks SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`;
        const result = await pool.query(updateListQuery, values);
        res.status(200).json({ success: true, updatedTask: result.rows[0] });
        return;
    } catch (err) {
        next(err);
    }
}

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
    console.log("Deleting task")
    res.send("Deleting task")
}