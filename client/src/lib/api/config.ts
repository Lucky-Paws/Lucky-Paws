export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
  },
  COMMENTS: {
    LIST: (postId: string) => `/posts/${postId}/comments`,
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}/like`,
  },
  REACTIONS: {
    ADD: (postId: string) => `/posts/${postId}/reactions`,
    REMOVE: (postId: string, reactionId: string) => `/posts/${postId}/reactions/${reactionId}`,
  },
  CHAT: {
    ROOMS: '/chat/rooms',
    ROOM_BY_ID: (id: string) => `/chat/rooms/${id}`,
    MESSAGES: (roomId: string) => `/chat/rooms/${roomId}/messages`,
    SEND_MESSAGE: (roomId: string) => `/chat/rooms/${roomId}/messages`,
  },
  SEARCH: {
    POSTS: '/search/posts',
    USERS: '/search/users',
  },
} as const;