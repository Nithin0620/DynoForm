import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  airtableUserId: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  loginTimestamp: Date;
  role: 'user' | 'admin';
}

const UserSchema = new Schema<IUser>({
  airtableUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  loginTimestamp: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
