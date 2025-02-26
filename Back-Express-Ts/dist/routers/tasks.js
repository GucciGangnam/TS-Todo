"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authController_1 = require("../controllers/authController");
const tasksRouer = express_1.default.Router();
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
//# sourceMappingURL=tasks.js.map