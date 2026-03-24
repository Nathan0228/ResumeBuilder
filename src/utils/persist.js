/**
 * Creates a debounced version of the provided function.
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function with a `cancel` method
 */
export function debounce(fn, delay) {
  let timer = null;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

/**
 * Formats a timestamp to a localized string.
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {string}
 */
export function formatSaveTime(timestamp, lang = 'zh') {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', options);
}
