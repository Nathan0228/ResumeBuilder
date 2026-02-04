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
};

/** 区块显示名称（用于「添加区块」等 UI） */
export const BLOCK_LABELS = {
  [BLOCK_IDS.BASIC_INFO]: '基本信息',
  [BLOCK_IDS.SUMMARY]: '个人评价',
  [BLOCK_IDS.SKILLS]: '专业技能',
  [BLOCK_IDS.EXPERIENCE]: '工作经历',
  [BLOCK_IDS.EDUCATION]: '教育背景',
  [BLOCK_IDS.HONORS]: '荣誉奖项',
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
    name: '现代风格',
    description: '基本信息 + 简介 + 技能 + 经历 + 教育',
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
    name: '经典风格',
    description: '基本信息 + 教育 + 经历 + 技能（无简介）',
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
    name: 'GitHub 风格',
    description: '左侧个人信息与链接，右侧经历/技能等',
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
];

export const DEFAULT_TEMPLATE_ID = 'modern';
