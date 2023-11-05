import mongoose, { Schema, Document } from 'mongoose';

export type TaskDocumentType = Document & {
  userId: string;
  assignedTo: string;
  title: string;
  description: string;
  statusId: string;
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
  },
  { timestamps: true },
);

export default mongoose.models.Task || mongoose.model<TaskDocumentType>('Task', TaskSchema);
