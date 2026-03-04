/**
 * 区块 ID，与预览组件一一对应，便于后续扩展样式和内容
 */
export const BLOCK_IDS = {
  BASIC_INFO: 'basicInfo',
  SUMMARY: 'summary',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  HONORS: 'honors',
  INTERNSHIPS: 'internships',
  CERTIFICATIONS: 'certifications',
  EXAM_INFO: 'examInfo',
};

/** 区块显示名称的 i18n key（用于「添加区块」等 UI） */
export const BLOCK_LABEL_KEYS = {
  [BLOCK_IDS.BASIC_INFO]: 'blocks.basicInfo',
  [BLOCK_IDS.SUMMARY]: 'blocks.summary',
  [BLOCK_IDS.SKILLS]: 'blocks.skills',
  [BLOCK_IDS.EXPERIENCE]: 'blocks.experience',
  [BLOCK_IDS.EDUCATION]: 'blocks.education',
  [BLOCK_IDS.HONORS]: 'blocks.honors',
  [BLOCK_IDS.INTERNSHIPS]: 'blocks.internships',
  [BLOCK_IDS.CERTIFICATIONS]: 'blocks.certifications',
  [BLOCK_IDS.EXAM_INFO]: 'blocks.examInfo',
};

/**
 * 布局类型：default 单栏，sidebar 左侧个人信息+右侧内容（GitHub 风格）
 */
export const LAYOUT_TYPES = {
  DEFAULT: 'default',
  SIDEBAR: 'sidebar',
};

/**
 * 模板配置：每个模板包含名称、布局与区块顺序
 */
export const TEMPLATES = [
  {
    id: 'modern',
    nameKey: 'templates.modern',
    layout: LAYOUT_TYPES.DEFAULT,
    blockOrder: [
      BLOCK_IDS.BASIC_INFO,
      BLOCK_IDS.SUMMARY,
      BLOCK_IDS.SKILLS,
      BLOCK_IDS.EXPERIENCE,
      BLOCK_IDS.EDUCATION,
    ],
  },
  {
    id: 'classic',
    nameKey: 'templates.classic',
    layout: LAYOUT_TYPES.DEFAULT,
    blockOrder: [
      BLOCK_IDS.BASIC_INFO,
      BLOCK_IDS.EDUCATION,
      BLOCK_IDS.EXPERIENCE,
      BLOCK_IDS.SKILLS,
    ],
  },
  {
    id: 'github',
    nameKey: 'templates.github',
    layout: LAYOUT_TYPES.SIDEBAR,
    blockOrder: [
      BLOCK_IDS.BASIC_INFO,
      BLOCK_IDS.SUMMARY,
      BLOCK_IDS.SKILLS,
      BLOCK_IDS.EXPERIENCE,
      BLOCK_IDS.EDUCATION,
      BLOCK_IDS.HONORS,
    ],
  },
  {
    id: 'ats-friendly',
    nameKey: 'templates.ats-friendly',
    layout: LAYOUT_TYPES.DEFAULT,
    blockOrder:[
      BLOCK_IDS.BASIC_INFO,
      BLOCK_IDS.EDUCATION,
      BLOCK_IDS.INTERNSHIPS,
      BLOCK_IDS.EXPERIENCE,
      BLOCK_IDS.SKILLS,
      BLOCK_IDS.CERTIFICATIONS,
    ]
  },
];

export const DEFAULT_TEMPLATE_ID = 'modern';
