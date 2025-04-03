import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  completed: boolean;
  assignedTo: string | null;
  dueDate: Date | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  completed?: boolean;
  assignedTo?: string;
  dueDate?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

class Task extends Model<TaskAttributes, CreateTaskInput> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public status!: string;
  public priority!: string;
  public completed!: boolean;
  public assignedTo!: string | null;
  public dueDate!: Date | null;
  public metadata!: Record<string, any> | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'medium',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    paranoid: true, // Enable soft deletes
  }
);

export default Task; 