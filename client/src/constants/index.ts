export const APP_NAME = 'Lucky Paws';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/landing',
  SIGNUP: '/signup',
  COMMUNITY: '/community',
  CHAT: '/chat',
  CHAT_ROOM: (id: string) => `/chat/${id}`,
  POST: (id: string) => `/post/${id}`,
  WRITE: '/write',
} as const;

export const CATEGORIES = {
  STUDENT_GUIDANCE: '학생지도',
  CLASS_MANAGEMENT: '수업운영',
  EVALUATION: '평가/과제',
  PARENT_CONSULTATION: '학부모상담',
  PARENT: '학부모',
  COLLEAGUE: '동료관계',
  OTHER: '기타',
} as const;

export const TEACHER_LEVELS = {
  ELEMENTARY: '초등학교',
  MIDDLE: '중학교',
  HIGH: '고등학교',
} as const;

export const EXPERIENCE_YEARS = {
  YEAR_1: '1년차',
  YEAR_2: '2년차',
  YEAR_3: '3년차',
  YEAR_4: '4년차',
  YEAR_5: '5년차',
  YEAR_6_10: '6-10년차',
  YEAR_11_20: '11-20년차',
  YEAR_20_PLUS: '20년차 이상',
} as const;

export const REACTION_TYPES = {
  CHEER: { type: 'cheer' as const, label: '응원해요', emoji: '💪' },
  EMPATHY: { type: 'empathy' as const, label: '공감해요', emoji: '🤝' },
  HELPFUL: { type: 'helpful' as const, label: '도움됐어요', emoji: '👍' },
  FUNNY: { type: 'funny' as const, label: '재밌어요', emoji: '😄' },
} as const;

export const UI_CONSTANTS = {
  HEADER_HEIGHT: 56,
  BOTTOM_NAV_HEIGHT: 60,
  BUTTON_SIZE: {
    SM: 32,
    MD: 40,
    LG: 48,
  },
  ICON_SIZE: {
    SM: 16,
    MD: 20,
    LG: 24,
  },
  AVATAR_SIZE: {
    XS: 24,
    SM: 32,
    MD: 40,
    LG: 48,
    XL: 64,
  },
} as const;

export const MESSAGES = {
  ERROR: {
    NETWORK: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    NOT_FOUND: '요청하신 내용을 찾을 수 없습니다.',
    SERVER: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  SUCCESS: {
    POST_CREATED: '게시글이 작성되었습니다.',
    POST_UPDATED: '게시글이 수정되었습니다.',
    POST_DELETED: '게시글이 삭제되었습니다.',
    COMMENT_CREATED: '댓글이 작성되었습니다.',
    COMMENT_DELETED: '댓글이 삭제되었습니다.',
  },
  CONFIRM: {
    DELETE_POST: '정말로 이 게시글을 삭제하시겠습니까?',
    DELETE_COMMENT: '정말로 이 댓글을 삭제하시겠습니까?',
    LOGOUT: '로그아웃 하시겠습니까?',
  },
} as const;