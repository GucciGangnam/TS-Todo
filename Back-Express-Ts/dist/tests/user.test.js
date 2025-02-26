"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var index_1 = require("../index");
var pool_1 = __importDefault(require("../database/pool"));
describe('POST /api/users', function () {
    // Clear users before all tests in this block
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool_1.default.query("DELETE FROM users")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // TEST 1: A new user successfully creates an account
    it('should create a new user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser, response, dbResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        name: 'Test User',
                        email: 'johndoe@example.com',
                        password: 'Password123'
                    };
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(newUser)];
                case 1:
                    response = _a.sent();
                    // Check the response
                    expect(response.status).toBe(201);
                    expect(response.body.success).toBe(true);
                    expect(response.body.message).toBe('User created successfully');
                    expect(response.body.data).toHaveProperty('id');
                    expect(response.body.data.name).toBe(newUser.name);
                    expect(response.body.data.email).toBe(newUser.email);
                    return [4 /*yield*/, pool_1.default.query('SELECT * FROM users WHERE email = $1', [newUser.email])];
                case 2:
                    dbResponse = _a.sent();
                    expect(dbResponse.rows.length).toBe(1); // Ensure exactly one user is in the database
                    expect(dbResponse.rows[0].name).toBe(newUser.name);
                    expect(dbResponse.rows[0].email).toBe(newUser.email);
                    return [2 /*return*/];
            }
        });
    }); });
    // TEST 2: A user inputs bad validation (e.g., password too short)
    it('should return validation error for short password and not add user to the database', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser, initialCountResult, initialCount, response, finalCountResult, finalCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        name: 'Jane Doe',
                        email: 'janedoe@example.com',
                        password: '123'
                    };
                    return [4 /*yield*/, pool_1.default.query('SELECT COUNT(*) FROM users')];
                case 1:
                    initialCountResult = _a.sent();
                    initialCount = parseInt(initialCountResult.rows[0].count);
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                            .post('/api/users')
                            .send(newUser)
                            .expect(400)
                            .expect('Content-Type', /json/)];
                case 2:
                    response = _a.sent();
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
                    return [4 /*yield*/, pool_1.default.query('SELECT COUNT(*) FROM users')];
                case 3:
                    finalCountResult = _a.sent();
                    finalCount = parseInt(finalCountResult.rows[0].count);
                    // Assert that the user count hasn't changed
                    expect(finalCount).toBe(initialCount);
                    return [2 /*return*/];
            }
        });
    }); });
    // TEST 3: A user tries to sign up with an email already in use
    it('should return error if email is already in use and not add duplicate user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, initialCountResult, initialCount, response, finalCountResult, finalCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = {
                        name: 'Existing User',
                        email: 'existing@example.com',
                        password: 'ExistingPassword123'
                    };
                    // First, create the user
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(existingUser)];
                case 1:
                    // First, create the user
                    _a.sent();
                    return [4 /*yield*/, pool_1.default.query('SELECT COUNT(*) FROM users')];
                case 2:
                    initialCountResult = _a.sent();
                    initialCount = parseInt(initialCountResult.rows[0].count);
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(existingUser)];
                case 3:
                    response = _a.sent();
                    expect(response.status).toBe(409);
                    expect(response.body.success).toBe(false);
                    expect(response.body.message).toBe('This email is already in use');
                    return [4 /*yield*/, pool_1.default.query('SELECT COUNT(*) FROM users')];
                case 4:
                    finalCountResult = _a.sent();
                    finalCount = parseInt(finalCountResult.rows[0].count);
                    // Assert that the user count hasn't changed
                    expect(finalCount).toBe(initialCount);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('DELETE /api/user', function () {
    var authToken;
    var parentListId;
    // Clear users before all tests in this block
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUserBody, loginBody, loginResponse, newList, newTask1, newTask2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear the users table to start fresh
                return [4 /*yield*/, pool_1.default.query('DELETE FROM users')];
                case 1:
                    // Clear the users table to start fresh
                    _a.sent();
                    newUserBody = {
                        name: 'Test Delete',
                        email: 'test@example.com',
                        password: 'Password123'
                    };
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(newUserBody)];
                case 2:
                    _a.sent();
                    loginBody = {
                        email: 'test@example.com',
                        password: 'Password123'
                    };
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/login').send(loginBody)];
                case 3:
                    loginResponse = _a.sent();
                    authToken = loginResponse.body.userData.authToken;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/lists').set('Authorization', "Bearer ".concat(authToken)).send({ listName: 'New List' })];
                case 4:
                    newList = _a.sent();
                    parentListId = newList.body.data.id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/tasks').set('Authorization', "Bearer ".concat(authToken)).send({ taskName: 'New Task1', parentListId: parentListId })];
                case 5:
                    newTask1 = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/tasks').set('Authorization', "Bearer ".concat(authToken)).send({ taskName: 'New Task2', parentListId: parentListId })];
                case 6:
                    newTask2 = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should sucesfully delete the user and all their lists and tasks from the database', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, usersInDB, listsInDb, tasksInDb;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                        .delete('/api/users')
                        .set('Authorization', "Bearer ".concat(authToken))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("User deleted successfully");
                    return [4 /*yield*/, pool_1.default.query("SELECT * FROM users")];
                case 2:
                    usersInDB = _a.sent();
                    expect(usersInDB.rows.length).toBe(0);
                    return [4 /*yield*/, pool_1.default.query("SELECT * FROM lists")];
                case 3:
                    listsInDb = _a.sent();
                    expect(listsInDb.rows.length).toBe(0);
                    return [4 /*yield*/, pool_1.default.query("SELECT * FROM tasks")];
                case 4:
                    tasksInDb = _a.sent();
                    expect(tasksInDb.rows.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
