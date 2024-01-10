import mongoose, { Schema, Document } from 'mongoose';
import { ButtonStateType } from '@/types/Task';

export type TaskDocumentType = Document & {
  userId: string;
  assignedTo: string;
  title: string;
  description: string;
  statusId: string;
  buttonState: ButtonStateType;
  order: number;
};

const TaskSchema = new Schema<TaskDocumentType>(
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
    statusId: {
      type: String,
      ref: 'Status',
      required: true,
    },
    buttonState: {
      type: String,
      enum: [ButtonStateType.Pending, ButtonStateType.Updates, ButtonStateType.Done, ButtonStateType.Errors],
      default: ButtonStateType.Pending,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Task || mongoose.model<TaskDocumentType>('Task', TaskSchema);
