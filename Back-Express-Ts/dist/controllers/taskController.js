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
exports.deleteTask = exports.updateTask = exports.readTask = exports.createTask = void 0;
var pool_1 = __importDefault(require("../database/pool"));
var appError_1 = require("../utils/appError");
// CONTROLLER //
// Create Task 
// Requires body.parentListId, body.taskName
var createTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parentListId, taskName, checkOwnerQuery, ownerOfList, createTaskQuery, createTaskValues, createTaskResult, newTask, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user;
                parentListId = req.body.parentListId;
                taskName = req.body.taskName;
                return [4 /*yield*/, pool_1.default.query('SELECT owner_id FROM lists WHERE id = $1', [parentListId])];
            case 1:
                checkOwnerQuery = _a.sent();
                ownerOfList = checkOwnerQuery.rows[0].owner_id;
                if (ownerOfList !== userId) {
                    throw new appError_1.AppError(403, "NO permissions for this account", [
                        { field: "authentication", message: "NO permissiosn to edit this account" }
                    ]);
                }
                createTaskQuery = "INSERT INTO tasks (name, list_id, owner_id) VALUES ($1, $2, $3) RETURNING *";
                createTaskValues = [taskName, parentListId, userId];
                return [4 /*yield*/, pool_1.default.query(createTaskQuery, createTaskValues)];
            case 2:
                createTaskResult = _a.sent();
                newTask = createTaskResult.rows[0];
                // Respond
                res.status(201).json({
                    success: true, // Indicate the success of the operation
                    message: "Task creared sucesfully", // The success message
                    data: newTask
                });
                return [2 /*return*/];
            case 3:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createTask = createTask;
// Read Task -- Maybe not needed
var readTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Reading task");
        return [2 /*return*/];
    });
}); };
exports.readTask = readTask;
// Update Task Needs; Name, dexceription, duedate, completed, important
var updateTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, taskId, taskOwnerQuery, taskOwnerResult, _a, newName, newDescription, newDueDate, newCompleted, newImportant, updates, values, index, updateListQuery, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = req.user;
                taskId = req.body.taskId;
                taskOwnerQuery = 'SELECT owner_id FROM tasks WHERE id = $1';
                return [4 /*yield*/, pool_1.default.query(taskOwnerQuery, [taskId])];
            case 1:
                taskOwnerResult = _b.sent();
                // If no task is found or the user is not the owner, return an error
                if (taskOwnerResult.rows.length === 0 || taskOwnerResult.rows[0].owner_id !== userId) {
                    throw new appError_1.AppError(403, "NO permissions for this account", [
                        { field: "authentication", message: "NO permissiosn to edit this account" }
                    ]);
                }
                _a = req.body, newName = _a.newName, newDescription = _a.newDescription, newDueDate = _a.newDueDate, newCompleted = _a.newCompleted, newImportant = _a.newImportant;
                updates = [];
                values = [];
                index = 1;
                if (newName !== undefined) {
                    updates.push("name = $".concat(index));
                    values.push(newName);
                    index++;
                }
                if (newDescription !== undefined) {
                    updates.push("description = $".concat(index));
                    values.push(newDescription);
                    index++;
                }
                if (newDueDate !== undefined) {
                    updates.push("due_date = $".concat(index));
                    values.push(newDueDate);
                    index++;
                }
                if (newCompleted !== undefined) {
                    updates.push("completed = $".concat(index));
                    values.push(newCompleted);
                    index++;
                }
                if (newImportant !== undefined) {
                    updates.push("important = $".concat(index));
                    values.push(newImportant);
                    index++;
                }
                if (updates.length === 0) {
                    throw new appError_1.AppError(403, "No updated have been given for this task", [
                        { field: "Inputs", message: "No updated have been given for this task" }
                    ]);
                    // return res.status(400).json({ success: false, message: "No fields provided for update" });
                }
                // Push taskId at the end with the correct index
                values.push(taskId);
                updateListQuery = "UPDATE tasks SET ".concat(updates.join(", "), " WHERE id = $").concat(index, " RETURNING *");
                return [4 /*yield*/, pool_1.default.query(updateListQuery, values)];
            case 2:
                result = _b.sent();
                res.status(200).json({ success: true, updatedTask: result.rows[0] });
                return [2 /*return*/];
            case 3:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTask = updateTask;
// Delete Task
var deleteTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, taskId, taskResult, ownerId, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = req.user;
                taskId = req.body.taskId;
                return [4 /*yield*/, pool_1.default.query('SELECT owner_id FROM tasks WHERE id = $1', [taskId])];
            case 1:
                taskResult = _b.sent();
                // If task doesnt exists; 
                if (!taskResult.rows[0].owner_id) {
                    throw new appError_1.AppError(404, "Task doesnt exist", [
                        { field: "Bad request", message: "Task doesnt exist" }
                    ]);
                }
                ownerId = (_a = taskResult.rows[0]) === null || _a === void 0 ? void 0 : _a.owner_id;
                if (ownerId !== userId) {
                    throw new appError_1.AppError(403, "NO permissions for this account", [
                        { field: "authentication", message: "NO permissiosn to edit this account" }
                    ]);
                }
                return [4 /*yield*/, pool_1.default.query("DELETE FROM tasks WHERE id = $1", [taskId])];
            case 2:
                _b.sent();
                res.status(200).json({ success: true, message: "Task deleted successfully" });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteTask = deleteTask;
