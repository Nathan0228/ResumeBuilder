import React from 'react';
import { useTranslation } from 'react-i18next';

const SummaryBlock = ({ data }) => {
  const { t } = useTranslation();
  if (!data.summary) return null;
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4 border-l-4 border-indigo-600 pl-3">
        {t('blocks.summary')}
      </h3>
      <p className="text-[13px] leading-7 text-gray-700 text-justify italic whitespace-pre-line">{data.summary}</p>
    </section>
  );
};

export default SummaryBlock;
