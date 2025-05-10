const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  summary: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for efficient querying
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

// Status transition validation
taskSchema.methods.canTransitionTo = function(newStatus) {
  const validTransitions = {
    'todo': ['in-progress'],
    'in-progress': ['todo', 'done'],
    'done': ['in-progress']
  };
  
  return validTransitions[this.status]?.includes(newStatus);
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
