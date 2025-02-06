"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS 
var express_1 = __importDefault(require("express"));
var listController_1 = require("../controllers/listController");
var listsRouter = express_1.default.Router();
// ROUTES //
// GET 
listsRouter.get("/", listController_1.readList);
// POST
listsRouter.post("/", listController_1.createList);
// PUT 
listsRouter.put("/", listController_1.updateList);
// DELETE 
listsRouter.delete("/", listController_1.deleteList);
// EXPORTS
exports.default = listsRouter;
