import React from 'react';
import { useTranslation } from 'react-i18next';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - 25 + i);

/** 年月选择器，value/onChange 为 YYYY-MM，月份显示随语言切换 */
const MonthYearInput = ({ value = '', onChange, disabled, className = '', title }) => {
  const { t } = useTranslation();
  const [y, m] = value ? value.split('-') : ['', ''];
  const year = y ? parseInt(y, 10) : '';
  const month = m ? parseInt(m, 10) : '';

  const handleChange = (newYear, newMonth) => {
    if (newYear && newMonth) {
      onChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
    } else {
      onChange('');
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`} title={title}>
      <select
        value={month}
        onChange={(e) => handleChange(year || CURRENT_YEAR, e.target.value ? parseInt(e.target.value, 10) : '')}
        disabled={disabled}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm min-w-0"
        aria-label={title}
      >
        <option value="">--</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
          <option key={n} value={n}>
            {t(`date.month${n}`)}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => handleChange(e.target.value ? parseInt(e.target.value, 10) : '', month || 1)}
        disabled={disabled}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm min-w-0"
        aria-label={title}
      >
        <option value="">--</option>
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </span>
  );
};

export default MonthYearInput;
