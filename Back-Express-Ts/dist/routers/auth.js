"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../controllers/authController");
var authRouter = express_1.default.Router();
// Routes 
authRouter.post("/login", authController_1.loginUser);
exports.default = authRouter;
