// src/types/express-extensions.d.ts
import express from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: string; // Adjust the type as needed
    }
}