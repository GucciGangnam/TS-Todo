"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
// Load the correct environment variables based on NODE_ENV
dotenv_1.default.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.connect()
    .then(function () { return console.log("Connected to PostgreSQL"); })
    .catch(function (err) { return console.error("Connection error", err); });
exports.default = pool;
