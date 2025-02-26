"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.readTask = exports.createTask = void 0;
const pool_1 = __importDefault(require("../database/pool"));
const appError_1 = require("../utils/appError");
// CONTROLLER //
// Create Task 
// Requires body.parentListId, body.taskName
const createTask = async (req, res, next) => {
    try {
        const userId = req.user;
        const parentListId = req.body.parentListId;
        const taskName = req.body.taskName;
        // MAKE SURE LIST BELOGS TO USER id (list.owner_id == userid);
        const checkOwnerQuery = await pool_1.default.query('SELECT owner_id FROM lists WHERE id = $1', [parentListId]);
        const ownerOfList = checkOwnerQuery.rows[0].owner_id;
        if (ownerOfList !== userId) {
            throw new appError_1.AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissiosn to edit this account" }
            ]);
        }
        //// Query 
        const createTaskQuery = "INSERT INTO tasks (name, list_id, owner_id) VALUES ($1, $2, $3) RETURNING *";
        const createTaskValues = [taskName, parentListId, userId];
        const createTaskResult = await pool_1.default.query(createTaskQuery, createTaskValues);
        const newTask = createTaskResult.rows[0];
        // Respond
        res.status(201).json({
            success: true, // Indicate the success of the operation
            message: "Task creared sucesfully", // The success message
            data: newTask
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.createTask = createTask;
// Read Task -- Maybe not needed
const readTask = async (req, res) => {
    res.send("Reading task");
};
exports.readTask = readTask;
// Update Task Needs; Name, dexceription, duedate, completed, important
const updateTask = async (req, res, next) => {
    try {
        // Make sure owner owns this task;
        const userId = req.user;
        const taskId = req.body.taskId;
        // Fetch the task's owner_id
        const taskOwnerQuery = 'SELECT owner_id FROM tasks WHERE id = $1';
        const taskOwnerResult = await pool_1.default.query(taskOwnerQuery, [taskId]);
        // If no task is found or the user is not the owner, return an error
        if (taskOwnerResult.rows.length === 0 || taskOwnerResult.rows[0].owner_id !== userId) {
            throw new appError_1.AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissiosn to edit this account" }
            ]);
        }
        const { newName, newDescription, newDueDate, newCompleted, newImportant } = req.body;
        const updates = [];
        const values = [];
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
            throw new appError_1.AppError(403, "No updated have been given for this task", [
                { field: "Inputs", message: "No updated have been given for this task" }
            ]);
            // return res.status(400).json({ success: false, message: "No fields provided for update" });
        }
        // Push taskId at the end with the correct index
        values.push(taskId);
        const updateListQuery = `UPDATE tasks SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`;
        const result = await pool_1.default.query(updateListQuery, values);
        res.status(200).json({ success: true, updatedTask: result.rows[0] });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.updateTask = updateTask;
// Delete Task
const deleteTask = async (req, res, next) => {
    try {
        const userId = req.user;
        const taskId = req.body.taskId;
        // Make sure task is owned by user
        const taskResult = await pool_1.default.query('SELECT owner_id FROM tasks WHERE id = $1', [taskId]);
        // If task doesnt exists; 
        if (!taskResult.rows[0].owner_id) {
            throw new appError_1.AppError(404, "Task doesnt exist", [
                { field: "Bad request", message: "Task doesnt exist" }
            ]);
        }
        const ownerId = taskResult.rows[0]?.owner_id;
        if (ownerId !== userId) {
            throw new appError_1.AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissiosn to edit this account" }
            ]);
        }
        await pool_1.default.query("DELETE FROM tasks WHERE id = $1", [taskId]);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map