import mongoose, { Schema, Document } from 'mongoose';

export interface StatusDocumentType extends Document {
  title: string;
  order: number;
  projectId: string;
}

const StatusSchema = new Schema<StatusDocumentType>(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    projectId: {
      type: String,
      ref: 'Project',
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export default mongoose.models.Status || mongoose.model<StatusDocumentType>('Status', StatusSchema);
