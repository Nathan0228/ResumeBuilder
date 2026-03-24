/**
 * 区块 ID，与预览组件一一对应，便于后续扩展样式和内容
 */
export const BLOCK_IDS = {
  BASIC_INFO: 'basicInfo',
  SUMMARY: 'summary',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  PROJECTS: 'projects',
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
  [BLOCK_IDS.PROJECTS]: 'blocks.projects',
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
      BLOCK_IDS.PROJECTS,
      BLOCK_IDS.CERTIFICATIONS,
      BLOCK_IDS.SUMMARY,
    ]
  },
];

export const DEFAULT_TEMPLATE_ID = 'modern';

/**
 * 主题色选项：name=显示名, color=Tailwind 色名, shade=数值 (50/100/200/300/400/500/600/700/800/900)
 * 格式：bg-{color}-{shade}、text-{color}-{shadeText}、border-{color}-{shadeBorder}
 */
export const ACCENT_COLORS = [
  {
    id: 'indigo',
    nameKey: 'accentColor.indigo',
    color: 'indigo',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'blue',
    nameKey: 'accentColor.blue',
    color: 'blue',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'violet',
    nameKey: 'accentColor.violet',
    color: 'violet',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'purple',
    nameKey: 'accentColor.purple',
    color: 'purple',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'pink',
    nameKey: 'accentColor.pink',
    color: 'pink',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'rose',
    nameKey: 'accentColor.rose',
    color: 'rose',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'red',
    nameKey: 'accentColor.red',
    color: 'red',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'orange',
    nameKey: 'accentColor.orange',
    color: 'orange',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'amber',
    nameKey: 'accentColor.amber',
    color: 'amber',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'emerald',
    nameKey: 'accentColor.emerald',
    color: 'emerald',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'teal',
    nameKey: 'accentColor.teal',
    color: 'teal',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'cyan',
    nameKey: 'accentColor.cyan',
    color: 'cyan',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'gray',
    nameKey: 'accentColor.gray',
    color: 'gray',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
  {
    id: 'slate',
    nameKey: 'accentColor.slate',
    color: 'slate',
    shade: 600,
    shadeText: 600,
    shadeBorder: 600,
  },
];

export const DEFAULT_ACCENT_COLOR = 'indigo';
