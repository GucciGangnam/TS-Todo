// IMPORTS 
import { Request, Response } from "express";


// CONTROLLER //
// Create User 
export const createList = async (req: Request, res: Response) => {
    console.log("Creating list")
    res.send("Creating list")
}

// Read User 
export const readList = async (req: Request, res: Response) => {
    console.log("Reading list")
    res.send("Reading list")
}

// Update user 
export const updateList = async (req: Request, res: Response) => { 
    console.log("Updating list")
    res.send("Updating list")
}

// Delete User
export const deleteList = async (req: Request, res: Response) => { 
    console.log("Deleting list")
    res.send("Deleting list")
}