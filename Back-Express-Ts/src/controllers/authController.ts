// IMPORTS 
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import pool from "../database/pool";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOG IN USER
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check that email is associated
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (userExists.rows.length < 1) {
            throw new AppError(409, "Invalid login credentials", [
                { field: "login", message: "Invalid login credentials" }
            ]);
        }

        const user = userExists.rows[0];
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (isMatch) {
            // Create JWT 
            const jwtSecret = process.env.JWT_SECRET;
            const payload = {
                userId: user.id,  // Add user info you want to include in the token
            };
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });  // Expiration time 1 hour
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token
                }
            });
            return;
        } else {
            throw new AppError(409, "Invalid login credentials", [
                { field: "login", message: "Invalid login credentials" }
            ]);
        }
    } catch (err) {
        next(err);
    }
}

// Authentication middlewear
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

}

// Log Out

