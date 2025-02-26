"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.readUser = exports.createUserHandler = void 0;
var express_validator_1 = require("express-validator");
var appError_1 = require("../utils/appError");
var pool_1 = __importDefault(require("../database/pool"));
var bcrypt = require('bcrypt');
// CONTROLLER //
// Create User 
exports.createUserHandler = [
    // Validation middleware
    (0, express_validator_1.body)('name')
        .trim() // Trim spaces
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    (0, express_validator_1.body)('email')
        .trim() // Trim spaces
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(), // Optionally normalize the email
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter and one number'),
    function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var errors, query1, existingEmail, _a, name_1, email, password, hashedPassword, query2, result, newUser, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    errors = (0, express_validator_1.validationResult)(req);
                    if (!errors.isEmpty()) {
                        res.status(400).json({
                            success: false,
                            message: "Validation error",
                            errors: errors.array(),
                        });
                        return [2 /*return*/];
                    }
                    ;
                    query1 = 'SELECT * FROM users WHERE email = $1';
                    return [4 /*yield*/, pool_1.default.query(query1, [req.body.email])];
                case 1:
                    existingEmail = _b.sent();
                    if (existingEmail.rows.length > 0) {
                        throw new appError_1.AppError(409, "This email is already in use", [
                            { field: "email", message: "This email is already in use" }
                        ]);
                    }
                    _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 2:
                    hashedPassword = _b.sent();
                    query2 = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, name, email';
                    return [4 /*yield*/, pool_1.default.query(query2, [name_1, email, hashedPassword])];
                case 3:
                    result = _b.sent();
                    newUser = result.rows[0];
                    // Respond
                    res.status(201).json({
                        success: true, // Indicate the success of the operation
                        message: "User created successfully", // The success message
                        data: newUser
                    });
                    return [2 /*return*/];
                case 4:
                    err_1 = _b.sent();
                    next(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }
];
// Read User // This is donr at login. - NOT NEEDED
var readUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Reading user");
        return [2 /*return*/];
    });
}); };
exports.readUser = readUser;
// Update user -- Maybe dont bopther implementing
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Updating user");
        return [2 /*return*/];
    });
}); };
exports.updateUser = updateUser;
// Delete User - Requires authentification
var deleteUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, deleteUserQuery, deleteUserValues, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user;
                deleteUserQuery = "DELETE FROM users WHERE id = $1";
                deleteUserValues = [userId];
                return [4 /*yield*/, pool_1.default.query(deleteUserQuery, deleteUserValues)];
            case 1:
                _a.sent();
                // Response 
                res.status(200).json({ success: true, message: "User deleted successfully" });
                return [2 /*return*/];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
