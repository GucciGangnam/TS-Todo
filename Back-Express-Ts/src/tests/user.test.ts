import request from 'supertest';
import { app } from '../index';
import pool from "../database/pool";


describe('POST /api/users', () => {

    // Clear users before all tests in this block
    beforeAll(async () => {
        await pool.query("DELETE FROM users");
    });



    // TEST 1: A new user successfully creates an account
    it('should create a new user successfully', async () => {

        const newUser = {
            name: 'Test User',
            email: 'johndoe@example.com',
            password: 'Password123'
        };

        // Make the POST request to create a user
        const response = await request(app).post('/api/users').send(newUser);

        // Check the response
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(newUser.name);
        expect(response.body.data.email).toBe(newUser.email);

        // Check the database to verify the user was created
        const dbResponse = await pool.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
        expect(dbResponse.rows.length).toBe(1);  // Ensure exactly one user is in the database
        expect(dbResponse.rows[0].name).toBe(newUser.name);
        expect(dbResponse.rows[0].email).toBe(newUser.email);
    });



    // TEST 2: A user inputs bad validation (e.g., password too short)
    it('should return validation error for short password and not add user to the database', async () => {
        const newUser = {
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: '123'
        };

        // Get the user count before the request
        const initialCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const initialCount = parseInt(initialCountResult.rows[0].count);

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                msg: 'Password must be at least 8 characters long',
                path: 'password' // Changed 'param' to 'path'
            }),
            expect.objectContaining({
                msg: 'Password must contain at least one uppercase letter and one number',
                path: 'password' // Changed 'param' to 'path'
            })
        ]));

        // Get the user count after the request
        const finalCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const finalCount = parseInt(finalCountResult.rows[0].count);

        // Assert that the user count hasn't changed
        expect(finalCount).toBe(initialCount);
    });



    // TEST 3: A user tries to sign up with an email already in use
    it('should return error if email is already in use and not add duplicate user', async () => {
        const existingUser = {
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'ExistingPassword123'
        };

        // First, create the user
        await request(app).post('/api/users').send(existingUser);

        // Get the user count before trying to create the duplicate user
        const initialCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const initialCount = parseInt(initialCountResult.rows[0].count);

        // Now try to sign up with the same email
        const response = await request(app).post('/api/users').send(existingUser);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('This email is already in use');

        // Get the user count after attempting to create the duplicate user
        const finalCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const finalCount = parseInt(finalCountResult.rows[0].count);

        // Assert that the user count hasn't changed
        expect(finalCount).toBe(initialCount);
    });



});

describe('DELETE /api/user', () => {

    let authToken: string;
    let parentListId: string;
    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');
        // Create new user
        const newUserBody = {
            name: 'Test Delete',
            email: 'test@example.com',
            password: 'Password123'
        };
        await request(app).post('/api/users').send(newUserBody);
        // log the user in and get jwt 
        const loginBody = {
            email: 'test@example.com',
            password: 'Password123'
        }
        const loginResponse = await request(app).post('/api/auth/login').send(loginBody);
        authToken = loginResponse.body.userData.authToken;
        // Create new list for user 
        const newList = await request(app).post('/api/lists').set('Authorization', `Bearer ${authToken}`).send({ listName: 'New List' });
        parentListId = newList.body.data.id;
        // Create 2 new tasks for that list
        const newTask1 = await request(app).post('/api/tasks').set('Authorization', `Bearer ${authToken}`).send({ taskName: 'New Task1', parentListId: parentListId });
        const newTask2 = await request(app).post('/api/tasks').set('Authorization', `Bearer ${authToken}`).send({ taskName: 'New Task2', parentListId: parentListId });


    });

    it('Should sucesfully delete the user and all their lists and tasks from the database', async () => {
        const response = await request(app)
            .delete('/api/users')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("User deleted successfully")
        const usersInDB = await pool.query("SELECT * FROM users")
        expect(usersInDB.rows.length).toBe(0);
        const listsInDb = await pool.query("SELECT * FROM lists");
        expect(listsInDb.rows.length).toBe(0);
        const tasksInDb = await pool.query("SELECT * FROM tasks");
        expect(tasksInDb.rows.length).toBe(0);
    });
})

