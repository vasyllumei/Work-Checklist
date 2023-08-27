import { Schema, model, Document } from 'mongoose';

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

interface ITask {
  userId: string;
  assignedTo: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface ITaskDocument extends ITask, Document {}

const TaskSchema = new Schema<ITaskDocument>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: String,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
  },
  { timestamps: true },
);

const Task = model<ITaskDocument>('Task', TaskSchema);

export default Task;
