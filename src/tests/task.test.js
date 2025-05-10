const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Task = require('../models/Task');
const User = require('../models/User');

describe('Task API', () => {
  let token;
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});

    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31',
        priority: 'medium'
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', taskData.title);
      expect(res.body).toHaveProperty('description', taskData.description);
      expect(res.body).toHaveProperty('priority', taskData.priority);
      expect(res.body).toHaveProperty('userId', user._id.toString());
    });

    it('should not create task without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-12-31',
          priority: 'medium'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create([
        {
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2024-12-31',
          priority: 'high',
          userId: user._id
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          dueDate: '2024-12-31',
          priority: 'low',
          userId: user._id
        }
      ]);
    });

    it('should get all tasks for user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks).toHaveLength(2);
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('currentPage');
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0]).toHaveProperty('priority', 'high');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31',
        priority: 'medium',
        userId: user._id
      });
    });

    it('should update task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', updateData.title);
      expect(res.body).toHaveProperty('status', updateData.status);
    });

    it('should not update task of another user', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });

      const otherToken = jwt.sign({ userId: otherUser._id }, process.env.JWT_SECRET);

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Updated Task' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/tasks/:id/summarize', () => {
    let task;

    beforeEach(async () => {
      task = await Task.create({
        title: 'Test Task',
        description: 'Develop a new feature for the dashboard, including UI and backend logic, by next week',
        dueDate: '2024-12-31',
        priority: 'medium',
        userId: user._id
      });
    });

    it('should generate task summary', async () => {
      const res = await request(app)
        .post(`/api/tasks/${task._id}/summarize`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('taskId', task._id.toString());
      expect(res.body).toHaveProperty('summary');
      expect(typeof res.body.summary).toBe('string');
    });
  });
}); 