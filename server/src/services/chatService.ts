import { ChatRoom } from '../models/ChatRoom';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { IChatRoom, IChatMessage } from '../types';

export const chatService = {
  async getUserRooms(userId: string): Promise<IChatRoom[]> {
    const rooms = await ChatRoom.find({ participants: userId })
      .populate('participants', 'name avatar type')
      .populate({
        path: 'lastMessage',
        populate: { path: 'senderId', select: 'name' },
      })
      .sort({ updatedAt: -1 });

    // Calculate unread count for each room
    for (const room of rooms) {
      const unreadCount = await ChatMessage.countDocuments({
        roomId: room._id,
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId },
      });
      (room as any).unreadCount = unreadCount;
    }

    return rooms;
  },

  async createRoom(userId: string, participantId: string): Promise<IChatRoom> {
    if (userId === participantId) {
      throw new AppError('Cannot create chat room with yourself', 400);
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      throw new AppError('Participant not found', 404);
    }

    // Check if room already exists
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: [userId, participantId], $size: 2 },
    });

    if (existingRoom) {
      await existingRoom.populate('participants', 'name avatar type');
      return existingRoom;
    }

    const room = await ChatRoom.create({
      participants: [userId, participantId],
    });

    await room.populate('participants', 'name avatar type');
    return room;
  },

  async getRoomMessages(roomId: string, userId: string): Promise<IChatMessage[]> {
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      throw new AppError('Chat room not found', 404);
    }

    if (!room.participants.includes(userId as any)) {
      throw new AppError('You are not a participant of this chat room', 403);
    }

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        roomId,
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId },
      },
      {
        $push: {
          readBy: { userId, readAt: new Date() },
        },
      }
    );

    const messages = await ChatMessage.find({ roomId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 });

    return messages;
  },

  async sendMessage(data: {
    roomId: string;
    senderId: string;
    content: string;
  }): Promise<IChatMessage> {
    const room = await ChatRoom.findById(data.roomId);
    if (!room) {
      throw new AppError('Chat room not found', 404);
    }

    if (!room.participants.includes(data.senderId as any)) {
      throw new AppError('You are not a participant of this chat room', 403);
    }

    const message = await ChatMessage.create({
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content,
      readBy: [{ userId: data.senderId, readAt: new Date() }],
    });

    // Update room's last message
    room.lastMessage = message._id as any;
    await room.save();

    await message.populate('senderId', 'name avatar');
    return message;
  },
};