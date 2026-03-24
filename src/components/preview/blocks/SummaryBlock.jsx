import React from 'react';
import { useTranslation } from 'react-i18next';
import { accentStyle } from '../../../utils/accentColor';

const SummaryBlock = ({ data, titleGap = 'mb-4', accent }) => {
  const { t } = useTranslation();
  if (!data.summary) return null;
  return (
    <section>
      <h3 className={`text-xs font-bold text-gray-900 uppercase tracking-[0.2em] ${titleGap} border-l-4 pl-3`} style={accentStyle(accent, 'borderColor')}>
        {t('blocks.summary')}
      </h3>
      <p className="text-[13px] leading-7 text-gray-700 text-justify whitespace-pre-line">{data.summary}</p>
    </section>
  );
};

export default SummaryBlock;
