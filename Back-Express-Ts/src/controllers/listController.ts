// IMPORTS 
import { Request, Response, NextFunction } from "express";
import pool from "../database/pool";
import { AppError } from "../utils/appError";


// CONTROLLER //
// Create List
export const createList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user;
        const listName = req.body.listName;

        if(!listName){ 
            throw new AppError(400, "list name not provided", [
                { field: "Input", message: "list name not provided" }
            ]);
        }

        const query1 = 'INSERT INTO lists (name, color, owner_id) VALUES ($1, $2, $3) RETURNING *';
        const result1 = await pool.query(query1, [listName, 'element-fill', userId])
        const newList = result1.rows[0];
        // Respond
        res.status(201).json({
            success: true,  // Indicate the success of the operation
            message: "List creared sucesfully",  // The success message
            data: newList
        });
        return;
    } catch (err) {
        next(err);
    }
}

// Read List - Maybe not needed
export const readList = async (req: Request, res: Response) => {
    res.json("Reading list")
}

// Update List - REQUIRES: listId
export const updateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user;
        const { listId, newColor, newName } = req.body;
        // Ensure listId and newColor are provided
        if (!listId) {
            throw new AppError(403, "List ID required", [
                { field: "Inputs", message: "List ID and color are required" }
            ]);
        }
        // Check if list exists and belongs to user
        const listResult = await pool.query("SELECT owner_id FROM lists WHERE id = $1", [listId]);
        if (listResult.rows.length === 0) {
            throw new AppError(404, "List not found", [
                { field: "Not found", message: "List not found" }
            ]);
        }
        if (listResult.rows[0].owner_id !== userId) {
            throw new AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissions to edit this account" }
            ]);
        }
        // Update the newColor and newName if provided
        if (newColor) {
            await pool.query("UPDATE lists SET color = $1 WHERE id = $2", [newColor, listId]);
        }
        if (newName) {
            await pool.query("UPDATE lists SET name = $1 WHERE id = $2", [newName, listId]);
        }
        // Respond
        res.status(200).json({
            success: true,
            message: "List updated successfully",
        });

    } catch (err) {
        next(err);
    }
};

// Delete List
export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user;
        const listToDelete = req.body.listId;
        if (!listToDelete) {
            throw new AppError(404, "List ID is missing", [
                { field: "input", message: "List ID is missing" }
            ]);
        }
        // Check user owns teh list
        const result1 = await pool.query('SELECT owner_id FROM lists WHERE id = $1', [listToDelete]);
        const ownerOfList = result1.rows[0].owner_id;
        if (ownerOfList !== userId) {
            throw new AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissions to edit this account" }
            ]);
        }
        // Delete list
        await pool.query("DELETE FROM lists WHERE id = $1", [listToDelete]);
        res.status(200).json({ success: true, message: "List deleted successfully" });

    } catch (err) {
        next(err);
    }
}