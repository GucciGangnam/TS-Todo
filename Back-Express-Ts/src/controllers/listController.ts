// IMPORTS 
import { Request, Response, NextFunction } from "express";
import pool from "../database/pool";


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

// Read List 
export const readList = async (req: Request, res: Response) => {
    console.log("Reading list")
    res.send("Reading list")
}

// Update List 
export const updateList = async (req: Request, res: Response) => {
    console.log("Updating list")
    res.send("Updating list")
}

// Delete List
export const deleteList = async (req: Request, res: Response) => {
    console.log("Deleting list")
    res.send("Deleting list")
}