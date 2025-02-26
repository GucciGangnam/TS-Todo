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
describe('POST /api/lists', function () {
    var authToken;
    // Clear users before all tests in this block
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUserBody, loginBody, loginResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear the users table to start fresh
                return [4 /*yield*/, pool_1.default.query('DELETE FROM users')];
                case 1:
                    // Clear the users table to start fresh
                    _a.sent();
                    newUserBody = {
                        name: 'Test List',
                        email: 'testlist@example.com',
                        password: 'Password123'
                    };
                    // Make the POST request to create a user
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(newUserBody)];
                case 2:
                    // Make the POST request to create a user
                    _a.sent();
                    loginBody = {
                        email: 'testlist@example.com',
                        password: 'Password123'
                    };
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/login').send(loginBody)];
                case 3:
                    loginResponse = _a.sent();
                    authToken = loginResponse.body.userData.authToken;
                    return [2 /*return*/];
            }
        });
    }); });
    // THEN - make a post to lists and see if it sucesful - THEN fetch data from DB an ensure its there
    it('should create a new list when authenticated', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, dbResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                        .post('/api/lists')
                        .set('Authorization', "Bearer ".concat(authToken))
                        .send({ listName: 'New List' })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(201);
                    expect(response.body.data).toHaveProperty('id');
                    expect(response.body.data.name).toBe('New List');
                    return [4 /*yield*/, pool_1.default.query('SELECT * FROM lists WHERE name = $1', ['New List'])];
                case 2:
                    dbResult = _a.sent();
                    expect(dbResult.rows.length).toBe(1);
                    expect(dbResult.rows[0].name).toBe('New List');
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('PUT .api/lists', function () {
    // Before each // Clear DB
    var authToken;
    var parentListId;
    var taskId;
    // Clear users before all tests in this block
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUserBody, loginBody, loginResponse, newList, newTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear the users table to start fresh
                return [4 /*yield*/, pool_1.default.query('DELETE FROM users')];
                case 1:
                    // Clear the users table to start fresh
                    _a.sent();
                    newUserBody = {
                        name: 'Test Update List',
                        email: 'testlist@example.com',
                        password: 'Password123'
                    };
                    // Make the POST request to create a user
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(newUserBody)];
                case 2:
                    // Make the POST request to create a user
                    _a.sent();
                    loginBody = {
                        email: 'testlist@example.com',
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
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/tasks').set('Authorization', "Bearer ".concat(authToken)).send({ taskName: 'New Task', parentListId: parentListId })];
                case 5:
                    newTask = _a.sent();
                    taskId = newTask.body.data.id;
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should update the color of the list to blue', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                        .put('/api/lists')
                        .set('Authorization', "Bearer ".concat(authToken))
                        .send({ listId: parentListId, newColor: "Blue" })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.data.color).toBe('Blue');
                    return [2 /*return*/];
            }
        });
    }); });
});
// Delete list
describe('PUT .api/lists', function () {
    // Before 
    // Before each // Clear DB
    var authToken;
    var parentListId;
    // Clear users before all tests in this block
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUserBody, loginBody, loginResponse, newList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear the users table to start fresh
                return [4 /*yield*/, pool_1.default.query('DELETE FROM users')];
                case 1:
                    // Clear the users table to start fresh
                    _a.sent();
                    newUserBody = {
                        name: 'Test Task',
                        email: 'testtask@example.com',
                        password: 'Password123'
                    };
                    // Make the POST request to create a user
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/users').send(newUserBody)];
                case 2:
                    // Make the POST request to create a user
                    _a.sent();
                    loginBody = {
                        email: 'testtask@example.com',
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
                    return [2 /*return*/];
            }
        });
    }); });
    it('shoudl delete the list that was passed in and all its subsiquent tasks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                        .delete('/api/lists')
                        .set('Authorization', "Bearer ".concat(authToken))
                        .send({ listId: parentListId })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe('List deleted successfully');
                    return [2 /*return*/];
            }
        });
    }); });
});
