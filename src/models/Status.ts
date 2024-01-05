import mongoose, { Schema, Document } from 'mongoose';

export type StatusDocumentType = Document & {
  title: string;
  order: number;
};

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
  },
  { timestamps: true },
);

export default mongoose.models.Status || mongoose.model<StatusDocumentType>('Status', StatusSchema);
