import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ['mentor', 'mentee'],
      required: true,
    },
    teacher_type: {
      type: String,
      enum: ['elementary', 'middle', 'high'],
      default: null,
    },
    years_of_experience: {
      type: Number,
      min: 0,
      max: 50,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, (this as any).password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, refresh_token, __v, ...cleanRet } = ret;
    return cleanRet;
  },
});

// email 필드에 unique 인덱스는 이미 스키마에서 정의되어 있으므로 추가 정의하지 않음

export const User = model<IUser>('User', userSchema);