"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("../controllers/userController");
var authController_1 = require("../controllers/authController");
var userRouter = express_1.default.Router();
// ROUTES //
// GET 
userRouter.get("/", authController_1.authenticateUser, userController_1.readUser);
// POST
userRouter.post("/", userController_1.createUserHandler);
// PUT 
userRouter.put("/", authController_1.authenticateUser, userController_1.updateUser);
// DELETE 
userRouter.delete("/", authController_1.authenticateUser, userController_1.deleteUser);
// EXPORT
exports.default = userRouter;
