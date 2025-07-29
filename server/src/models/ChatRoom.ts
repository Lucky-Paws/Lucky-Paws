import { Schema, model } from 'mongoose';
import { IChatRoom } from '../types';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    participants: [{
      type: String,
      ref: 'User',
      required: true,
    }],
    last_message_id: {
      type: String,
      ref: 'ChatMessage',
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ updated_at: -1 });

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema);