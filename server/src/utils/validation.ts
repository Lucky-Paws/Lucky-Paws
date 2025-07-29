import Joi from 'joi';

export const authValidation = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    type: Joi.string().valid('mentor', 'mentee').required(),
    teacherType: Joi.string().valid('초등학교', '중학교', '고등학교').when('type', {
      is: 'mentor',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    yearsOfExperience: Joi.number().min(0).max(50).when('type', {
      is: 'mentor',
      then: Joi.optional(),
      otherwise: Joi.optional(),
    }),
    bio: Joi.string().max(500).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const postValidation = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().min(1).max(10000).required(),
    category: Joi.string()
      .valid('학생지도', '수업운영', '평가/과제', '학부모상담', '학부모', '동료관계', '기타')
      .required(),
    tags: Joi.array().items(Joi.string().max(30)).max(10),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200),
    content: Joi.string().min(1).max(10000),
    category: Joi.string()
      .valid('학생지도', '수업운영', '평가/과제', '학부모상담', '학부모', '동료관계', '기타'),
    tags: Joi.array().items(Joi.string().max(30)).max(10),
  }),

  query: Joi.object({
    teacherLevel: Joi.string().valid('초등학교', '중학교', '고등학교').optional(),
    category: Joi.string()
      .valid('학생지도', '수업운영', '평가/과제', '학부모상담', '학부모', '동료관계', '기타')
      .optional(),
    isAnswered: Joi.boolean().truthy('true').falsy('false').optional(),
    sortBy: Joi.string().valid('latest', 'popular').optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
  }),
};

export const commentValidation = {
  create: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
    parentId: Joi.string().optional(),
  }),

  update: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
  }),
};

export const reactionValidation = {
  add: Joi.object({
    type: Joi.string().valid('cheer', 'empathy', 'helpful', 'funny').required(),
  }),
};

export const chatValidation = {
  sendMessage: Joi.object({
    content: Joi.string().min(1).max(1000).required(),
  }),
};