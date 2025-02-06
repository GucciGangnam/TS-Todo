"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
var express_1 = __importDefault(require("express"));
var taskController_1 = require("../controllers/taskController");
var tasksRouer = express_1.default.Router();
// ROUTES //
// GET 
tasksRouer.get("/", taskController_1.readTask);
// POST
tasksRouer.post("/", taskController_1.createTask);
// PUT 
tasksRouer.put("/", taskController_1.updateTask);
// DELETE 
tasksRouer.delete("/", taskController_1.deleteTask);
// EXPORTS
exports.default = tasksRouer;
