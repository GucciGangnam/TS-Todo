"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.readUser = exports.createUserHandler = void 0;
const { body, validationResult } = require('express-validator');
const appError_1 = require("../utils/appError");
const pool_1 = __importDefault(require("../database/pool"));
const bcrypt = require('bcrypt');
// CONTROLLER //
// Create User 
exports.createUserHandler = [
    // Validation middleware
    body('name')
        .trim() // Trim spaces
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
        .trim() // Trim spaces
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(), // Optionally normalize the email
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter and one number'),
    async (req, res, next) => {
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
            }
            ;
            // Ensure email isnt already in use
            const query1 = 'SELECT * FROM users WHERE email = $1';
            const existingEmail = await pool_1.default.query(query1, [req.body.email]);
            if (existingEmail.rows.length > 0) {
                throw new appError_1.AppError(409, "This email is already in use", [
                    { field: "email", message: "This email is already in use" }
                ]);
            }
            const { name, email, password } = req.body;
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert user into the database
            const query2 = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, name, email';
            const result = await pool_1.default.query(query2, [name, email, hashedPassword]);
            const newUser = result.rows[0];
            // Respond
            res.status(201).json({
                success: true, // Indicate the success of the operation
                message: "User created successfully", // The success message
                data: newUser
            });
            return;
        }
        catch (err) {
            next(err);
        }
    }
];
// Read User // This is donr at login. - NOT NEEDED
const readUser = async (req, res) => {
    res.send("Reading user");
};
exports.readUser = readUser;
// Update user -- Maybe dont bopther implementing
const updateUser = async (req, res) => {
    res.send("Updating user");
};
exports.updateUser = updateUser;
// Delete User - Requires authentification
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user;
        const deleteUserQuery = "DELETE FROM users WHERE id = $1";
        const deleteUserValues = [userId];
        await pool_1.default.query(deleteUserQuery, deleteUserValues);
        // Response 
        res.status(200).json({ success: true, message: "User deleted successfully" });
        return;
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map