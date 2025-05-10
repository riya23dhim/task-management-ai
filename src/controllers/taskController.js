const { validationResult } = require('express-validator');
const fetch = require('node-fetch');
const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      userId: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

// Get all tasks with pagination and filtering
exports.getTasks = async (req, res) => {
  try {
    const { priority, dueDate, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };

    if (priority) {
      query.priority = priority;
    }

    if (dueDate) {
      query.dueDate = { $lte: new Date(dueDate) };
    }

    const tasks = await Task.find(query)
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate status transition if status is being updated
    if (req.body.status && req.body.status !== task.status) {
      if (!task.canTransitionTo(req.body.status)) {
        return res.status(400).json({
          error: `Invalid status transition from ${task.status} to ${req.body.status}`,
          validTransitions: {
            'todo': ['in-progress'],
            'in-progress': ['todo', 'done'],
            'done': ['in-progress']
          },
          currentStatus: task.status,
          allowedTransitions: {
            from: task.status,
            to: ['todo', 'in-progress', 'done'].filter(status => task.canTransitionTo(status))
          }
        });
      }
    }

    // Update task fields
    const updates = req.body;
    Object.keys(updates).forEach((update) => {
      task[update] = updates[update];
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};

// Generate AI summary for a task using OpenRouter API
exports.generateSummary = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('Making API request with OpenRouter key:', process.env.OPENROUTER_API_KEY ? 'Key exists' : 'No key found');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Task Management System'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus-20240229',
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes task descriptions concisely in one sentence."
          },
          {
            role: "user",
            content: `Please summarize this task description in one clear, concise sentence: ${task.description}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    console.log('API Response Status:', response.status);
    const data = await response.json();
    console.log('API Response Data:', data);
    
    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('OpenRouter API Error:', data);
      throw new Error(`Failed to generate summary: ${JSON.stringify(data)}`);
    }

    const summary = data.choices[0].message.content.trim();
    task.summary = summary;
    await task.save();

    res.json({ taskId: task._id, summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ 
      error: 'Error generating task summary',
      details: error.message
    });
  }
};

/**
 * Update task status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task belongs to the current user
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Error updating task status' });
  }
};
