"use strict";
// Global Error Handler middlewear
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.error(err);
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHanlderController.js.map