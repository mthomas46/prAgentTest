const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Task status constants
const TaskStatus = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  BLOCKED: 4
};

// Task priority constants
const TaskPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  URGENT: 3
};

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: TaskStatus.PENDING
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'tasks',
  paranoid: true // Enable soft deletes
});

module.exports = {
  Task,
  TaskStatus,
  TaskPriority
}; 