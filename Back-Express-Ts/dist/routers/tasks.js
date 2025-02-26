"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
var express_1 = __importDefault(require("express"));
var taskController_1 = require("../controllers/taskController");
var authController_1 = require("../controllers/authController");
var tasksRouer = express_1.default.Router();
// ROUTES //
// GET 
tasksRouer.get("/", taskController_1.readTask);
// POST
tasksRouer.post("/", authController_1.authenticateUser, taskController_1.createTask);
// PUT 
tasksRouer.put("/", authController_1.authenticateUser, taskController_1.updateTask);
// DELETE 
tasksRouer.delete("/", authController_1.authenticateUser, taskController_1.deleteTask);
// EXPORTS
exports.default = tasksRouer;
