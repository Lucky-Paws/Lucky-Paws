import { API_BASE_URL } from '@/lib/api/config';

export interface ServerStatus {
  isOnline: boolean;
  message: string;
  timestamp: Date;
}

export async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 5초 타임아웃 설정
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return {
        isOnline: true,
        message: '서버가 정상적으로 실행 중입니다.',
        timestamp: new Date(),
      };
    } else {
      return {
        isOnline: false,
        message: `서버 응답 오류: ${response.status} ${response.statusText}`,
        timestamp: new Date(),
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          isOnline: false,
          message: '서버 연결 시간 초과 (5초)',
          timestamp: new Date(),
        };
      }
      if (error.message.includes('fetch')) {
        return {
          isOnline: false,
          message: '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
          timestamp: new Date(),
        };
      }
    }
    
    return {
      isOnline: false,
      message: '알 수 없는 오류가 발생했습니다.',
      timestamp: new Date(),
    };
  }
}

export function getServerStatusMessage(status: ServerStatus): string {
  if (status.isOnline) {
    return '✅ ' + status.message;
  } else {
    return '❌ ' + status.message;
  }
} 