// IMPORTS 
import { Request, Response } from "express";


// CONTROLLER //
// Create User 
export const createTask = async (req: Request, res: Response) => {
    console.log("Creating task")
    res.send("Creating task")
}

// Read User 
export const readTask = async (req: Request, res: Response) => {
    console.log("Reading task")
    res.send("Reading task")
}

// Update user 
export const updateTask = async (req: Request, res: Response) => { 
    console.log("Updating task")
    res.send("Updating task")
}

// Delete User
export const deleteTask = async (req: Request, res: Response) => { 
    console.log("Deleting task")
    res.send("Deleting task")
}