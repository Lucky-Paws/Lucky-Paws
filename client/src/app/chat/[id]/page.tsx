'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Header, { HEADER_HEIGHT } from '@/components/common/Header';

export default function ChatRoom() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/landing');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const chatData = {
    id: chatId,
    name: 'OOO 멘토님',
    info: '20년차 | 초등교사'
  };

  const messages = [
    {
      id: 1,
      sender: 'mentor',
      content: '대화내용 대화내용 대화내용 대화내용 대화내용 대화내용 대화내용',
      time: '13:25'
    },
    {
      id: 2,
      sender: 'me',
      content: '대화내용 대화내용 대화내용 대화내용 대화내용 대',
      time: '13:25'
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // TODO: 메시지 전송 로직
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EDEDED' }}>
      <Header 
        showBackButton={true}
        showLogo={false}
        showSearch={false}
        showNotification={false}
        leftContent={
          <>
            <button 
              onClick={() => router.back()} 
              className="flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              style={{ width: '40px', height: '40px' }}
            >
              <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-medium">{chatData.name}</h1>
              <p className="text-xs text-gray-500">{chatData.info}</p>
            </div>
          </>
        }
      />

      {/* Date Header */}
      <div style={{ paddingTop: `${HEADER_HEIGHT}px` }} className="flex justify-center py-2">
        <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-600">
          2025.07.28
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'mentor' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              )}
              <div className="flex flex-col">
                {msg.sender === 'mentor' && (
                  <span className="text-xs text-gray-600 mb-1 ml-1">{chatData.name}</span>
                )}
                <div 
                  className="px-3 py-2 rounded-lg text-black"
                  style={{ 
                    backgroundColor: msg.sender === 'me' ? '#C6C6C6' : 'white'
                  }}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 mb-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
        <button
          onClick={handleSendMessage}
          className="p-2"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
} 