"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const users_1 = __importDefault(require("./routers/users"));
const lists_1 = __importDefault(require("./routers/lists"));
const tasks_1 = __importDefault(require("./routers/tasks"));
const auth_1 = __importDefault(require("./routers/auth"));
// Global error handler
const errorHanlderController_1 = require("./controllers/errorHanlderController");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const allowedOrigin = process.env.FRONT_END_URL;
exports.app.use((0, cors_1.default)({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies/auth headers
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/users", users_1.default);
exports.app.use("/api/lists", lists_1.default);
exports.app.use("/api/tasks", tasks_1.default);
exports.app.use("/api/auth", auth_1.default);
// Trailing error handler
exports.app.use(errorHanlderController_1.errorHandler);
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    exports.app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
//# sourceMappingURL=index.js.map