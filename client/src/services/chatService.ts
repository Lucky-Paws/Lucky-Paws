import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { ChatRoom, ChatMessage } from '@/types';

export interface SendMessageDto {
  content: string;
}

export const chatService = {
  // 채팅방 목록 조회
  async getChatRooms(): Promise<ChatRoom[]> {
    return apiClient.get<ChatRoom[]>(API_ENDPOINTS.CHAT.ROOMS);
  },

  // 채팅방 생성
  async createRoom(participantId: string): Promise<ChatRoom> {
    return apiClient.post<ChatRoom>(API_ENDPOINTS.CHAT.ROOMS, { participantId });
  },

  // 채팅방 상세 조회
  async getChatRoom(id: string): Promise<ChatRoom> {
    return apiClient.get<ChatRoom>(API_ENDPOINTS.CHAT.ROOM_BY_ID(id));
  },

  // 채팅 메시지 목록 조회
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(API_ENDPOINTS.CHAT.MESSAGES(roomId));
  },

  // 메시지 전송
  async sendMessage(roomId: string, data: SendMessageDto): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(API_ENDPOINTS.CHAT.SEND_MESSAGE(roomId), data);
  },
};