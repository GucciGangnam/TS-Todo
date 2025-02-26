"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.loginUser = void 0;
const appError_1 = require("../utils/appError");
const pool_1 = __importDefault(require("../database/pool"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// LOG IN USER
const loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // Check that email is associated
        const userExists = await pool_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length < 1) {
            throw new appError_1.AppError(401, "Invalid login credentials", [
                { field: "login", message: "Invalid login credentials" }
            ]);
        }
        const user = userExists.rows[0];
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (isMatch) {
            // Create JWT 
            const jwtSecret = process.env.JWT_SECRET;
            const payload = {
                userId: user.id
            };
            // Create a JWT
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Expiration time 1 hour
            // Get user Object ;
            const userDataQuery = "SELECT name, email FROM users WHERE email = $1";
            const userDataValues = [email];
            const userData = await pool_1.default.query(userDataQuery, userDataValues);
            // user data is userData.rows[0] // // // // /// /// // /// // /// / /// / /  
            // Get lists object ;
            const listsDataQuery = `
            SELECT l.id, 
                   COALESCE(l.name, '') AS name, 
                   COALESCE(l.color, '') AS color, 
                   l.created_at,
                   COUNT(t.id) AS task_count
            FROM lists l
            LEFT JOIN tasks t ON l.id = t.list_id
            WHERE l.owner_id = $1
            GROUP BY l.id, l.name, l.color, l.created_at;
        `;
            const listsDataValue = [user.id];
            const listsData = await pool_1.default.query(listsDataQuery, listsDataValue);
            // Get tasks object ;
            const taskDataQuery = 'SELECT * FROM tasks WHERE list_id = ANY (SELECT id FROM lists WHERE owner_id = $1)';
            const taskDataValue = [user.id];
            const tasksData = await pool_1.default.query(taskDataQuery, taskDataValue);
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
        }
        else {
            throw new appError_1.AppError(401, "Invalid login credentials", [
                { field: "login", message: "Invalid login credentials" }
            ]);
        }
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;
// Authentication middlewear
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new appError_1.AppError(403, "Invalid access token", [
                { field: "authentication", message: "Invalid access token" }
            ]);
        }
        const jwtSecret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.userId;
        next();
    }
    catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(err);
        }
        next(err);
    }
};
exports.authenticateUser = authenticateUser;
// Log Out
//# sourceMappingURL=authController.js.map