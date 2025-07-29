import { Schema, model } from 'mongoose';
import { IChatRoom } from '../types';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'ChatMessage',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ updatedAt: -1 });

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema);