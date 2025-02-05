import { Pool } from "pg";
import dotenv from "dotenv";


// Load the correct environment variables based on NODE_ENV
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err));

export default pool;