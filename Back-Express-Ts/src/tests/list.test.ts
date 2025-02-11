import request from 'supertest';
import { app } from '../index';
import pool from "../database/pool";


describe('POST /api/lists', () => {

    let authToken: string;

    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');

        const newUserBody = {
            name: 'Test List',
            email: 'testlist@example.com',
            password: 'Password123'
        };
        // Make the POST request to create a user
        await request(app).post('/api/users').send(newUserBody);
        // log the user in and get jwt 

        const loginBody = {
            email: 'testlist@example.com',
            password: 'Password123'
        }
        const loginResponse = await request(app).post('/api/auth/login').send(loginBody);
        authToken = loginResponse.body.userData.authToken;

    });

    // THEN - make a post to lists and see if it sucesful - THEN fetch data from DB an ensure its there
    it('should create a new list when authenticated', async () => {
        const response = await request(app)
            .post('/api/lists')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ listName: 'New List' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('New List');

        // Query the database to confirm the list exists
        const dbResult = await pool.query('SELECT * FROM lists WHERE name = $1', ['New List']);
        expect(dbResult.rows.length).toBe(1);
        expect(dbResult.rows[0].name).toBe('New List');
    });

});


describe('PUT .api/lists', () => {

    // Before each // Clear DB
    let authToken: string;
    let parentListId: string;
    let taskId: string;
    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');
        const newUserBody = {
            name: 'Test Update List',
            email: 'testlist@example.com',
            password: 'Password123'
        };
        // Make the POST request to create a user
        await request(app).post('/api/users').send(newUserBody);
        // log the normal user in and get jwt 
        const loginBody = {
            email: 'testlist@example.com',
            password: 'Password123'
        };
        const loginResponse = await request(app).post('/api/auth/login').send(loginBody);
        authToken = loginResponse.body.userData.authToken;
        // Ceeate new list for user
        const newList = await request(app).post('/api/lists').set('Authorization', `Bearer ${authToken}`).send({ listName: 'New List' });
        parentListId = newList.body.data.id;
        // Create new task for user
        const newTask = await request(app).post('/api/tasks').set('Authorization', `Bearer ${authToken}`).send({ taskName: 'New Task', parentListId: parentListId });
        taskId = newTask.body.data.id;
    });

    it('Should update the color of the list to blue', async () => {
        const response = await request(app)
            .put('/api/lists')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ listId: parentListId, newColor: "Blue" });

        expect(response.status).toBe(200);
        expect(response.body.data.color).toBe('Blue');
    })



})