import mongoose, { Schema, Document } from 'mongoose';

export interface ProjectDocumentType extends Document {
  title: string;
  description: string;
  active: boolean;
  color: string;
}

const ProjectSchema = new Schema<ProjectDocumentType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.models.Project || mongoose.model<ProjectDocumentType>('Project', ProjectSchema);
