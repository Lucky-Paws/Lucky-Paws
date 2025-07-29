export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    SOCIAL_LOGIN: '/api/auth/social-login',
    COMPLETE_SOCIAL_SIGNUP: '/api/auth/complete-social-signup',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    BY_ID: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
    UNLIKE: (id: string) => `/api/posts/${id}/unlike`,
  },
  COMMENTS: {
    LIST: (postId: string) => `/api/posts/${postId}/comments`,
    CREATE: (postId: string) => `/api/posts/${postId}/comments`,
    UPDATE: (postId: string, commentId: string) => `/api/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: string, commentId: string) => `/api/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: string, commentId: string) => `/api/posts/${postId}/comments/${commentId}/like`,
  },
  REACTIONS: {
    ADD: (postId: string) => `/api/posts/${postId}/reactions`,
    REMOVE: (postId: string, reactionId: string) => `/api/posts/${postId}/reactions/${reactionId}`,
  },
  CHAT: {
    ROOMS: '/api/chat/rooms',
    ROOM_BY_ID: (id: string) => `/api/chat/rooms/${id}`,
    MESSAGES: (roomId: string) => `/api/chat/rooms/${roomId}/messages`,
    SEND_MESSAGE: (roomId: string) => `/api/chat/rooms/${roomId}/messages`,
  },
  SEARCH: {
    POSTS: '/api/search/posts',
    USERS: '/api/search/users',
  },
} as const;