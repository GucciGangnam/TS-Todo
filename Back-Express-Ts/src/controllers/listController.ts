// IMPORTS 
import { Request, Response, NextFunction } from "express";
import pool from "../database/pool";
import { AppError } from "../utils/appError";


// CONTROLLER //
// Create List
export const createList = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating list");
    try {
        const userId = req.user;
        const listName = req.body.listName;

        const query1 = 'INSERT INTO lists (name, color, owner_id) VALUES ($1, $2, $3) RETURNING *';
        const result1 = await pool.query(query1, [listName, 'default', userId])
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
    console.log("Reading list")
    res.send("Reading list")
}

// Update List - REQUIRES: listId
export const updateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
console.log("starting UpdateList", req.body.listId, req.body.newColor)
        const userId = req.user;
        const { listId, newColor } = req.body;
        console.log(listId, newColor)
        // Ensure listId and newColor are provided
        if (!listId || !newColor) {
            throw new AppError(403, "List ID and color are required", [
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
            console.log(listResult.rows[0].owner_id);
            console.log(userId);
            throw new AppError(403, "NO permissions for this account", [
                { field: "authentication", message: "NO permissions to edit this account" }
            ]);
        }
        // Update color
        const result = await pool.query(
            "UPDATE lists SET color = $1 WHERE id = $2 RETURNING *",
            [newColor, listId]
        );
        res.status(200).json({
            status: 200,
            message: "List updated successfully",
            data: result.rows[0],
        });
    } catch (err) {
        next(err);
    }
};

// Delete List
export const deleteList = async (req: Request, res: Response) => {
    console.log("Deleting list")
    res.send("Deleting list")
}