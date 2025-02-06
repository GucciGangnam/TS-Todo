// types/express.d.ts
import * as express from "express";

declare module "express" {
    interface Request {
        user?: string; // Adjust based on how you store user info
    }
}

export { }; // Ensures TypeScript treats this as a module