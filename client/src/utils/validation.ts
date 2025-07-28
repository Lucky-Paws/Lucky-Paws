export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
    }
    if (!/[A-Za-z]/.test(password)) {
      return { isValid: false, message: '비밀번호는 영문자를 포함해야 합니다.' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: '비밀번호는 숫자를 포함해야 합니다.' };
    }
    return { isValid: true };
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  postTitle: (title: string): boolean => {
    return title.trim().length >= 1 && title.trim().length <= 100;
  },

  postContent: (content: string): boolean => {
    return content.trim().length >= 10;
  },

  comment: (comment: string): boolean => {
    return comment.trim().length >= 1;
  },
};