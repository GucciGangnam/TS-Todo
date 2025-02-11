import request from 'supertest';
import { app } from '../index';
import pool from '../database/pool';


// Post new task 
describe('POST /api/task', () => {

    // Before each // Clear DB
    let authToken: string;
    let authToken2: string;
    let parentListId: string;
    let parentListId2: string;
    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');
        const newUserBody = {
            name: 'Test Task',
            email: 'testtask@example.com',
            password: 'Password123'
        };
        const newUserBody2 = {
            name: 'Test Task Two',
            email: 'testtasktwo@example.com',
            password: 'Password123'
        };
        // Make the POST request to create a user
        await request(app).post('/api/users').send(newUserBody);
        await request(app).post('/api/users').send(newUserBody2);
        // log the normal user in and get jwt 
        const loginBody = {
            email: 'testtask@example.com',
            password: 'Password123'
        };
        const loginBody2 = {
            email: 'testtasktwo@example.com',
            password: 'Password123'
        }
        const loginResponse = await request(app).post('/api/auth/login').send(loginBody);
        const loginResponse2 = await request(app).post('/api/auth/login').send(loginBody2);
        authToken = loginResponse.body.userData.authToken;
        authToken2 = loginResponse2.body.userData.authToken;
        // CReate new list for users
        const newList = await request(app).post('/api/lists').set('Authorization', `Bearer ${authToken}`).send({ listName: 'New List' });
        parentListId = newList.body.data.id;
        const newList2 = await request(app).post('/api/lists').set('Authorization', `Bearer ${authToken2}`).send({ listName: 'New List2' });
        parentListId2 = newList2.body.data.id;

    });


    // Test tasks
    // Create task sucesfully
    it('should create a new task sucesfully and', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                taskName: 'New Task',
                parentListId: parentListId
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('New Task');

        // Query the database to confirm the list exists
        const dbResult = await pool.query('SELECT * FROM tasks WHERE name = $1', ['New Task']);
        expect(dbResult.rows.length).toBe(1);
        expect(dbResult.rows[0].name).toBe('New Task');
    });

    // user tries to add task to a list they dont own
    it('should not be able to pass in another useres parent list id', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                taskName: 'New Sneak Task',
                parentListId: parentListId2
            });
        expect(response.status).toBe(403);

        // Query the database to confirm the list exists
        const dbResult = await pool.query('SELECT * FROM tasks WHERE name = $1', ['New Sneak Task']);
        expect(dbResult.rows.length).toBe(0);
    });
});

// Update task 
describe('PUT/api/task', () => {

    // Before each // Clear DB
    let authToken: string;
    let parentListId: string;
    let taskId: string;
    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');
        const newUserBody = {
            name: 'Test Update Task',
            email: 'testtask@example.com',
            password: 'Password123'
        };
        // Make the POST request to create a user
        await request(app).post('/api/users').send(newUserBody);
        // log the normal user in and get jwt 
        const loginBody = {
            email: 'testtask@example.com',
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

    it('should sucesfully update all rows when all passed into the body', async () => {
        const timeNow = new Date();
        const response = await request(app)
            .put('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                taskId: taskId,
                newName: 'Updated Name',
                newDescription: "Updated Description",
                newDueDate: timeNow,
                newCompleted: true,
                newImportant: true,
            });
        expect(response.status).toBe(200);
        expect(response.body.updatedTask).toHaveProperty('id');
        expect(response.body.updatedTask.name).toBe('Updated Name');
    });

    it('should sucesfully update ONLY the fields that are passed in and not effect the others', async () => {
        const response = await request(app)
            .put('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                taskId: taskId,
                newName: 'Updated Name Only',
            });
        expect(response.status).toBe(200);
        expect(response.body.updatedTask).toHaveProperty('id');
        expect(response.body.updatedTask.name).toBe('Updated Name Only');
        expect(response.body.updatedTask.description).toBe('Updated Description');
    });
})

// Delete task
describe('DELETE /api/task', () => {

    // Before each // Clear DB // Make new task
    let authToken: string;
    let parentListId: string;
    let taskId: string;
    // Clear users before all tests in this block
    beforeAll(async () => {
        // Clear the users table to start fresh
        await pool.query('DELETE FROM users');
        const newUserBody = {
            name: 'Test Update Task',
            email: 'testtask@example.com',
            password: 'Password123'
        };
        // Make the POST request to create a user
        await request(app).post('/api/users').send(newUserBody);
        // log the normal user in and get jwt 
        const loginBody = {
            email: 'testtask@example.com',
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

    it('should sucesfully delete the task', async () => {
        const response = await request(app)
            .delete('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                taskId: taskId,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Task deleted successfully");
    });


})