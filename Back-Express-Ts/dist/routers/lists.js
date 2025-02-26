"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS 
var express_1 = __importDefault(require("express"));
var listController_1 = require("../controllers/listController");
var authController_1 = require("../controllers/authController");
var listsRouter = express_1.default.Router();
// ROUTES //
// GET 
listsRouter.get("/", listController_1.readList);
// POST
listsRouter.post("/", authController_1.authenticateUser, listController_1.createList);
// PUT 
listsRouter.put("/", authController_1.authenticateUser, listController_1.updateList);
// DELETE 
listsRouter.delete("/", authController_1.authenticateUser, listController_1.deleteList);
// EXPORTS
exports.default = listsRouter;
