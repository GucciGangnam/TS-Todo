// IMPORTS 
import { Request, Response, NextFunction, RequestHandler } from "express";
const { body, validationResult } = require('express-validator');
import { AppError } from "../utils/appError";
import pool from "../database/pool";

const bcrypt = require('bcrypt');



// CONTROLLER //

// Create User 
export const createUserHandler: RequestHandler[] = [
    // Validation middleware
    body('name')
        .trim()  // Trim spaces
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
        .trim()  // Trim spaces
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(), // Optionally normalize the email
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter and one number'),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the inputs
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: errors.array(),
                });
                return;
            };
            // Ensure email isnt already in use
            const query1 = 'SELECT * FROM users WHERE email = $1';
            const existingEmail = await pool.query(query1, [req.body.email]);
            if (existingEmail.rows.length > 0) {
                throw new AppError(409, "This email is already in use", [
                    { field: "email", message: "This email is already in use" }
                ]);
            }

            const { name, email, password } = req.body;
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert user into the database
            const query2 = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, name, email';
            const result = await pool.query(query2, [name, email, hashedPassword]);
            const newUser = result.rows[0];

            // Respond
            res.status(201).json({
                success: true,  // Indicate the success of the operation
                message: "User created successfully",  // The success message
                data: newUser
            });
            return;
        } catch (err) {
            next(err);
        }
    }
]

// Read User // This is donr at login. - NOT NEEDED
export const readUser = async (req: Request, res: Response) => {
    res.send("Reading user")
}

// Update user -- Maybe dont bopther implementing
export const updateUser = async (req: Request, res: Response) => {
    res.send("Updating user")
}

// Delete User - Requires authentification
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user;
        const deleteUserQuery = "DELETE FROM users WHERE id = $1";
        const deleteUserValues = [userId];
        await pool.query(deleteUserQuery, deleteUserValues);
        // Response 
        res.status(200).json({ success: true, message: "User deleted successfully" });
        return;
    } catch (err) {
        next(err);
    }
}