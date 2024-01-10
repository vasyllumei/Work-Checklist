import mongoose, { Document, Schema } from 'mongoose';
import { UserRoleType } from '@/types/User';

export type UserDocumentType = Document & {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoleType;
  iconColor?: string;
  token: string;
  refreshToken: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
};

const UserSchema = new Schema<UserDocumentType>(
  {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 60,
    },
    role: {
      type: String,
      enum: [UserRoleType.ADMIN, UserRoleType.USER],
      default: UserRoleType.USER,
    },
    iconColor: {
      type: String,
      default: '',
    },
    token: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model<UserDocumentType>('User', UserSchema);
