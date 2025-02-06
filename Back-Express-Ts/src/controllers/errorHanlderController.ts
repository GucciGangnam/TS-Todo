// Global Error Handler middlewear

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
    });
};