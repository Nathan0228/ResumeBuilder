/**
 * 将 YYYY-MM 转为简历显示格式 YYYY.MM
 */
export const monthToDisplay = (yyyyMm) => {
  if (!yyyyMm || typeof yyyyMm !== 'string') return '';
  const [y, m] = yyyyMm.split('-');
  if (!y || !m) return yyyyMm;
  return `${y}.${m}`;
};

/**
 * 格式化时间段：用于教育/工作经历
 * @param {string} startDate - YYYY-MM
 * @param {string} endDate - YYYY-MM 或空
 * @param {boolean} isPresent - 是否“至今”
 * @param {string} fallback - 旧数据没有 startDate 时的回退文案
 * @param {string} presentLabel - “至今”的翻译，如 '至今' / 'Present'
 */
export const formatDateRange = (startDate, endDate, isPresent, fallback = '', presentLabel = '至今') => {
  if (startDate) {
    const start = monthToDisplay(startDate);
    if (isPresent || !endDate) return `${start} - ${presentLabel}`;
    return `${start} - ${monthToDisplay(endDate)}`;
  }
  return fallback;
};
