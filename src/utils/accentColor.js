/**
 * 主题色对应的 600 数值色 hex 值（用于颜色选择按钮和 inline style）
 */
export const ACCENT_COLOR_HEX = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  violet: '#7c3aed',
  purple: '#9333ea',
  pink: '#db2777',
  rose: '#e11d48',
  red: '#dc2626',
  orange: '#ea580c',
  amber: '#d97706',
  emerald: '#059669',
  teal: '#0d9488',
  cyan: '#0891b2',
  gray: '#6b7280',
  slate: '#64748b',
};

/**
 * 根据主题色配置获取 hover 深色 hex（用于链接 hover）
 * @param {Object} accent
 * @returns {string} hex color
 */
export const getAccentDarkHex = (accent) => {
  if (!accent) return '#3730a3';
  const colorMap = {
    indigo: '#3730a3',
    blue: '#1d4ed8',
    violet: '#5b21b6',
    purple: '#7e22ce',
    pink: '#be185d',
    rose: '#be123c',
    red: '#b91c1c',
    orange: '#c2410c',
    amber: '#b45309',
    emerald: '#047857',
    teal: '#0f766e',
    cyan: '#0e7490',
    gray: '#4b5563',
    slate: '#475569',
  };
  return colorMap[accent.color] || '#3730a3';
};

/**
 * 根据主题色配置生成 inline style
 * @param {Object} accent - ACCENT_COLORS 中的某一项
 * @param {'bg'|'text'|'border'|'borderColor'|'textDark'} type
 * @returns {Object} e.g. { backgroundColor: '#4f46e5' }
 */
export const accentStyle = (accent, type) => {
  if (!accent) return {};
  const hex = ACCENT_COLOR_HEX[accent.color] || ACCENT_COLOR_HEX['indigo'];

  switch (type) {
    case 'bg':
      return { backgroundColor: hex };
    case 'text':
      return { color: hex };
    case 'border':
    case 'borderColor':
      return { borderColor: hex };
    case 'textDark':
      return { color: getAccentDarkHex(accent) };
    default:
      return {};
  }
};

/**
 * 通过 accentColorId 查找 ACCENT_COLORS 中的配置
 * @param {string} id
 * @param {Array} accentColors
 * @returns {Object}
 */
export const getAccentConfig = (id, accentColors) => {
  return accentColors.find((c) => c.id === id) || accentColors[0];
};
