// IMPORTS 
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import pool from "../database/pool";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Types 
type UserPayload = {
    userId: string;
}

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
            const payload: UserPayload = {
                userId: user.id
            };
            // Create a JWT
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });  // Expiration time 1 hour
            // Get user Object ;
            const userDataQuery = "SELECT name, email FROM users WHERE email = $1"
            const userDataValues = [email]
            const userData = await pool.query(userDataQuery, userDataValues);
            // user data is userData.rows[0] // // // // /// /// // /// // /// / /// / /  
            // Get lists object ;
            const listsDataQuery = `SELECT l.id, 
       COALESCE(l.name, '') AS name, 
       COALESCE(l.color, '') AS color, 
       COUNT(t.id) AS task_count
FROM lists l
LEFT JOIN tasks t ON l.id = t.list_id
WHERE l.owner_id = $1
GROUP BY l.id, l.name, l.color;`;
            const listsDataValue = [user.id];
            const listsData = await pool.query(listsDataQuery, listsDataValue);
            // Get tasks object ;

            const taskDataQuery = 'SELECT * FROM tasks WHERE list_id = ANY (SELECT id FROM lists WHERE owner_id = $1)';
            const taskDataValue = [user.id];
            const tasksData = await pool.query(taskDataQuery, taskDataValue);



            res.status(200).json({
                success: true,
                message: "Login successful",
                userData: {
                    authToken: token,
                    user: userData.rows[0],
                    lists: listsData.rows,
                    tasks: tasksData.rows
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
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new AppError(403, "Invalid access token", [
                { field: "authentication", message: "Invalid access token" }
            ]);
        }
        const jwtSecret = process.env.JWT_SECRET;
        const decoded: UserPayload = jwt.verify(token, jwtSecret) as UserPayload;
        req.user = decoded.userId
        next();
    } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(err);
        }
        next(err);
    }
}

// Log Out

