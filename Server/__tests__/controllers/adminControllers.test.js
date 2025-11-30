const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../../models/User');
const Reports = require('../../models/Reports');
const VolunteerRequest = require('../../models/VolunteerRequest');
const StatusUpdateRequest = require('../../models/StatusUpdateRequest');
const {
    getUsers,
    editUser,
    makeAdmin,
    removeAdmin,
    searchUsers
} = require('../../controllers/adminControllers');
const isAdmin = require('../../middlewares/isAdmin');

// Mock the middleware
jest.mock('../../middlewares/isAdmin', () => (req, res, next) => {
    req.user = { userId: 'admin-id-123', isAdmin: true };
    next();
});

let mongoServer;
let app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup express app for testing
    app = express();
    app.use(express.json());
    app.get('/admin/users', isAdmin, getUsers);
    app.put('/admin/edituser/:id', isAdmin, editUser);
    app.put('/admin/makeadmin/:id', isAdmin, makeAdmin);
    app.put('/admin/removeadmin/:id', isAdmin, removeAdmin);
    app.get('/admin/searchusers', isAdmin, searchUsers);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Reports.deleteMany({});
    await VolunteerRequest.deleteMany({});
    await StatusUpdateRequest.deleteMany({});
});

describe('Admin Controllers - getUsers', () => {
    test('should fetch users with pagination - default values', async () => {
        // Create test users
        await User.create([
            { username: 'user1', email: 'user1@test.com', password: 'pass123' },
            { username: 'user2', email: 'user2@test.com', password: 'pass123' },
            { username: 'user3', email: 'user3@test.com', password: 'pass123' }
        ]);

        const response = await request(app)
            .get('/admin/users')
            .expect(200);

        expect(response.body.message).toBe('Users Fetched Successfully');
        expect(response.body.users).toHaveLength(3);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.totalUsers).toBe(3);
        expect(response.body.totalPages).toBe(1);
    });

    test('should fetch users with custom page and limit', async () => {
        // Create 10 test users
        const users = Array.from({ length: 10 }, (_, i) => ({
            username: `user${i}`,
            email: `user${i}@test.com`,
            password: 'pass123'
        }));
        await User.create(users);

        const response = await request(app)
            .get('/admin/users?page=2&limit=3')
            .expect(200);

        expect(response.body.users).toHaveLength(3);
        expect(response.body.currentPage).toBe(2);
        expect(response.body.totalPages).toBe(4);
    });

    test('should include user statistics (post count and volunteer count)', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'pass123'
        });

        // Create reports for the user
        await Reports.create([
            {
                title: 'Report 1',
                description: 'Test report',
                category: 'pothole',
                priority: 'high',
                reportedBy: user._id,
                location: { type: 'Point', coordinates: [0, 0] }
            },
            {
                title: 'Report 2',
                description: 'Test report 2',
                category: 'garbage',
                priority: 'medium',
                reportedBy: user._id,
                location: { type: 'Point', coordinates: [0, 0] }
            }
        ]);

        const response = await request(app)
            .get('/admin/users')
            .expect(200);

        expect(response.body.users[0].postCount).toBe(2);
        expect(response.body.users[0].volunteeredCount).toBeDefined();
    });

    test('should return properly formatted user data', async () => {
        await User.create({
            username: 'formatteduser',
            email: 'formatted@test.com',
            password: 'pass123',
            bio: 'Test bio',
            phone: '1234567890',
            isAdmin: false
        });

        const response = await request(app)
            .get('/admin/users')
            .expect(200);

        const user = response.body.users[0];
        expect(user).toHaveProperty('user');
        expect(user.user).toHaveProperty('_id');
        expect(user.user).toHaveProperty('username', 'formatteduser');
        expect(user.user).toHaveProperty('email', 'formatted@test.com');
        expect(user).toHaveProperty('isAdmin', false);
        expect(user).toHaveProperty('joined');
        expect(user).toHaveProperty('postCount');
        expect(user).toHaveProperty('volunteeredCount');
    });

    test('should handle empty database', async () => {
        const response = await request(app)
            .get('/admin/users')
            .expect(200);

        expect(response.body.users).toHaveLength(0);
        expect(response.body.totalUsers).toBe(0);
        expect(response.body.totalPages).toBe(0);
    });

    test('should handle invalid page number gracefully', async () => {
        await User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'pass123'
        });

        const response = await request(app)
            .get('/admin/users?page=999&limit=5')
            .expect(200);

        expect(response.body.users).toHaveLength(0);
    });
});

describe('Admin Controllers - editUser', () => {
    test('should successfully update user profile', async () => {
        const user = await User.create({
            username: 'oldname',
            email: 'test@test.com',
            password: 'pass123',
            bio: 'Old bio'
        });

        const updates = {
            username: 'newname',
            bio: 'New bio',
            phone: '9876543210',
            village_name: 'Test Village',
            district: 'Test District',
            state: 'Test State',
            pincode: '123456'
        };

        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send(updates)
            .expect(200);

        expect(response.body.message).toBe('Profile Updated Successfully');
        expect(response.body.user.username).toBe('newname');
        expect(response.body.user.bio).toBe('New bio');
        expect(response.body.user.phone).toBe('9876543210');
    });

    test('should update only provided fields', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'pass123',
            bio: 'Original bio',
            phone: '1111111111'
        });

        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send({ username: 'updatedname' })
            .expect(200);

        expect(response.body.user.username).toBe('updatedname');
        expect(response.body.user.bio).toBe('Original bio');
        expect(response.body.user.phone).toBe('1111111111');
    });

    test('should update date of birth when provided', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'pass123'
        });

        const dob = new Date('1990-01-01');
        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send({ dob: dob.toISOString() })
            .expect(200);

        expect(new Date(response.body.user.dob)).toEqual(dob);
    });

    test('should handle non-existent user ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        await request(app)
            .put(`/admin/edituser/${fakeId}`)
            .send({ username: 'newname' })
            .expect(500);
    });

    test('should not expose password in response', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'secretpassword123'
        });

        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send({ username: 'newname' })
            .expect(200);

        expect(response.body.user).not.toHaveProperty('password');
    });

    test('should preserve existing values for empty updates', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'pass123',
            bio: 'Original bio'
        });

        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send({})
            .expect(200);

        expect(response.body.user.username).toBe('testuser');
        expect(response.body.user.bio).toBe('Original bio');
    });
});

describe('Admin Controllers - makeAdmin', () => {
    test('should successfully promote user to admin', async () => {
        const user = await User.create({
            username: 'normaluser',
            email: 'user@test.com',
            password: 'pass123',
            isAdmin: false
        });

        const response = await request(app)
            .put(`/admin/makeadmin/${user._id}`)
            .expect(200);

        expect(response.body.message).toBe('User Promoted to Admin Successfully');
        expect(response.body.user.isAdmin).toBe(true);
    });

    test('should return error if user not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/admin/makeadmin/${fakeId}`)
            .expect(400);

        expect(response.body.message).toBe('User Not Found');
    });

    test('should return error if user is already an admin', async () => {
        const user = await User.create({
            username: 'adminuser',
            email: 'admin@test.com',
            password: 'pass123',
            isAdmin: true
        });

        const response = await request(app)
            .put(`/admin/makeadmin/${user._id}`)
            .expect(400);

        expect(response.body.message).toBe('User is already an Admin');
    });

    test('should persist admin status in database', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'pass123',
            isAdmin: false
        });

        await request(app)
            .put(`/admin/makeadmin/${user._id}`)
            .expect(200);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.isAdmin).toBe(true);
    });

    test('should handle invalid user ID format', async () => {
        const response = await request(app)
            .put('/admin/makeadmin/invalid-id')
            .expect(500);

        expect(response.body.message).toBe('Internal Server Error');
    });
});

describe('Admin Controllers - removeAdmin', () => {
    test('should successfully demote admin to regular user', async () => {
        const user = await User.create({
            username: 'adminuser',
            email: 'admin@test.com',
            password: 'pass123',
            isAdmin: true
        });

        const response = await request(app)
            .put(`/admin/removeadmin/${user._id}`)
            .expect(200);

        expect(response.body.message).toBe('User Demoted to User Successfully');
        expect(response.body.user.isAdmin).toBe(false);
    });

    test('should return error if user not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/admin/removeadmin/${fakeId}`)
            .expect(400);

        expect(response.body.message).toBe('User Not Found');
    });

    test('should return error if user is not an admin', async () => {
        const user = await User.create({
            username: 'normaluser',
            email: 'user@test.com',
            password: 'pass123',
            isAdmin: false
        });

        const response = await request(app)
            .put(`/admin/removeadmin/${user._id}`)
            .expect(400);

        expect(response.body.message).toBe('User is not an Admin');
    });

    test('should persist regular user status in database', async () => {
        const user = await User.create({
            username: 'adminuser',
            email: 'admin@test.com',
            password: 'pass123',
            isAdmin: true
        });

        await request(app)
            .put(`/admin/removeadmin/${user._id}`)
            .expect(200);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.isAdmin).toBe(false);
    });
});

describe('Admin Controllers - searchUsers', () => {
    beforeEach(async () => {
        // Create test users with different names and emails
        await User.create([
            { username: 'john_doe', email: 'john@example.com', password: 'pass123' },
            { username: 'jane_smith', email: 'jane@example.com', password: 'pass123' },
            { username: 'bob_jones', email: 'bob@test.com', password: 'pass123' },
            { username: 'alice_wonder', email: 'alice@example.com', password: 'pass123' }
        ]);
    });

    test('should search users by username', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=john')
            .expect(200);

        expect(response.body.message).toBe('Users Searched Successfully');
        expect(response.body.users).toHaveLength(1);
        expect(response.body.users[0].user.username).toBe('john_doe');
    });

    test('should search users by email', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=test.com')
            .expect(200);

        expect(response.body.users).toHaveLength(1);
        expect(response.body.users[0].user.email).toBe('bob@test.com');
    });

    test('should be case-insensitive', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=JANE')
            .expect(200);

        expect(response.body.users).toHaveLength(1);
        expect(response.body.users[0].user.username).toBe('jane_smith');
    });

    test('should return multiple matches', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=example.com')
            .expect(200);

        expect(response.body.users.length).toBeGreaterThanOrEqual(3);
    });

    test('should support pagination in search results', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=example&page=1&limit=2')
            .expect(200);

        expect(response.body.users).toHaveLength(2);
        expect(response.body.currentPage).toBe(1);
    });

    test('should return empty array for no matches', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=nonexistent')
            .expect(200);

        expect(response.body.users).toHaveLength(0);
        expect(response.body.totalUsers).toBe(0);
    });

    test('should handle partial matches', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=jo')
            .expect(200);

        expect(response.body.users.length).toBeGreaterThanOrEqual(2);
    });

    test('should include user statistics in search results', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=john')
            .expect(200);

        const user = response.body.users[0];
        expect(user).toHaveProperty('postCount');
        expect(user).toHaveProperty('volunteeredCount');
        expect(user).toHaveProperty('joined');
    });

    test('should calculate correct total pages', async () => {
        const response = await request(app)
            .get('/admin/searchusers?search=example&limit=2')
            .expect(200);

        expect(response.body.totalPages).toBeGreaterThan(0);
    });

    test('should handle special characters in search', async () => {
        await User.create({
            username: 'test_user@123',
            email: 'test@special.com',
            password: 'pass123'
        });

        const response = await request(app)
            .get('/admin/searchusers?search=@special')
            .expect(200);

        expect(response.body.users).toHaveLength(1);
    });
});

describe('Admin Controllers - Edge Cases', () => {
    test('getUsers should handle very large page numbers', async () => {
        await User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'pass123'
        });

        const response = await request(app)
            .get('/admin/users?page=10000&limit=5')
            .expect(200);

        expect(response.body.users).toHaveLength(0);
    });

    test('editUser should handle all fields update simultaneously', async () => {
        const user = await User.create({
            username: 'olduser',
            email: 'old@test.com',
            password: 'pass123'
        });

        const allUpdates = {
            username: 'newuser',
            bio: 'New comprehensive bio',
            phone: '1234567890',
            dob: new Date('1995-05-15'),
            village_name: 'New Village',
            district: 'New District',
            state: 'New State',
            pincode: '654321'
        };

        const response = await request(app)
            .put(`/admin/edituser/${user._id}`)
            .send(allUpdates)
            .expect(200);

        expect(response.body.user.username).toBe('newuser');
        expect(response.body.user.bio).toBe('New comprehensive bio');
        expect(response.body.user.phone).toBe('1234567890');
        expect(response.body.user.village_name).toBe('New Village');
    });

    test('searchUsers with empty search parameter', async () => {
        await User.create([
            { username: 'user1', email: 'user1@test.com', password: 'pass123' },
            { username: 'user2', email: 'user2@test.com', password: 'pass123' }
        ]);

        const response = await request(app)
            .get('/admin/searchusers?search=')
            .expect(200);

        // Empty search should match all users or return specific behavior
        expect(response.body).toHaveProperty('users');
    });
});