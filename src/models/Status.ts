import mongoose, { Schema, Document } from 'mongoose';

export type StatusDocumentType = Document & {
  title: string;
  order: string;
};

const StatusSchema = new Schema<StatusDocumentType>(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Status || mongoose.model<StatusDocumentType>('Status', StatusSchema);
