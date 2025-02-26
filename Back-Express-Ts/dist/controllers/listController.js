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
exports.deleteList = exports.updateList = exports.readList = exports.createList = void 0;
var pool_1 = __importDefault(require("../database/pool"));
var appError_1 = require("../utils/appError");
// CONTROLLER //
// Create List
var createList = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, listName, query1, result1, newList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user;
                listName = req.body.listName;
                if (!listName) {
                    throw new appError_1.AppError(400, "list name not provided", [
                        { field: "Input", message: "list name not provided" }
                    ]);
                }
                query1 = 'INSERT INTO lists (name, color, owner_id) VALUES ($1, $2, $3) RETURNING *';
                return [4 /*yield*/, pool_1.default.query(query1, [listName, 'element-fill', userId])];
            case 1:
                result1 = _a.sent();
                newList = result1.rows[0];
                // Respond
                res.status(201).json({
                    success: true, // Indicate the success of the operation
                    message: "List creared sucesfully", // The success message
                    data: newList
                });
                return [2 /*return*/];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createList = createList;
// Read List - Maybe not needed
var readList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json("Reading list");
        return [2 /*return*/];
    });
}); };
exports.readList = readList;
// Update List - REQUIRES: listId
var updateList = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, listId, newColor, newName, listResult, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                userId = req.user;
                _a = req.body, listId = _a.listId, newColor = _a.newColor, newName = _a.newName;
                // Ensure listId and newColor are provided
                if (!listId) {
                    throw new appError_1.AppError(403, "List ID required", [
                        { field: "Inputs", message: "List ID and color are required" }
                    ]);
                }
                return [4 /*yield*/, pool_1.default.query("SELECT owner_id FROM lists WHERE id = $1", [listId])];
            case 1:
                listResult = _b.sent();
                if (listResult.rows.length === 0) {
                    throw new appError_1.AppError(404, "List not found", [
                        { field: "Not found", message: "List not found" }
                    ]);
                }
                if (listResult.rows[0].owner_id !== userId) {
                    throw new appError_1.AppError(403, "NO permissions for this account", [
                        { field: "authentication", message: "NO permissions to edit this account" }
                    ]);
                }
                if (!newColor) return [3 /*break*/, 3];
                return [4 /*yield*/, pool_1.default.query("UPDATE lists SET color = $1 WHERE id = $2", [newColor, listId])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                if (!newName) return [3 /*break*/, 5];
                return [4 /*yield*/, pool_1.default.query("UPDATE lists SET name = $1 WHERE id = $2", [newName, listId])];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                // Respond
                res.status(200).json({
                    success: true,
                    message: "List updated successfully",
                });
                return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateList = updateList;
// Delete List
var deleteList = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, listToDelete, result1, ownerOfList, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user;
                listToDelete = req.body.listId;
                if (!listToDelete) {
                    throw new appError_1.AppError(404, "List ID is missing", [
                        { field: "input", message: "List ID is missing" }
                    ]);
                }
                return [4 /*yield*/, pool_1.default.query('SELECT owner_id FROM lists WHERE id = $1', [listToDelete])];
            case 1:
                result1 = _a.sent();
                ownerOfList = result1.rows[0].owner_id;
                if (ownerOfList !== userId) {
                    throw new appError_1.AppError(403, "NO permissions for this account", [
                        { field: "authentication", message: "NO permissions to edit this account" }
                    ]);
                }
                // Delete list
                return [4 /*yield*/, pool_1.default.query("DELETE FROM lists WHERE id = $1", [listToDelete])];
            case 2:
                // Delete list
                _a.sent();
                res.status(200).json({ success: true, message: "List deleted successfully" });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteList = deleteList;
