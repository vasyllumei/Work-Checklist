import { Schema, model, Document } from 'mongoose';

enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Done',
}

export type CardDocumentType = Document & {
  items: string;
  title: string;
  content: string;
  buttonState: string;
  avatars: string[];
  status: TaskStatus;
};

const CardSchema = new Schema<CardDocumentType>(
  {
    items: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    buttonState: {
      type: String,
      required: true,
    },
    avatars: {
      type: [String],
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
const Card = model<CardDocumentType>('Card', CardSchema);

export default Card;
