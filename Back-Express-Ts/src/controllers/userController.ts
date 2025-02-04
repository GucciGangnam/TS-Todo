// IMPORTS 
import { Request, Response } from "express";


// CONTROLLER //
// Create User 
export const createUser = async (req: Request, res: Response) => {
    console.log("Creating user")
    res.send("Creating user")
}

// Read User 
export const readUser = async (req: Request, res: Response) => {
    console.log("Reading user")
    res.send("Reading user")
}

// Update user 
export const updateUser = async (req: Request, res: Response) => { 
    console.log("Updating user")
    res.send("Updating user")
}

// Delete User
export const deleteUser = async (req: Request, res: Response) => { 
    console.log("Deleting user")
    res.send("Deleting user")
}