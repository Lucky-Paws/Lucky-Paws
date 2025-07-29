import { supabase } from '../config/supabase';
import { IChatRoom, IChatMessage } from '../types';
import { AppError } from '../middleware/errorHandler';

export const chatService = {
  async getUserRooms(userId: string): Promise<IChatRoom[]> {
    const { data: rooms, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .contains('participants', [userId]);

    if (error) {
      throw new AppError('Failed to fetch chat rooms', 500);
    }

    // 참가자 정보 가져오기
    const roomsWithParticipants = await Promise.all(
      (rooms || []).map(async (room) => {
        const participants = await Promise.all(
          room.participants.map(async (participantId: string) => {
            const { data: user } = await supabase
              .from('users')
              .select('name, avatar, type')
              .eq('id', participantId)
              .single();
            return user || null;
          })
        );

        return {
          ...room,
          participants: participants.filter(p => p !== null),
        };
      })
    );

    return roomsWithParticipants as IChatRoom[];
  },

  async createRoom(userId: string, participantId: string): Promise<IChatRoom> {
    if (userId === participantId) {
      throw new AppError('Cannot create chat room with yourself', 400);
    }

    // 참가자 존재 확인
    const { data: participant } = await supabase
      .from('users')
      .select('id')
      .eq('id', participantId)
      .single();

    if (!participant) {
      throw new AppError('Participant not found', 404);
    }

    // 기존 방 확인
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .contains('participants', [userId, participantId])
      .single();

    if (existingRoom) {
      // 참가자 정보 가져오기
      const participants = await Promise.all(
        existingRoom.participants.map(async (participantId: string) => {
          const { data: user } = await supabase
            .from('users')
            .select('name, avatar, type')
            .eq('id', participantId)
            .single();
          return user || null;
        })
      );

      return {
        ...existingRoom,
        participants: participants.filter(p => p !== null),
      } as IChatRoom;
    }

    // 새 방 생성
    const { data: room, error } = await supabase
      .from('chat_rooms')
      .insert([{
        participants: [userId, participantId],
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create chat room', 500);
    }

    // 참가자 정보 가져오기
    const participants = await Promise.all(
      room.participants.map(async (participantId: string) => {
        const { data: user } = await supabase
          .from('users')
          .select('name, avatar, type')
          .eq('id', participantId)
          .single();
        return user || null;
      })
    );

    return {
      ...room,
      participants: participants.filter(p => p !== null),
    } as IChatRoom;
  },

  async getRoomMessages(roomId: string, userId: string): Promise<IChatMessage[]> {
    // 방 존재 및 참가자 확인
    const { data: room } = await supabase
      .from('chat_rooms')
      .select('participants')
      .eq('id', roomId)
      .single();

    if (!room) {
      throw new AppError('Chat room not found', 404);
    }

    if (!room.participants.includes(userId)) {
      throw new AppError('You are not a participant of this chat room', 403);
    }

    // 메시지 가져오기
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new AppError('Failed to fetch messages', 500);
    }

    // 발신자 정보 가져오기
    const messagesWithSenders = await Promise.all(
      (messages || []).map(async (message) => {
        const { data: sender } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', message.sender_id)
          .single();

        return {
          ...message,
          sender: sender || null,
        };
      })
    );

    return messagesWithSenders as IChatMessage[];
  },

  async sendMessage(data: {
    roomId: string;
    senderId: string;
    content: string;
  }): Promise<IChatMessage> {
    // 방 존재 및 참가자 확인
    const { data: room } = await supabase
      .from('chat_rooms')
      .select('participants')
      .eq('id', data.roomId)
      .single();

    if (!room) {
      throw new AppError('Chat room not found', 404);
    }

    if (!room.participants.includes(data.senderId)) {
      throw new AppError('You are not a participant of this chat room', 403);
    }

    // 메시지 생성
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([{
        room_id: data.roomId,
        sender_id: data.senderId,
        content: data.content,
        is_deleted: false,
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to send message', 500);
    }

    // 방의 마지막 메시지 업데이트
    await supabase
      .from('chat_rooms')
      .update({ last_message_id: message.id })
      .eq('id', data.roomId);

    // 발신자 정보 가져오기
    const { data: sender } = await supabase
      .from('users')
      .select('name, avatar')
      .eq('id', message.sender_id)
      .single();

    return {
      ...message,
      sender: sender || null,
    } as IChatMessage;
  },
};