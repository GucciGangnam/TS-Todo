"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
// Routes
var users_1 = __importDefault(require("./routers/users"));
var lists_1 = __importDefault(require("./routers/lists"));
var tasks_1 = __importDefault(require("./routers/tasks"));
var auth_1 = __importDefault(require("./routers/auth"));
// Global error handler
var errorHanlderController_1 = require("./controllers/errorHanlderController");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/users", users_1.default);
exports.app.use("/api/lists", lists_1.default);
exports.app.use("/api/tasks", tasks_1.default);
exports.app.use("/api/auth", auth_1.default);
// Trailing error handler
exports.app.use(errorHanlderController_1.errorHandler);
var PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    exports.app.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
}
