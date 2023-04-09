import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRoleType } from '@/types/User';

export type UserDocumentType = Document & {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRoleType;
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
    },
    role: {
      type: String,
      enum: [UserRoleType.ADMIN, UserRoleType.USER],
      default: UserRoleType.USER,
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

// Middleware to hash the password before saving
UserSchema.pre<UserDocumentType>('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  next();
});

// Method to compare the candidate password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<UserDocumentType>('User', UserSchema);
