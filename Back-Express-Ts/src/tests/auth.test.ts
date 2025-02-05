import request from 'supertest';
import { app } from '../index';
import pool from "../database/pool";
const bcrypt = require('bcrypt');

describe('POST /api/auth/login', () => {

    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');

        // Create test user
        const newUser = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'Password123',
        };

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        // Insert user into the database
        await pool.query(
            'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3)',
            [newUser.name, newUser.email, hashedPassword]
        );
    });



    // TEST 1: Login with valid credentials (user already created)
    it('should login user and return JWT', async () => {
        const loginUser = {
            email: 'johndoe@example.com',
            password: 'Password123',
        };

        // Make the POST request to login
        const loginResponse = await request(app).post('/api/auth/login').send(loginUser);

        // Check the response
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.success).toBe(true);
        expect(loginResponse.body.message).toBe('Login successful');
        expect(loginResponse.body.data).toHaveProperty('token');
    });



    // TEST 2: Login with invalid credentials
    it('should return an error for invalid login credentials', async () => {
        const loginUser = {
            email: 'wrongemail@example.com',
            password: 'Password123',
        };
        // Make the POST request to login
        const loginResponse = await request(app).post('/api/auth/login').send(loginUser);
        // Check the response for an error
        expect(loginResponse.status).toBe(409);  // Conflict error since credentials don't match
        expect(loginResponse.body.success).toBe(false);
        expect(loginResponse.body.message).toBe('Invalid login credentials');
    });
});