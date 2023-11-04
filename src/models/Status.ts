import { Schema, model, Document } from 'mongoose';
import { StatusDocumentType } from '@/types/Status';

export interface IStatusDocument extends StatusDocumentType, Document {}

const StatusSchema = new Schema<IStatusDocument>(
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

const Status = model<IStatusDocument>('Status', StatusSchema);

export default Status;
