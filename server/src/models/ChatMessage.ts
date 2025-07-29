import { Schema, model } from 'mongoose';
import { IChatMessage } from '../types';

const chatMessageSchema = new Schema<IChatMessage>(
  {
    room_id: {
      type: String,
      ref: 'ChatRoom',
      required: true,
    },
    sender_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

chatMessageSchema.index({ room_id: 1, created_at: -1 });

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);